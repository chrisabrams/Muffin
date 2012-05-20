/**
 * Builds out the site from markdown and jade files.
 * 
 * @param o          {Object} Options that are passed to bake()
 * @param o.input    {String} Path to file to be converted
 * @param o.output   {String} Path to .html file output
 * @param o.template {String} Path to jade template
 */
muffin.bake = function(o) {
	var _this    = this,
		command = muffin.path.markx + ' ';

	if(o.template) {
		command = command + '--template ' + muffin.path.called + o.template + ' ';
	}

	if(o.input) {
		command = command + muffin.path.called + o.input + ' > ';
	} else {
		throw new Error();
	}

	if(o.output) {
		command = command + muffin.path.called + o.output;
	} else {
		throw new Error();
	}

	//console.log("command: ", command);

	exec(command, function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};
