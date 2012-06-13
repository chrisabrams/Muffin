var exec   = require('child_process').exec,
	Flow   = require('flow'),
	fs     = require('fs-extra'),
	path   = require('path'),
	RSS    = require('rss'),
	util   = require('util'),
	wrench = require('wrench');

var Muffin = {};
