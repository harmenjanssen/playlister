/*
const Task = require("data.task");
const Rx = require("rx");
const R = require("ramda");

const tracklister = require("./tracklister.js");

const $ = document.querySelector.bind(document);

const tracklistTxt = $(".tracklist-text");

const embedFromTracklist = tracklister.createEmbed(tracklistTxt);

const trace = x => {
  console.log(x);
  return x;
};

const renderHtml = R.curry((target, html) => $(target).innerHTML = html);

/****
 *
 * Ok, wtf am i doing?
 * Zo komt het nooit af. Flikker die RX eruit, en doe gewoon
 *
 * knopje.addEventListener('click', forkdieshit())
 *
 * Seriously though, er is letterlijk ÉÉN klik in het hele programma die ertoe doet.
 * Daarvoor RX inladen is wel zo een anti-pattern.
 *
 * Maak dit kakding nou eens af dan kun je je eigen site gaan fixen 🙄
 *
 ******/

// Kick things off
//$(".create-playlists-btn").addEventListener("click", e =>
//embedFromTracklist.fork(trace, renderHtml($("#embed-container"))));

/*

const on = R.curry(
  (evt, f, elm) =>
    new Task((reject, resolve) => {
      return elm.addEventListener(evt, f);
    })
);

const tracklistTxt = $(".tracklist-txt");

const createBtn = $(".create-playlists-btn").chain(
  on("click", e => {
    console.log("click!");
  })
);
console.log(createBtn);

createBtn.fork(console.error, console.log);

/*
createBtn.addEventListener("click", e => {
  e.preventDefault();
  tracklister.createPlaylist(tracklistTxt).then(tracks => {
    const iframe = tracklister.createEmbed(tracks);
    iframe.addEventListener("load", () => {
      document.querySelector(".main-app").classList.toggle("has-results");
    });
    document.querySelector("#embed-container").appendChild(iframe);
  });
});
*/
