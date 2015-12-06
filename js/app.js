var createBtn = document.querySelector('.create-playlists-btn');
var tracklistTxt = document.querySelector('.tracklist-txt');

var getSpotifyEmbedRootUrl = function() {
	return 'https://embed.spotify.com/' +
		'?theme=dark&view=list&uri=spotify:trackset:tracklister:';
};

var getSpotifyEmbedUrl = function(trackIds) {
	return getSpotifyEmbedRootUrl() +
		trackIds.join(',');
};

var getTracklist = function(sourceElm) {
	return sourceElm.value.split("\n").filter(Boolean);
};

var parseTracklist = function(tracks) {
	console.log(tracks);
	return tracks;
};

var createEmbed = function(tracks) {
  	var out = '<iframe src="' + getSpotifyEmbedUrl(tracks) + '" frameborder="0"';
  	out += 'allowtransparency="true" width="640" height="720"></iframe>';
	return out;
};

var createPlaylist = function(sourceElm) {
	return (e) => {
		e.preventDefault();
		var iframe = createEmbed(
			parseTracklist(
				getTracklist(sourceElm)));
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
