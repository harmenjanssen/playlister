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
