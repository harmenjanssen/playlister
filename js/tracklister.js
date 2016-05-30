'use strict';
const R = require('ramda');
const Spotify = require('spotify-web-api-js');

const getSpotifyEmbedRootUrl = function() {
	return 'https://embed.spotify.com/' +
		'?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

const getSpotifyEmbedUrl = function(trackIds) {
	return getSpotifyEmbedRootUrl() +
		trackIds.join(',');
};

const getTracknumberingRegexp = () => /^\[?\d+(\.|\])?/;
const getSuffixRegexp = () => /(\(|\[)([^\)\]]+)(\)|\])$/;

const tracklistLooksLikeAList = function(tracks) {
	return R.filter(track => getTracknumberingRegexp().test(track), tracks).length ===
		tracks.length;
};

const removeCruftFromTrack = R.compose(R.trim,
									   R.replace(getSuffixRegexp(), ''),
									   R.replace(getTracknumberingRegexp(), ''));

const extractArtistAndTrack = function(track) {
	let trackObj = R.map(removeCruftFromTrack(),
						 R.split('-', track));
	trackObj = R.zipObj(['artist', 'track'], trackObj);
	return trackObj;
};

const artistAndTrackToSpotifyQuery = (track) => {
	return `artist:${track.artist} track:${track.track}`;
};

const cleanupTrack = R.map(removeCruftFromTrack);

const grabTrackIdsFromSpotify = function(tracks) {
	let spotifyApi = new Spotify();

	let promises = [];
	R.forEach(track => {
		promises.push(
			spotifyApi.searchTracks(artistAndTrackToSpotifyQuery(track))
				.then(R.compose(R.prop('items'), R.prop('tracks')))
				//.then(R.map(R.sort((a, b) => {
					//console.log(a, b);
					//return 1;
				//})))
		);
	}, tracks);
	if (5 < 19) {
		return Promise.all(promises).then(R.filter(R.length))
	}

	return Promise.all(R.map(spotifyApi.searchTracks, R.map(artistAndTrackToSpotifyQuery, tracks)))
		.then(R.filter(track => track.tracks.items.length))
		.then(R.map(R.compose(R.prop('items'), R.prop('tracks'))))
		// somewhere around here: sort 'items' by literal match
		.then(R.map(R.sort((a, b) => {


		})))
		.then(R.map(R.compose(R.prop('id'), R.head)))
};

const createEmbed = function(tracks) {
	let trackIds = R.map(R.compose(R.prop('id'), R.head), tracks);
  let out = `<iframe src="${getSpotifyEmbedUrl(trackIds)}" frameborder="0"
  		allowtransparency="true" width="640" height="720"></iframe>`;
	return out;
};

const parseTracklist = R.compose(grabTrackIdsFromSpotify,
								 R.map(extractArtistAndTrack),
								 R.filter(Boolean));

const getTracklist   = R.compose(R.split("\n"), R.prop('value'));
const createPlaylist = R.compose(parseTracklist, getTracklist);

// Export public entry point but also a couple of methods that need unit tests.
module.exports = {
	createPlaylist,
	createEmbed,
	extractArtistAndTrack,
	tracklistLooksLikeAList
};
