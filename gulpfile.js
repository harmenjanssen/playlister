var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    autoprefixer    = require('autoprefixer'),
    browserify      = require('browserify'),
    watchify        = require('watchify'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    assign          = require('lodash.assign'),
    del             = require('del'),
    sync            = require('browser-sync');

gulp.task('default', ['clean', 'html', 'sync', 'css'], function () {
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./*.html', ['html']);
});

gulp.task('clean', function () {
  return del.sync('dist/*');
});

gulp.task('html', function () {
    gulp.src('./index.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function () {
    gulp.src('./scss/**/*.scss')
        .pipe($.sass()).on('error', $.sass.logError)
        .pipe($.postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe($.minifyCss({compatibility: 'ie10'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(sync.reload({stream:true}));
});

gulp.task('sync', ['js'], function() {
    sync.init(['./dist/*.{html,css,js,json,jpg}'], {
        server: {
            baseDir: './dist/'
        },
        open: false,     // don't open the browser
        notify: false,   // hide the notify on the corner
        ghostMode: {
            clicks: true,
            location: true,
            forms: true,
            scroll: true
        }
    });

});

gulp.task('js', bundle);

gulp.task('test', function() {
	return gulp.src('tests/**/*.js', {read: false})
		// gulp-mocha needs filepaths so you can't have any plugins before it
		.pipe(mocha({reporter: 'nyan'}));
});

var customOpts = {
    entries: ['./js/app.js'],
    debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).on('error', $.util.log));
b.transform('babelify');
b.on('update', bundle);

function bundle() {
    return b.bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe($.sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist'))
        .pipe(sync.reload({stream:true}));
}
