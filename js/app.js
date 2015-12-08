let createBtn = document.querySelector('.create-playlists-btn');
let tracklistTxt = document.querySelector('.tracklist-txt');

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
