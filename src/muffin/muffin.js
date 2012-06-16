var exec     = require('child_process').exec,
	Flow     = require('flow'),
	fs       = require('fs-extra'),
	jsdom    = require('jsdom'),
	markdown = require('markdown').markdown,
	path     = require('path'),
	RSS      = require('rss'),
	util     = require('util'),
	wrench   = require('wrench');

var Muffin = {};
