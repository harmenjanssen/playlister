'use strict';
/**
 * -----------------------------------------------------------------------------------------
 * Helpful libraries
 * -----------------------------------------------------------------------------------------
 */
const R = require('ramda');
const Spotify = require('spotify-web-api-js');

/**
 * -----------------------------------------------------------------------------------------
 * Utility functions
 * -----------------------------------------------------------------------------------------
 */
const getSpotifyEmbedRootUrl = function() {
  return 'https://embed.spotify.com/' +
    '?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

const getSpotifyEmbedUrl = function(trackIds) {
  return getSpotifyEmbedRootUrl() + trackIds.join(',');
};

const getTracknumberingRegexp = function() { return /^\[?\d+(\.|\])?/; };
const getSuffixRegexp = function() { return /(\(|\[)([^\)\]]+)(\)|\])$/; };
const getLastDashRegexp = function() { return /^(\s?-)/; };

const tracklistLooksLikeAList = function(tracks) {
  return R.filter(R.test(getTracknumberingRegexp()), tracks).length === tracks.length;
};

const removeCruftFromTrack = R.compose(R.trim,
                                       R.replace(getSuffixRegexp(), ''),
                                       R.replace(getTracknumberingRegexp(), ''));

const extractArtistAndTrack = function(track) {
  track = removeCruftFromTrack(track);
  let lastDash = R.lastIndexOf('-', track);
  // Split into track and artist, and clean up track since it will contain the dash.
  let trackObj = R.map(R.compose(R.trim, R.replace(getLastDashRegexp(), '')),
                       R.splitAt(lastDash, track));
  trackObj = R.zipObj(['artist', 'track'], trackObj);
  return trackObj;
};

const artistAndTrackToSpotifyQuery = (track) => {
  return `${track.artist} ${track.track}`;
};

const cleanupTrack = R.map(removeCruftFromTrack);

const findLiteralMatch = (query, trackResult) => {
  let findLiteral = R.and(R.propEq('name', query.track),
                     R.contains(query.artist, trackResult.artists))
  return R.findIndex(findLiteral, trackResult);
};

const grabTrackIdsFromSpotify = function(tracks) {
  let spotifyApi = new Spotify();

  let promises = [];
  R.forEach(track => {
    promises.push(
      R.memoize(spotifyApi.searchTracks)(artistAndTrackToSpotifyQuery(track))
        .then(R.compose(R.prop('items'), R.prop('tracks')))
        .then(R.sort((a, b) => {
          // Sort literal matches on top
          return undefined === findLiteralMatch(track, a) ? -1 :
            undefined === findLiteralMatch(track, b) ? 1 : 0;
        }))
    );
  }, tracks);
  return Promise.all(promises).then(R.filter(R.length))
};

const parseTracklist = R.compose(grabTrackIdsFromSpotify,
                 R.map(extractArtistAndTrack),
                 R.filter(Boolean));

const getTracklist = R.compose(R.map(R.trim), R.split("\n"), R.prop('value'));

/**
 * -----------------------------------------------------------------------------------------
 * Main API
 * -----------------------------------------------------------------------------------------
 */
const createEmbed = function(tracks) {
  let trackIds = R.map(R.compose(R.prop('id'), R.head), tracks);
  let out = `<iframe src="${getSpotifyEmbedUrl(trackIds)}" frameborder="0"
      allowtransparency="true" width="640" height="720"></iframe>`;
  return out;
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
