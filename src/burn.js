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
