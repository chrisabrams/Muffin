var exec     = require('child_process').exec,
	Flow     = require(__dirname + '/../node_modules/flow/lib/flow')({
		called : process.cwd(),
		lib    : __dirname + '/../lib',
		markx  : __dirname + '/../node_modules/markx/bin/markx'
	}), //It doesn't find it normally - stranga
	fs       = require('fs-extra'),
	jade     = require('jade'),
	jsdom    = require('jsdom'),
	markdown = require('markdown').markdown,
	path     = require('path'),
	RSS      = require('rss'),
	util     = require('util'),
	wrench   = require('wrench');

var Muffin = {};
