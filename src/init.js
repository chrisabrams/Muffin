muffin.init = function(o) {

	var dir;

	var path = (o.path || {
			public    : muffin.path.called + '/public',
			publicblog: muffin.path.called + '/public/blog',
			site      : muffin.path.called + '/site',
			siteblog  : muffin.path.called + '/site/blog',
			templates : muffin.path.called + '/templates'
		});

	[path.public, path.site, path.templates].forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	[path.public, path.publicblog, path.site, path.siteblog, path.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});
};
