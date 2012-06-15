var current = __dirname;
var muffin  = require('../lib/muffin')({
	called : process.cwd(),
	lib    : current + '/../lib',
	markx  : current + '/../node_modules/markx/bin/markx'
});
var path    = require('path');

describe('muffin.burn()', function() {
	it('should be able to remove all directories and files created from prepare', function() {

		muffin.burn({
			path: muffin.path.called + '/testfiles'
		});
	});
});