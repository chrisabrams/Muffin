/**
 * Prepares the blog for baking.
 * 
 * @param o          {Object} Options that are passed to init()
 * @param o.path     {String} Path for output
 */
muffin.init = function(o) {

	//If a specific path was not called, then initialize in the current path of the CLI
	var outputPath = (o.path || muffin.path.called);

	var dirPaths = {
			articles  : outputPath + '/articles',
			authors   : outputPath + '/authors',
			blog      : outputPath + '/public/blog',
			public    : outputPath + '/public',
			templates : outputPath + '/templates'
		};

	[dirPaths.articles, dirPaths.authors, dirPaths.blog, dirPaths.public, dirPaths.templates].forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	[dirPaths.articles, dirPaths.authors, dirPaths.public, dirPaths.blog, dirPaths.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});

	fs.copyFile(muffin.path.lib + '/default.json', outputPath + '/authors/default.json', function(err) {
		if(!err) {
			fs.copyFile(muffin.path.lib + '/package.json', outputPath + '/package.json', function(err) {
				if(err) {
					throw err;
				}
			});
		} else {
			throw err;
		}
	});
};
