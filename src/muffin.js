var exec   = require('child_process').exec,
	fs     = require('fs'),
	path   = require('path'),
	util   = require('util'),
	wrench = require('wrench');

var muffin = {
	dir  : {},
	file : {}
};
