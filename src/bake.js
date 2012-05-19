muffin.bake = function(o) {
	var _this    = this,
		command = muffin.path.markx + ' ';

	if(o.template) {
		command = command + '--template ' + muffin.path.called + o.template + ' ';
	}

	if(o.from) {
		command = command + muffin.path.called + o.from + ' > ';
	} else {
		throw new Error();
	}

	if(o.to) {
		command = command + muffin.path.called + o.to;
	} else {
		throw new Error();
	}

	console.log("command: ", command);

	exec(command,
	function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};
