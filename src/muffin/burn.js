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

	var package = fs.existsSync(files.package.copy);
	if(package) {
		fs.unlink(files.package.copy);
	}
};
