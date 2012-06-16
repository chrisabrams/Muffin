/**
 * Create a new post
 * 
 * @param o          {Object} Options that are passed to prepare()
 * @param o.path     {String} Path for output
 */
Muffin.blog.post = function(o) {
	var _this = this;
		o = (o || {});

	var name = (o.name || false);

	if(name) {

		//If a specific path was not called, then initialize in the current path of the CLI
		var libPath    = (o.libPath || Muffin.path.lib);
		var outputPath = (o.outputPath || Muffin.path.called);

		var articlePath = outputPath + '/articles/' + name;

		var dirPaths = Muffin.dir({
			path: outputPath
		});

		var files = Muffin.files({
			libPath    : libPath,
			outputPath : outputPath
		});

		var copy = [
			{
				default : files.content.default,
				copy    : articlePath + '/content.md'
			},
			{
				default : files.data.default,
				copy    : articlePath + '/data.json'
			}
		];

		fs.mkdirSync(articlePath);

		copy.forEach(function(val, key) {
			fs.copyFile(val.default, val.copy, function(err) {
				if(err) {
					console.log(err);
				}
			});
		});
	}
};
