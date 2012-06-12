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
				if(!err) {
					fs.copyFile(files.muffin.default, files.muffin.copy, function(err) {
						if(err) {
							throw err;
						}
					});
				}
			});
		} else {
			throw err;
		}
	});
};
