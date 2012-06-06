var current = __dirname;
var muffin  = require('../lib/muffin')({
	called : process.cwd(),
	lib    : current + '/../lib',
	markx  : current + '/../node_modules/markx/bin/markx'
});
var path    = require('path');

describe('muffin.bake()', function() {
	it('should convert a markdown file into a .html file', function() {
		muffin.bake({
			inputPath  : muffin.path.called + '/testfiles/demo.md',
			outputPath : muffin.path.called + '/testfiles/demo.html'
		});
	});

	it('should convert a markdown file and a jade template into a .html file', function() {
		muffin.bake({
			inputPath    : muffin.path.called + '/testfiles/demo.md',
			outputPath   : muffin.path.called + '/testfiles/demo.html',
			templatePath : muffin.path.called + '/testfiles/master.jade'
		});
	});
});