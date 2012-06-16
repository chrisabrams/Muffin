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
	dir.create.push(calledPath + '/articles/hello-world');
	dir.create.push(calledPath + '/public/blog');
	dir.destroy = dir;

	return dir;
};
