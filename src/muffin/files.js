/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

Muffin.files = function(o) {
	var o = (o || {});

	var libPath    = (o.libPath || Muffin.path.lib);
	var outputPath = (o.outputPath || Muffin.path.called);

	return {
		authors : {
			default : libPath + '/authors/default.json',
			copy    : outputPath + '/authors/default.json'
		},
		content : {
			default : libPath + '/articles/content.md',
			copy    : outputPath + '/articles/content.md'
		},
		data : {
			default : libPath + '/articles/data.json',
			copy    : outputPath + '/articles/data.json'
		},
		muffin : {
			default : libPath + '/muffin.json',
			copy    : outputPath + '/muffin.json'
		},
		package : {
			default : libPath + '/package.json',
			copy    : outputPath + '/package.json'
		},
		templates : {
			default : libPath + '/templates/default.jade',
			copy    : outputPath + '/templates/default.jade'
		}
	};
};
