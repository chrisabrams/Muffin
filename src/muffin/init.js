/**
 * Sets up blog/site for first time use.
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
Muffin.init = function(o) {
	var _this = this;
	o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath    = (o.libPath || Muffin.path.lib);
	var outputPath = (o.outputPath || Muffin.path.called);

	Muffin.burn({
		path: outputPath
	});

	var dirPaths = Muffin.dir({
		path: outputPath
	});

	//Create directories needed
	dirPaths.create.forEach(function(path) {
		fs.mkdirSync(path);
	});

	var files = Muffin.files({
		libPath    : libPath,
		outputPath : outputPath
	});

	var copy = [
		{
			default : files.content.default,
			copy    : files.content.copy
		},
		{
			default : files.data.default,
			copy    : files.data.copy
		},
		{
			default : files.authors.default,
			copy    : files.authors.copy
		},
		{
			default : files.package.default,
			copy    : files.package.copy
		},
		{
			default : files.muffin.default,
			copy    : files.muffin.copy
		},
		{
			default : files.templates.default,
			copy    : files.templates.copy
		}
	];

	copy.forEach(function(val, key) {
		fs.copyFile(val.default, val.copy, function(err) {
			if(err) {
				console.log(err);
			}
		});
	});
};
