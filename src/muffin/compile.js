/**
 * Builds out the site from markdown and jade files.
 * 
 * @param o          {Object} Options that are passed to bake()
 * @param o.input    {String} Path to file to be converted
 * @param o.output   {String} Path to .html file output
 * @param o.template {String} Path to jade template
 */
Muffin.compile = function() {
	var _this    = this,
		command = muffin.path.markx + ' ';

	var inputPath    = (o.inputPath    || false);
	var outputPath   = (o.outputPath   || false);
	var templatePath = (o.templatePath || false);

	if(templatePath) {
		command += '--template ' + templatePath + ' ';
	}

	if(inputPath) {
		command += inputPath + ' > ';
	} else {
		throw new Error();
	}

	if(outputPath) {
		command += outputPath;
	} else {
		throw new Error();
	}

	exec(command, function(error, stdout, stderr) {
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};