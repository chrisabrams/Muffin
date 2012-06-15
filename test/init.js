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

describe('Muffin.init', function() {
	it('should be able to setup directories and files needed for first use', function() {

		Muffin.init({
			libPath    : Muffin.path.lib,
			outputPath : Muffin.path.called + '/testfiles'
		});
	});
});