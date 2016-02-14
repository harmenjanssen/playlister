'use strict';
const R = require('ramda');

const getSpotifyEmbedRootUrl = function() {
	return 'https://embed.spotify.com/' +
		'?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

const getSpotifyEmbedUrl = function(trackIds) {
	return getSpotifyEmbedRootUrl() +
		trackIds.join(',');
};

const getTracknumberingRegexp = () => { return /^\[?\d+(\.|\])?/; };

const tracklistLooksLikeAList = function(tracks) {
	return R.filter(track => getTracknumberingRegexp().test(track), tracks).length ===
		tracks.length;
};

const extractArtistAndTrack = function(track) {
	let trackObj = R.map(R.compose(R.trim, R.replace(getTracknumberingRegexp(), '')),
						 R.split('-', track));
	trackObj = R.zipObj(['artist', 'track'], trackObj);
	return trackObj;
};

const grabTrackIdsFromSpotify = function(tracks) {
	return Promise.resolve(tracks);
};

const createEmbed = function(tracks) {
	console.log(tracks);
	if (10> 9){
		return '';
	}
  	let out = `<iframe src="${getSpotifyEmbedUrl(tracks)}" frameborder="0"
  		allowtransparency="true" width="640" height="720"></iframe>`;
	return out;
};

const parseTracklist = R.compose(grabTrackIdsFromSpotify, R.map(extractArtistAndTrack));
const getTracklist   = R.compose(R.split("\n"), R.prop('value'));
const createPlaylist = R.compose(parseTracklist, getTracklist);

// Export public entry point but also a couple of methods that need unit tests.
module.exports = {
	createPlaylist,
	createEmbed,
	extractArtistAndTrack,
	tracklistLooksLikeAList
};
