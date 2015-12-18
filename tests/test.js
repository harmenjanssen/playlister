'use strict';
const tracklister = require('../js/tracklister.js');
const test = require('tape');

test('Tracklister', function(assert) {
	const numberedList = ['1. Banana', '2. Cookies', '3. Pudding'];
	const numberedListWithLeadingZeroes = ['01. Banana', '02. Cookies', '03. Pudding'];
	assert.plan(2);
	assert.ok(tracklister.tracklistLooksLikeAList(numberedList),
			  'It should recognize a numbered tracklist');

	assert.ok(tracklister.tracklistLooksLikeAList(numberedListWithLeadingZeroes),
	 			'It should recognize a numbered tracklist with leading zeroes');
});
