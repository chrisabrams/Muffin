var path = {
	called : process.cwd(),
	markx  : __dirname + '/../node_modules/markx/bin/markx'
};

var muffin = require('../lib/muffin')(path);

describe('muffin.bake()', function() {
	it('should convert a markdown file into a .html file', function() {
		muffin.bake({
			input  : '/testfiles/demo.md',
			output : '/testfiles/demo.html'
		});
	});

	it('should convert a markdown file and a jade template into a .html file', function() {
		muffin.bake({
			input    : '/testfiles/demo.md',
			output   : '/testfiles/demo.html',
			template : '/testfiles/master.jade'
		});
	});
});