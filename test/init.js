var path = {
	called : process.cwd(),
	markx  : __dirname + '/../node_modules/markx/bin/markx'
};

var muffin = require('../lib/muffin')(path);
var path = require('path');

describe('muffin.init()', function() {
	it('should be able to setup directories needed for bake', function() {
		var testPath = {
			public    : muffin.path.called + '/testfiles/public',
			publicblog: muffin.path.called + '/testfiles/public/blog',
			site      : muffin.path.called + '/testfiles/site',
			siteblog  : muffin.path.called + '/testfiles/site/blog',
			templates : muffin.path.called + '/testfiles/templates'
		};

		muffin.init({
			path: testPath
		});
	});
});