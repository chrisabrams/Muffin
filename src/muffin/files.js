/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

Muffin.files = function(o) {
	var o = (o || {});

	var libPath    = (o.libPath || muffin.path.lib);
	var outputPath = (o.outputPath || muffin.path.called);

	return {
		authors : {
			default : libPath + '/default.json',
			copy    : outputPath + '/authors/default.json'
		},
		content : {
			default : libPath + '/default.md',
			copy    : outputPath + '/articles/default.md'
		},
		muffin : {
			default : libPath + '/muffin.json',
			copy    : outputPath + '/muffin.json'
		}
		package : {
			default : libPath + '/package.json',
			copy    : outputPath + '/package.json'
		}
	};
};
