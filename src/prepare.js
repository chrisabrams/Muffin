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
	var outputPath = (o.path || muffin.path.called);

	muffin.burn({
		path: outputPath
	});

	var dirPaths = new muffin.directories({
		path: outputPath
	});

	[dirPaths.articles, dirPaths.authors, dirPaths.public, dirPaths.blog, dirPaths.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});

	var files = new muffin.files({
		path: outputPath
	});

	fs.copyFile(muffin.path.lib + '/default.json', files.authors, function(err) {
		if(!err) {
			fs.copyFile(muffin.path.lib + '/package.json', files.package, function(err) {
				if(err) {
					throw err;
				}
			});
		} else {
			throw err;
		}
	});
};
