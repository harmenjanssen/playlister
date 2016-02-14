const tracklister = require('./tracklister.js');
let createBtn = document.querySelector('.create-playlists-btn');
let tracklistTxt = document.querySelector('.tracklist-txt');

createBtn.addEventListener('click', e => {
	e.preventDefault();
	tracklister.createPlaylist(tracklistTxt)
		.then(tracks => {
			let iframe = tracklister.createEmbed(tracks);
			document.querySelector('#embed-container').innerHTML = iframe;
		});
});


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
