var fs = require('fs');

var path = {
	called : process.cwd(),
	markx  : __dirname + '/../node_modules/markx/bin/markx'
};

var muffin = require('../lib/muffin')(path);

describe('muffin.dir.read()', function() {
	it('should be able to read a directory', function() {
		muffin.dir.read({
			path: './testfiles'
		})
	});

	it('should be able to read specific files in a directory', function() {
	    muffin.dir.read({
			ext  : '.md',
			path : './testfiles'
		})
	});
});