/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

muffin.files = function(o) {
	var o = (o || {});

	var calledPath = (o.path || muffin.path.called);

	return {
		authors: calledPath + '/authors/default.json',
		package: calledPath + '/package.json'
	};
};
