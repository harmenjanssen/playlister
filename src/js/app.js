import { $, maybe, tap, identity, trace, prop, propIn } from "./support/util";

// getSpotifyEmbedRootUrl :: String
const getSpotifyEmbedRootUrl = () =>
  "https://embed.spotify.com/?theme=dark&view=list&uri=spotify:trackset:tracklister:";

// createEmbedSrcUrl :: String -> String
const getIframeUrl = tracklist =>
  `${getSpotifyEmbedRootUrl()}${trackListToIds(tracklist).join(",")}`;

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

// renderPlaylist :: Maybe DOMNode -> String
const renderPlaylist = document =>
  tracklist => {
    const tracklistTxt = tracklist.fold(_ => "", prop("value"));
    return getIframe(document)(getIframeUrl(tracklistTxt));
  };

// Augh! Impurity!
// Maybe fix at some point, but it's literally the *only* event listener in the app.
const formOnSubmit = tap(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const embed = getIframe(document)(propIn(["target", "children", "tracklist"], e));
    document.body.appendChild(embed);
  });
});

const main = document => {
  $(".main-form").map(formOnSubmit);
};

main(document);
