/* eslint-disable */
/**
 * -----------------------------------------------------------------------------------------
 * Helpful libraries
 * -----------------------------------------------------------------------------------------
 */
//const R = require("ramda");
const R = {};
const Spotify = require("spotify-web-api-js");

/**
 * -----------------------------------------------------------------------------------------
 * Utility functions
 * -----------------------------------------------------------------------------------------
 */
const getSpotifyEmbedRootUrl = () =>
  "https://embed.spotify.com/?theme=dark&view=list&uri=spotify:trackset:tracklister:";

const getSpotifyEmbedUrl = trackIds => {
  getSpotifyEmbedRootUrl() + trackIds.join(",");
};

const getTracknumberingRegexp = () => /^\[?\d+(\.|\])?/;
const getSuffixRegexp = () => /(\(|\[)([^\)\]]+)(\)|\])$/;
const getLastDashRegexp = () => /^(\s?-)/;

const tracklistLooksLikeAList = tracks =>
  R.filter(R.test(getTracknumberingRegexp()), tracks).length === tracks.length;

const removeCruftFromTrack = R.compose(
  R.trim,
  R.replace(getSuffixRegexp(), ""),
  R.replace(getTracknumberingRegexp(), "")
);

const extractArtistAndTrack = track => {
  track = removeCruftFromTrack(track);
  const lastDash = R.lastIndexOf("-", track);
  // Split into track and artist, and clean up track since it will contain the dash.
  const trackObj = R.map(
    R.compose(R.trim, R.replace(getLastDashRegexp(), "")),
    R.splitAt(lastDash, track)
  );
  return R.zipObj(["artist", "track"], trackObj);
};

const artistAndTrackToSpotifyQuery = track => `${track.artist} ${track.track}`;

const cleanupTrack = R.map(removeCruftFromTrack);

const findLiteralMatch = (query, trackResult) => {
  const findLiteral = R.and(
    R.propEq("name", query.track),
    R.contains(query.artist, trackResult.artists)
  );
  return R.findIndex(findLiteral, trackResult);
};

const grabTrackIdsFromSpotify = tracks => {
  const spotifyApi = new Spotify();
  const promises = [];
  R.forEach(
    track => {
      promises.push(
        R.memoize(spotifyApi.searchTracks)(artistAndTrackToSpotifyQuery(track))
          .then(R.compose(R.prop("items"), R.prop("tracks")))
          .then(
            R.sort((a, b) => {
              // Sort literal matches on top
              return undefined === findLiteralMatch(track, a)
                ? -1
                : undefined === findLiteralMatch(track, b) ? 1 : 0;
            })
          )
      );
    },
    tracks
  );
  return Promise.all(promises).then(R.filter(R.length));
};

const parseTracklist = R.compose(
  grabTrackIdsFromSpotify,
  R.map(extractArtistAndTrack),
  R.filter(Boolean)
);

const getTracklist = R.compose(R.map(R.trim), R.split("\n"), R.prop("value"));

/**
 * -----------------------------------------------------------------------------------------
 * Main API
 * -----------------------------------------------------------------------------------------
 */
const createEmbed = tracks => {
  const trackIds = R.map(R.compose(R.prop("id"), R.head), tracks);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", getSpotifyEmbedUrl(trackIds));
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("width", 640);
  iframe.setAttribute("height", 720);
  return iframe;
};

const createPlaylist = R.compose(parseTracklist, getTracklist);

/**
 * -----------------------------------------------------------------------------------------
 * Export public entry point but also a couple of methods that I want to unit test.
 * -----------------------------------------------------------------------------------------
 */
module.exports = {
  createPlaylist,
  createEmbed,
  extractArtistAndTrack,
  tracklistLooksLikeAList
};
