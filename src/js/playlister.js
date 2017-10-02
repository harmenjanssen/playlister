import { compose, replace, identity, tap, trace } from "./support/util";

const Spotify = require("spotify-web-api-js");

// getSpotifyEmbedRootUrl :: String
const getSpotifyEmbedRootUrl = () =>
  "https://embed.spotify.com/?theme=dark&view=list&uri=spotify:trackset:tracklister:";

// getTracknumberingRegexp :: RegExp
const getTracknumberingRegexp = () => /^\[?\d+(\.|\])?/;

// getSuffixRegexp :: RegExp
const getSuffixRegexp = () => /(\(|\[)([^)\]]+)(\)|\])$/;

// removeCruftFromTrack :: String -> String
export const removeCruftFromTrack = compose(
  x => x.trim(),
  replace(/\s+/g)(" "),
  replace(getSuffixRegexp())(""),
  replace(getTracknumberingRegexp())("")
);

// trackListToIds :: Maybe String -> [Promise]
const trackListToIds = tracklist => {
  const SpotifyApi = new Spotify();
  const lines = tracklist.map(x => x.split("\n")).fold([], identity).map(removeCruftFromTrack);
  return Promise.all(lines.map(SpotifyApi.searchTracks.bind(SpotifyApi)));
};

// createEmbedSrcUrl :: String -> Promise String
export const getIframeUrl = tracklist =>
  trackListToIds(tracklist)
    .then(tap(trace))
    .then(trackIds => `${getSpotifyEmbedRootUrl()}${trackIds.join(",")}`);
