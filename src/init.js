muffin.init = function(o) {

	var dir;

	var path = (o.path || {
			articles  : muffin.path.called + '/articles',
			authors   : muffin.path.called + '/authors',
			blog      : muffin.path.called + '/public/blog',
			public    : muffin.path.called + '/public',
			templates : muffin.path.called + '/templates'
		});

	[path.articles, path.authors, path.blog, path.public, path.templates].forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	[path.articles, path.authors, path.public, path.blog, path.templates].forEach(function(path) {
		fs.mkdirSync(path);
	});
};
