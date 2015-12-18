'use strict';
const getSpotifyEmbedRootUrl = function() {
	return 'https://embed.spotify.com/' +
		'?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

const getSpotifyEmbedUrl = function(trackIds) {
	return getSpotifyEmbedRootUrl() +
		trackIds.join(',');
};

const getTracklist = function(sourceElm) {
	return sourceElm.value.split("\n");
};

const tracklistLooksLikeAList = function(tracks) {
	return tracks.filter(track => /^\d+\./.test(track)).length === tracks.length;
};

const extractArtistAndTrack = function(track) {


	return track;
};

const grabTrackIdsFromSpotify = function(tracks) {
	return Promise.resolve(tracks);
};

const parseTracklist = function(tracks) {
	return grabTrackIdsFromSpotify(
		tracks.map(extractArtistAndTrack));
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

const createPlaylist = function(sourceElm) {
	return (e) => {
		e.preventDefault();
		parseTracklist(
			getTracklist(sourceElm)).then(tracks => {
				let iframe = createEmbed(tracks);
				document.querySelector('#embed-container').innerHTML = iframe;
			});
	};
};

// Export public entry point but also a couple of methods that need unit tests.
module.exports = {
	createPlaylist,
	extractArtistAndTrack,
	tracklistLooksLikeAList
};
