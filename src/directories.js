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
