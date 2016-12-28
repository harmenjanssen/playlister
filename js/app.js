const tracklister = require('./tracklister.js');

const createBtn    = document.querySelector('.create-playlists-btn');
const tracklistTxt = document.querySelector('.tracklist-txt');

createBtn.addEventListener('click', e => {
	e.preventDefault();
	tracklister.createPlaylist(tracklistTxt)
	.then(tracks => {
		const iframe = tracklister.createEmbed(tracks);
    iframe.addEventListener('load', () => {
      document.querySelector('.main-app').classList.toggle('has-results');
    });
		document.querySelector('#embed-container').appendChild(iframe);
	});
});
