const tracklister = require('./tracklister.js');
let createBtn = document.querySelector('.create-playlists-btn');
let tracklistTxt = document.querySelector('.tracklist-txt');

createBtn.addEventListener('click', e => {
	e.preventDefault();
	tracklister.createPlaylist(tracklistTxt)
		.then(tracks => {
			console.log(tracks);
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
console.log(`
Jay Dee - Rico Suave
Roy Ayers - Life Is Just A Moment
Bahamadia - Funky 4 U (Jay Dee Remix)
Tall Black Guy - Al Greens Dream
Dam Funk - Live From Free Kutmah Show In L.A
Afrika Bambaataa + James Brown - Unity (Georgia Anne Muldrow Remix)
Shash'u - Boogie Buster [Hit And Run - Forthcoming]
Seven Davis Jr - Feel High [Izwid - Forthcoming]
Sa-Ra - Feel The Bass
DJ Sliink - Stop Me Now
Trim - Trousers
Dubbel Dutch - Madloopz
Eprom - Dirty Diamonds
Flako Exclusive Shit! ?
Digital Mystikz - Anti War Dub (Black Lite Juke Edit)
Jo-Def - Took It Thuur
Biggie - Hypnotise (Shash'u Remix)
Marvin Gaye - Sexual Healing (Obol Remix)
Flying Lotus - Raise It Up
Jaylib - The Red
`)
