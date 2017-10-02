import { $, replace, compose, maybe, tap, identity, trace, prop, propIn } from "./support/util";
import { getIframeUrl } from "./playlister";

// getIframe :: Document -> String -> DOMNode
const getIframe = doc =>
  src => {
    const iframe = doc.createElement("iframe");
    iframe.setAttribute("src", src);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("width", 640);
    iframe.setAttribute("height", 720);
    return iframe;
  };

// renderPlaylist :: Maybe DOMNode -> Promise String
const renderPlaylist = document =>
  tracklist => {
    const tracklistTxt = tracklist.fold(_ => "", prop("value"));
    return getIframeUrl(tracklistTxt).then(getIframe(document));
  };

// Augh! Impurity!
// Maybe fix at some point, but it's literally the *only* event listener in the app.
// formOnSubmit :: DOMNode -> DOMNode
const formOnSubmit = tap(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    renderPlaylist(document)(propIn(["target", "children", "tracklist"])(e)).then(embed =>
      document.body.appendChild(embed));
  });
});

// main :: Document -> DOMNode
const main = document => $(".main-form").map(formOnSubmit);

main(document);
