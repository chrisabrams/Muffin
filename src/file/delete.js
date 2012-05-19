muffin.file.delete = function(filePath) {
	path.exists(filePath, function(exists) {  
        if(exists) {  
            fs.unlink(filePath, function(err) {
				if (err) throw err;
				console.log('deleted: ', filePath);
			});

            return;
        }
    });
};
