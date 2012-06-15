var exec   = require('child_process').exec,
	Flow   = require('flow'),
	fs     = require('fs-extra'),
	path   = require('path'),
	RSS    = require('rss'),
	util   = require('util'),
	wrench = require('wrench');

var Muffin = {};

module.exports = function(path) {
	Muffin.path = path;

	return Muffin;
};

/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

Muffin.files = function(o) {
	var o = (o || {});

	var libPath    = (o.libPath || Muffin.path.lib);
	var outputPath = (o.outputPath || Muffin.path.called);

	return {
		authors : {
			default : libPath + '/authors/default.json',
			copy    : outputPath + '/authors/default.json'
		},
		content : {
			default : libPath + '/articles/content.md',
			copy    : outputPath + '/articles/content.md'
		},
		data : {
			default : libPath + '/articles/data.json',
			copy    : outputPath + '/articles/data.json'
		},
		muffin : {
			default : libPath + '/muffin.json',
			copy    : outputPath + '/muffin.json'
		},
		package : {
			default : libPath + '/package.json',
			copy    : outputPath + '/package.json'
		},
		templates : {
			default : libPath + '/templates/default.jade',
			copy    : outputPath + '/templates/default.jade'
		}
	};
};

/**
 * Returns object with directories relevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to directories that will be wiped
 */
Muffin.dir = function(o) {
	o = (o || {});

	var calledPath = (o.path || Muffin.path.called);

	var dir = [
		calledPath + '/articles',
		calledPath + '/authors',
		calledPath + '/public',
		calledPath + '/templates'
	];

	dir.create = dir;
	dir.create.push(calledPath + '/public/blog');
	dir.destroy = dir;

	return dir;
};

/**
 * Destroys the site.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path that files will be wiped
 */
Muffin.burn = function(o) {
	var _this    = this,
		o = (o || {});

	//If a specific path was not called, then destroy (remove) the current path of the CLI
	var destroyPath = (o.path || Muffin.path.called);

	var dirPaths = Muffin.dir({
		path: destroyPath
	});

	//Remove directories
	dirPaths.destroy.forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	//Remove files
	var files = Muffin.files({
		path: destroyPath
	});

	var package = path.existsSync(files.package.copy);
	if(package) {
		fs.unlink(files.package.copy);
	}
};

/**
 * Sets up blo/site for first time use.
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
Muffin.init = function(o) {
	var _this = this,
		o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath    = (o.libPath || Muffin.path.lib);
	var outputPath = (o.outputPath || Muffin.path.called);

	Muffin.burn({
		path: outputPath
	});

	var dirPaths = Muffin.dir({
		path: outputPath
	});

	//Create directories needed
	dirPaths.create.forEach(function(path) {
		fs.mkdirSync(path);
	});

	var files = Muffin.files({
		libPath    : libPath,
		outputPath : outputPath
	});

	var copy = [
		{
			default : files.content.default,
			copy    : files.content.copy
		},
		{
			default : files.data.default,
			copy    : files.data.copy
		},
		{
			default : files.authors.default,
			copy    : files.authors.copy
		},
		{
			default : files.package.default,
			copy    : files.package.copy
		},
		{
			default : files.muffin.default,
			copy    : files.muffin.copy
		},
		{
			default : files.templates.default,
			copy    : files.templates.copy
		}
	];

	copy.forEach(function(val, key) {
		fs.copyFile(val.default, val.copy, function(err) {
			if(err) {
				console.log(err);
			}
		});
	});
};

var getFilesByExt = function(o, callback) {
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

			if(typeof callback == "function") callback(files);
		});
	} else {
		throw new Error();
	}
};