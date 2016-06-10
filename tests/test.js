'use strict';
const tracklister = require('../js/tracklister.js');
const test = require('tape');

test('tracklister.tracklistLooksLikeAList', function(assert) {
	const numberedList = ['1. Banana', '2. Cookies', '3. Pudding'];
	const numberedListWithLeadingZeroes = ['01. Banana', '02. Cookies', '03. Pudding'];
	const numberedListWithoutDots = ['1 Banana', '2 Cookies', '3 Pudding'];
	assert.ok(tracklister.tracklistLooksLikeAList(numberedList),
			  'It should recognize a numbered tracklist');

	assert.ok(tracklister.tracklistLooksLikeAList(numberedListWithLeadingZeroes),
	 			'It should recognize a numbered tracklist with leading zeroes');

	assert.ok(tracklister.tracklistLooksLikeAList(numberedListWithoutDots),
			  'It should recognize a numbered list without dots');

	assert.end();
});

test('tracklister.extractArtistAndTrack', function(assert) {
	const trackFixture = {
		artist: "Miles Davis",
		track: "Freddie Freeloader"
	};
	assert.deepEquals(tracklister.extractArtistAndTrack('Miles Davis - Freddie Freeloader'),
					  trackFixture,
					  'It should recognize a simple artist - track string');

	assert.deepEquals(tracklister.extractArtistAndTrack('  Miles Davis\t-\tFreddie Freeloader '),
					  trackFixture,
					  'It should do so regardless of whitespace');

	assert.deepEquals(tracklister.extractArtistAndTrack('03. Miles Davis - Freddie Freeloader'),
					  trackFixture,
					  'It should ignore track numbers');

	assert.deepEquals(tracklister.extractArtistAndTrack('3 Miles Davis - Freddie Freeloader'),
					  trackFixture,
					  'It should ignore differently formatted numbers');

	assert.deepEquals(tracklister.extractArtistAndTrack('[03] Miles Davis - Freddie Freeloader'),
					  trackFixture,
					  'It should seriously ignore all track numbers');

	assert.deepEquals(tracklister.extractArtistAndTrack('Miles Davis - Freddie Freeloader [Blue Note]'),
					  trackFixture,
					  'It should strip off anything trailing in brackets');

	assert.deepEquals(tracklister.extractArtistAndTrack('Miles Davis - Freddie Freeloader (Blue Note, 1959)'),
					  trackFixture,
					  'It should strip off anything trailing in parentheses');

  let saRaFixture = { artist: 'Sa-Ra Creative Partners', track: 'Cosmic Ball' };
  assert.deepEquals(tracklister.extractArtistAndTrack('Sa-Ra Creative Partners - Cosmic Ball'),
                    saRaFixture, 'It should somehow recognize artists containing dashes');

	assert.end();
});
