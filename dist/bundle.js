(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var createBtn = document.querySelector('.create-playlists-btn');
var tracklistTxt = document.querySelector('.tracklist-txt');

var getSpotifyEmbedRootUrl = function getSpotifyEmbedRootUrl() {
	return 'https://embed.spotify.com/' + '?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

var getSpotifyEmbedUrl = function getSpotifyEmbedUrl(trackIds) {
	return getSpotifyEmbedRootUrl() + trackIds.join(',');
};

var getTracklist = function getTracklist(sourceElm) {
	return sourceElm.value.split("\n").filter(Boolean);
};

var parseTracklist = function parseTracklist(tracks) {
	console.log(tracks);
	return tracks;
};

var createEmbed = function createEmbed(tracks) {
	var out = '<iframe src="' + getSpotifyEmbedUrl(tracks) + '" frameborder="0"';
	out += 'allowtransparency="true" width="640" height="720"></iframe>';
	return out;
};

var createPlaylist = function createPlaylist(sourceElm) {
	return function (e) {
		e.preventDefault();
		var iframe = createEmbed(parseTracklist(getTracklist(sourceElm)));
		document.querySelector('#embed-container').innerHTML = iframe;
	};
};

createBtn.addEventListener('click', createPlaylist(tracklistTxt));

/*

		url +=
		trackI
			if (!song.tracks.length) {
				return;
			}
			var foreignIdField = 'foreign_id';
			var track1 = song.tracks[0][foreignIdField];
			var bits = track1.split(':');
			var songId = bits[bits.length-1];
			url += songId;
			if (index < $scope.songs.length - 1) {
				url += ',';
			}
		});
		return url;
	}

   */

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map
