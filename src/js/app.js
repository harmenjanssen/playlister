import { $, maybe, tap, identity, trace, prop, propIn } from "./support/util";

// getSpotifyEmbedRootUrl :: String
const getSpotifyEmbedRootUrl = () =>
  "https://embed.spotify.com/?theme=dark&view=list&uri=spotify:trackset:tracklister:";

// createEmbedSrcUrl :: String -> String
const getIframeUrl = tracklist => {
  return getSpotifyEmbedRootUrl();
};

// getIframe :: Document -> String -> DOMNode
const getIframe = doc =>
  src => {
    return doc.createElement("iframe");
  };

// renderPlaylist :: Maybe DOMNode -> String
const renderPlaylist = document =>
  tracklist => {
    const tracklistTxt = tracklist.fold(_ => "", prop("value"));
    return getIframe(document)(getIframeUrl(tracklistTxt));
  };

const main = document => {
  $(".main-form").map(
    tap(form => {
      // Augh! Impurity!
      // Maybe fix at some point, but it's literally the *only* event listener in the app.
      form.addEventListener("submit", e => {
        e.preventDefault();
        const embed = getIframe(document)(
          propIn(["target", "children", "tracklist"], e)
        );
        document.appendChild(embed);
      });
    })
  );
};

main(document);
