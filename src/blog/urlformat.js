Muffin.blog.UrlFormat = function() {
	var calledDir = Muffin.path.called;
	var config    = require(calledDir + '/muffin.json');
	var format    = (config.format || false);

	var templist  = format.split('/');
	templist.forEach(function(val, key) {
		//This is the last case; insert blog post here
		if(val == 'T') {

		}

		//Create directory nest(s)
		else {
			switch(val) {
				case 'Y':
					break;
			}
		}
	});
};
