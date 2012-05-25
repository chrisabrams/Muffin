var exec   = require('child_process').exec,
	fs     = require('fs'),
	path   = require('path'),
	util   = require('util'),
	wrench = require('wrench');

var muffin = {
	dir  : {},
	file : {}
};

muffin.dir.read = function(o) {
	if(o.path) {
		fs.readdir(o.path, function(err, files) {

			if(o.ext) {
				files = files.filter(function(file) {
							var extLength = o.ext.length;
							parseInt(extLength);
							extLength = extLength * -1;
							return file.substr(extLength) == o.ext;
						});
			}

			files.forEach(function(file) {
				//Got the file I wanted
			});
		});
	} else {
		throw new Error();
	}
};

/**
 * Builds out the site from markdown and jade files.
 * 
 * @param o          {Object} Options that are passed to bake()
 * @param o.input    {String} Path to file to be converted
 * @param o.output   {String} Path to .html file output
 * @param o.template {String} Path to jade template
 */
muffin.bake = function(o) {
	var _this    = this,
		command = muffin.path.markx + ' ';

	if(o.template) {
		command = command + '--template ' + muffin.path.called + o.template + ' ';
	}

	if(o.input) {
		command = command + muffin.path.called + o.input + ' > ';
	} else {
		throw new Error();
	}

	if(o.output) {
		command = command + muffin.path.called + o.output;
	} else {
		throw new Error();
	}

	//console.log("command: ", command);

	exec(command, function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};

muffin.init = function(o) {

	var dir;

	var path = (o.path || {
			articles  : muffin.path.called + '/articles',
			blog      : muffin.path.called + '/public/blog',
			public    : muffin.path.called + '/public',
			templates : muffin.path.called + '/templates'
		});

	[path.articles, path.blog, path.public, path.templates].forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	[path.articles, path.public, path.blog, path.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});
};

module.exports = function(path) {
	muffin.path = path;

	return muffin;
};

