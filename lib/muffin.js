var exec   = require('child_process').exec,
	fs     = require('fs-extra'),
	path   = require('path'),
	util   = require('util'),
	wrench = require('wrench');

var muffin = {
	dir  : {},
	file : {}
};

/**
 * Returns object with directories relevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to directories that will be wiped
 */
muffin.directories = function(o) {
	var o = (o || {});

	var calledPath = (o.path || muffin.path.called);

	return {
		articles  : calledPath + '/articles',
		authors   : calledPath + '/authors',
		blog      : calledPath + '/public/blog',
		public    : calledPath + '/public',
		templates : calledPath + '/templates'
	};
};

/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

muffin.files = function(o) {
	var o = (o || {});

	var libPath    = (o.libPath || muffin.path.lib);
	var outputPath = (o.outputPath || muffin.path.called);

	return {
		authors : {
			default : libPath + '/default.json',
			copy    : outputPath + '/authors/default.json'
		},
		content : {
			default : libPath + '/default.md',
			copy    : outputPath + '/articles/default.md'
		},
		package : {
			default : libPath + '/package.json',
			copy    : outputPath + '/package.json'
		}
	};
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

	var inputPath    = (o.inputPath    || false);
	var outputPath   = (o.outputPath   || false);
	var templatePath = (o.templatePath || false);

	if(templatePath) {
		command += '--template ' + templatePath + ' ';
	}

	if(inputPath) {
		command += inputPath + ' > ';
	} else {
		throw new Error();
	}

	if(outputPath) {
		command += outputPath;
	} else {
		throw new Error();
	}

	exec(command, function(error, stdout, stderr) {
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};

/**
 * Destroys the site.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path that files will be wiped
 */
muffin.burn = function(o) {
	var _this    = this,
		o = (o || {});

	//If a specific path was not called, then destroy (remove) the current path of the CLI
	var destroyPath = (o.path || muffin.path.called);

	var dirPaths = new muffin.directories({
		path: destroyPath
	});

	//Remove directories
	[dirPaths.articles, dirPaths.authors, dirPaths.blog, dirPaths.public, dirPaths.templates].forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	//Remove files
	var files = new muffin.files({
		path: destroyPath
	});

	var package = path.existsSync(files.package.copy);
	if(package) {
		fs.unlink(files.package.copy);
	}
};

/**
 * Create a new post
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
muffin.post = function(o) {
	var _this = this,
		o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var outputPath = (o.outputPath || muffin.path.called);

	var files = new muffin.files({
		outputPath: outputPath
	});

	fs.copyFile(files.content.default, files.content.copy, function(err) {
		if(err) {
			throw err;
		}
	});
};

/**
 * Prepares the blog for baking.
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
muffin.prepare = function(o) {
	var _this = this,
		o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath    = (o.libPath || muffin.path.lib);
	var outputPath = (o.outputPath || muffin.path.called);

	muffin.burn({
		path: outputPath
	});

	var dirPaths = new muffin.directories({
		path: outputPath
	});

	//Create directories needed
	[dirPaths.articles, dirPaths.authors, dirPaths.public, dirPaths.blog, dirPaths.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});

	var files = new muffin.files({
		libPath    : libPath,
		outputPath : outputPath
	});

	fs.copyFile(files.authors.default, files.authors.copy, function(err) {
		if(!err) {
			fs.copyFile(files.package.default, files.package.copy, function(err) {
				if(err) {
					throw err;
				}
			});
		} else {
			throw err;
		}
	});
};

module.exports = function(path) {
	muffin.path = path;

	return muffin;
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