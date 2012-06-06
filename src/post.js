/**
 * Create a new post
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
muffin.post = function(o) {
	var _this = this,
		o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var outputPath = (o.outputPath || muffin.path.called);

	var files = new muffin.files({
		outputPath: outputPath
	});

	fs.copyFile(files.content.default, files.content.copy, function(err) {
		if(err) {
			throw err;
		}
	});
};
