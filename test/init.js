var path = {
	called : process.cwd(),
	markx  : __dirname + '/../node_modules/markx/bin/markx'
};

var muffin = require('../lib/muffin')(path);
var path = require('path');

describe('muffin.init()', function() {
	it('should be able to setup directories needed for bake', function() {
		var testPath = {
			articles  : muffin.path.called + '/testfiles/articles',
			authors   : muffin.path.called + '/testfiles/authors',
			blog      : muffin.path.called + '/testfiles/public/blog',
			public    : muffin.path.called + '/testfiles/public',
			templates : muffin.path.called + '/testfiles/templates'
		};

		muffin.init({
			path: testPath
		});
	});
});