var exec   = require('child_process').exec,
	Flow   = require('../node_modules/flow/lib/flow'),
	fs     = require('../node_modules/fs-extra'),
	path   = require('path'),
	RSS    = require('rss'),
	util   = require('util'),
	wrench = require('wrench');

var Muffin = require('../lib/muffin')({
	called : process.cwd(),
	lib    : __dirname + '/../lib',
	markx  : __dirname + '/../node_modules/markx/bin/markx'
});

describe('Muffin.blog.post', function() {
	it('should be able to setup directories and files needed for a new post', function() {
		wrench.rmdirSyncRecursive(Muffin.path.called + '/testfiles/articles/hello-world', true); //So it won't whine on the test

		Muffin.blog.post({
			name       : 'hello-world',
			libPath    : Muffin.path.lib,
			outputPath : Muffin.path.called + '/testfiles'
		});
	});
});