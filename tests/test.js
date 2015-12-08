require('../js/app.js');

var assert = require('assert');
var setup = require('mocha').setup;

describe('Tracklister', function() {
	describe('tracklistLooksLikeAList', function() {
		it('should recognize a numbered list', function() {
			var numberedList = ['01. Banana', '02. Cookies', '03. Pudding'];
			assert(tracklistLooksLikeAList(numberedList));
		});
	});
	describe('extractArtistAndTrack', function() {
	});

});
