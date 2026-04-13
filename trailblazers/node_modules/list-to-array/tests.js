var demand = require('must');
var listToArray = require('./index');

describe('listToArray', function() {
	it('splits a comma-delimited list into an array', function() {
		listToArray('one,two,three').must.eql(['one', 'two', 'three']);
	});
	it('splits a space-delimited list into an array', function() {
		listToArray('one two three').must.eql(['one', 'two', 'three']);
	});
	it('trims whitespace from values', function() {
		listToArray('one, two, three').must.eql(['one', 'two', 'three']);
	});
	it('splits a list into an array', function() {
		listToArray('one,two,three').must.eql(['one', 'two', 'three']);
	});
	it('returns a empty array w/ no arguments', function() {
		listToArray().must.eql([]);
	});
	it('returns a empty array for a blank string', function() {
		listToArray('').must.eql([]);
	});
	it('returns a empty array when only given whitespace', function() {
		listToArray(' ').must.eql([]);
	});
	it('returns a empty array when only given whitespace and commas', function() {
		listToArray(' , ').must.eql([]);
	});
});
