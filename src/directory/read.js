muffin.dir.read = function(o) {
	if(o.path) {
		fs.readdir(o.path, function(err, files) {

			if(o.ext) {
				files = files.filter(function(file) {
							var extLength = o.ext.length;
							parseInt(extLength);
							extLength = extLength * -1;
							return file.substr(extLength) == o.ext;
						});
			}

			files.forEach(function(file) {
				//Got the file I wanted
			});
		});
	} else {
		throw new Error();
	}
};
