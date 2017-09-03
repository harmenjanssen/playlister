/**
 * Gulpfile
 * Author: Mattijs Bliek
 *
 * See README.md for usage instructions
 * -------------------------------------------------------------
 */

var gulp = require("gulp"),
  gulpLoadPlugins = require("gulp-load-plugins"),
  $ = gulpLoadPlugins(),
  copy = require("gulp-copy"),
  pxtorem = require("postcss-pxtorem"),
  autoprefixer = require("autoprefixer"),
  browserSync = require("browser-sync"),
  browserify = require("browserify"),
  babelify = require("babelify"),
  del = require("del"),
  watchify = require("watchify"),
  assign = require("lodash.assign"),
  runSequence = require("run-sequence"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  path = require("path"),
  reworkUrl = require("rework-plugin-url"),
  sassGlob = require("gulp-sass-glob"),
  execSync = require("child_process").execSync,
  argv = require("yargs").argv;

var isWatching = false;
var ENV = argv.e ? argv.e : "development";
var PROFILE = argv.profile ? argv.profile : "development";
var paths = {
  cssBuild: "./dist/css",
  jsBuild: "./dist/js",
  imgBuild: "./dist/css/img",
  cssSrc: "./src/scss",
  jsSrc: "./src/js",
  imgSrc: "./src/scss/img"
};

/**
 * Deletes all previous build files
 */
gulp.task("clean", function() {
  return del([paths.cssBuild + "/**/*", paths.jsBuild + "/**/*"], {
    dot: true
  });
});

/**
 * Auto refresh and hot reloading in the browser
 *
 * Also makes your development computer available to
 * third party devices over the network.
 */
gulp.task("browser-sync", function() {
  browserSync({
    //proxy: domain,
    open: false,
    notify: {
      styles: [
        "display: none",
        "padding: 15px",
        "font-family: sans-serif",
        "position: fixed",
        "font-size: 0.9em",
        "z-index: 9999",
        "right: 0px",
        "bottom: 0px",
        "border-top-left-radius: 5px",
        "background-color: rgb(27, 32, 50)",
        "margin: 0",
        "color: white",
        "text-align: center"
      ]
    }
  });
});

/**
 * Builds css files
 */
gulp.task("sass", function() {
  var processors = [
    autoprefixer({
      browsers: [">5%", "last 2 versions", "ie 9", "ie 10"]
    }),
    pxtorem({
      root_value: 10,
      unit_precision: 5,
      prop_white_list: ["font", "font-size"],
      replace: false,
      media_query: false
    })
  ];

  return gulp
    .src(paths.cssSrc + "/base.scss")
    .pipe(sassGlob())
    .pipe($.sass().on("error", $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(ENV !== "development" || PROFILE === "production", $.csso()))
    .pipe(gulp.dest(paths.cssBuild))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Javascript bundle with Browserify
 */
var b;

function initBrowserify() {
  var customOpts = {
    entries: paths.jsSrc + "/app.js"
  };
  var opts = assign({}, watchify.args, customOpts);
  b = browserify(opts);

  // If this is a watch task, wrap browserify in watchify
  if (isWatching) {
    b = watchify(b);
  }
  b
    .transform(babelify, {
      presets: ["es2015"]
    })
    .on("error", handleError);

  b.on("update", bundle);
  bundle();
}

gulp.task("javascript", initBrowserify);

function bundle() {
  eslint();

  return b
    .bundle()
    .on("error", handleError)
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(
      $.if(
        ENV === "development" && PROFILE !== "production",
        $.sourcemaps.init({ loadMaps: true })
      )
    )
    .pipe($.if(ENV !== "development" || PROFILE === "production", $.uglify()))
    .on("error", handleError)
    .pipe(
      $.if(
        ENV === "development" && PROFILE !== "production",
        $.sourcemaps.write({ loadMaps: true })
      )
    )
    .pipe(gulp.dest(paths.jsBuild))
    .pipe(browserSync.stream({ once: true }));
}

gulp.task("bundle", bundle);

/**
 * Lints JS
 */
function eslint() {
  return gulp
    .src(paths.jsSrc + "/**/*.js")
    .pipe($.eslint("./.eslintrc").on("error", handleError))
    .pipe($.eslint.format());
}

gulp.task("eslint", eslint);

/**
 * Compresses images
 */
gulp.task("images", function() {
  if (argv.skipImages) {
    return;
  }
  $.util.log($.util.colors.green("Building images to " + paths.imgBuild));
  return gulp
    .src(paths.imgSrc + "/*.{png,gif,jpg,svg}")
    .pipe(
      $.imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }]
      })
    )
    .on("error", handleError)
    .pipe(gulp.dest(paths.imgBuild));
});

/**
 * Copy fonts
 */
gulp.task("fonts", function() {
  return gulp
    .src(paths.fontSrc + "/*.{ttf,eot,woff,woff2}")
    .pipe(copy(paths.fontBuild, { prefix: 3 }));
});

/**
 * Creates an svg sprite out of all files in the public/css/img/icons folder
 *
 * This sprite is lazy loaded with JS, see load-icons.js for more info
 */
gulp.task("images:icons", function() {
  return gulp
    .src(paths.css + "/img/icons/*.svg")
    .pipe(
      $.svgmin(function(file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + "-",
                minify: true
              }
            }
          ]
        };
      }).on("error", handleError)
    )
    .pipe($.svgstore({ inlineSvg: true }).on("error", handleError))
    .pipe(gulp.dest(paths.cssBuild + "/img"));
});

/**
 * Watches for file changes and runs Gulp tasks accordingly
 */
gulp.task("watch", ["default", "browser-sync"], function(cb) {
  isWatching = true;

  gulp.watch([paths.cssSrc + "/**/*.scss"], ["sass"]);
  gulp.watch(paths.cssSrc + "/img/icons/*.svg", ["icons"]);
  gulp.watch(paths.jsSrc + "/**/*.js", ["bundle"]);
  gulp.watch(paths.imgSrc + "/**/*.{gif,jpg,svg,png}", ["images"]);
  //gulp.watch(paths.fontSrc + "/**/*.{ttf,eot,woff,woff2}", ["fonts"]);
  gulp.watch("src/*.html", browserSync.reload);
});

/**
 * Add revision hash behind filename so we can cache assets forever
 */
gulp.task("revision:hash", function() {
  var cssFilter = $.filter("**/*.css", { restore: true });
  var jsFilter = $.filter("**/*.js", { restore: true });
  var imgFilter = $.filter("**/*.{png,gif,jpg,svg}", { restore: true });

  return gulp
    .src([
      paths.cssBuild + "/base.css",
      paths.imgBuild + "/*.{png,gif,jpg,svg}",
      paths.jsBuild + "/app.js"
    ])
    .pipe($.rev())
    .pipe($.revDeleteOriginal())
    .pipe(cssFilter)
    .pipe(gulp.dest(paths.cssBuild))
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe(gulp.dest(paths.jsBuild))
    .pipe(jsFilter.restore)
    .pipe(imgFilter)
    .pipe(gulp.dest(paths.imgBuild))
    .pipe(imgFilter.restore)
    .pipe($.rev.manifest("rev-manifest-" + ENV + ".json"))
    .pipe(gulp.dest("./"));
});

/*
 * Replace image and font urls in css files
 */

gulp.task("revision:replace:css", function() {
  var manifestFile = "./rev-manifest-" + ENV + ".json";
  var manifest = gulp.src(manifestFile);

  return gulp
    .src(paths.cssBuild + "/*.css")
    .pipe($.revReplace({ manifest: manifest }))
    .pipe(gulp.dest(paths.cssBuild));
});

/**
 * Replace image and font urls in js files
 */
gulp.task("revision:replace:js", function() {
  var manifestFile = "./rev-manifest-" + ENV + ".json";
  var manifest = gulp.src(manifestFile);

  return gulp
    .src(paths.jsBuild + "/*.js")
    .pipe($.revReplace({ manifest: manifest }))
    .pipe(gulp.dest(paths.jsBuild));
});

/**
 * Revision tasks wrapper
 */
gulp.task("revision", function(cb) {
  if (ENV === "development") {
    $.util.log("Skipping revisioning for development");
    return cb();
  }
  runSequence(
    "revision:hash",
    "revision:replace:css",
    "revision:replace:js",
    cb
  );
});

gulp.task("default", function(cb) {
  runSequence(
    "clean",
    [
      "sass",
      "javascript",
      "images",
      "images:icons"
      //"fonts",
    ],
    "revision",
    cb
  );
});

/**
 * ----------------------------------------------------
 *
 * Utility functions
 *
 * ----------------------------------------------------
 */
function handleError(error, emitEnd) {
  if (typeof emitEnd === "undefined") {
    emitEnd = true;
  }
  $.util.beep();
  $.util.log(
    $.util.colors.white.bgRed("Error!"),
    $.util.colors.red(error.toString())
  );
  if (emitEnd) {
    this.emit("end");
  }
}
