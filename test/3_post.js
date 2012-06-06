var current = __dirname;
var muffin  = require('../lib/muffin')({
	called : process.cwd(),
	lib    : current + '/../lib',
	markx  : current + '/../node_modules/markx/bin/markx'
});
var path    = require('path');

describe('muffin.post()', function() {
	it('should be able to create files needed for post', function() {

		muffin.post({
			outputPath: muffin.path.called + '/testfiles'
		});
	});
});