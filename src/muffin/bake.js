/**
 * Builds out the site from markdown and jade files.
 * 
 * @param o          {Object} Options that are passed to bake()
 * @param o.input    {String} Path to file to be converted
 * @param o.output   {String} Path to .html file output
 * @param o.template {String} Path to jade template
 */
Muffin.bake = function(o) {
	var _this    = this,
		command = Muffin.path.markx + ' ',
		content,
		contentOutput,
		contentPieces,
		contentPreview,
		data,
		date,
		datePieces,
		mainContent = '',
		sortDate,
		split,
		title,
		obj = {},
		url = '',
		urlFormat,
		muffinConfig = require(Muffin.path.called + '/muffin.json'),
		ymd, hms, year, month, day, hour, minute, second;
	o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath     = (o.libPath || Muffin.path.lib);
	var outputPath  = (o.outputPath || Muffin.path.called);
	var articlePath = outputPath + '/articles';

	//Remove stuff as it will be wrotten agains
	wrench.rmdirSyncRecursive(Muffin.path.called + '/public/blog', true);

	//Put fresh /blog back
	//console.log(Muffin.path.called + '/public/blog');
	//fs.mkdirSync(Muffin.path.called + '/public/blog', 0775);

	//Get all articles to be built
	readDir(articlePath, function(dunno, found) {
		//console.log(arguments); return;
		var dirs = found.dirs,
			dirsList = [],
			results;

		//Loop through directories and construct object for each directory; push to array for building
		dirs.forEach(function(dir, key) {
			//console.log("dir ", dir);
			if(typeof dir == "string") {
				obj = {}; //Needs to be reset or will append the new object n + 1 times
				content = fs.readFileSync(dir + '/content.md', 'utf8');
				
				//If there is an h2, get everything before it (it will stop at anything h2 or greater)
				try {
					contentPieces = content.split('##');
					obj.contentPreview = contentPieces[0];
				}
				
				//If there isn't an h2, then get all of the content
				catch(e) {
					obj.contentPreview = content;
				}

				data = require(dir + '/data.json');
				datePieces = data.date.split(' ');

				ymd = datePieces[0].split('-');
				year = ymd[0];
				month = ymd[1];
				day = ymd[2];

				hms = datePieces[1].split(':');

				//(Y, M, D, H, M, S)
				obj.sortDate = new Date(year, month, day, hms[0], hms[1], hms[2]);

				//Get the last part of the path, the article name
				obj.title = dir.split(/[/ ]+/).pop();

				/*
				Respective directory date creation
				This can be done here or after this for loop - it doesn't matter too much but
				we have to know the Y M D pieces in order to generate the date in the url for
				each article. I'm sure this isn't being done super effeciently.
				*/

				urlFormat = muffinConfig.urlformat.split('/');

				var urlPath = Muffin.path.called + '/public/blog';

				//Parse URL Format
				urlFormat.forEach(function(segment, key) {
					/*
					BUG: for some reason the first key is blank so we skip it
					*/
//console.log(urlPath);
					if(key != 0) {

						if(segment == "Y") {
							urlPath = urlPath + '/' + year;
						}

						if(segment == "M") {
							urlPath = urlPath + '/' + month;
						}

						if(segment == "D") {
							urlPath = urlPath + '/' + day;
						}

						if(segment == "T") {
							urlPath += '/' + obj.title;
							
						}

						/*//Title - this one is last which is why we check for it, we don't care about the rest
						if(segment === "T") {
							//Create the last directory, the title of the blog post
							
							//fs.mkdirSync(urlPath);
							
							return;
							//console.log(urlPath);
						}
						
						else {
							switch(segment) {
								case "Y":
									

								case "M":
									

								case "D":
									

								default:
									return;//this does nothing apparently
							}
						}*/
					}
				});
				console.log(urlPath);
				wrench.mkdirSyncRecursive(urlPath, 0775);

				dirsList.push(obj);
			}
		});

		//Sort results in descending order
		results = dirsList.sortBy(function(o) {return -o.sortDate});

		//Main content page
		results.forEach(function(result) {
			if(result != "undefined" && result.contentPreview != "undefined") {
				mainContent += result.contentPreview;
			}
		});

		//Convert the markdown to HTML for DOM manipulation
		contentOutput = markdown.toHTML(mainContent);

		//Do all of the DOM parsing
		jsdom.env({
			html: contentOutput,
			scripts: [
				Muffin.path.lib + '/jquery-1.7.2.min.js'
			]
		}, function (err, window) {
			var $ = window.jQuery;

			//Make h1's link to respective blog post
			$('h1').wrap('<a href="#" />');

			var output = $('body').html();

			fs.writeFileSync(Muffin.path.called + '/public/index.html', output, 'utf8');
			console.log("main page created");
		});

		//console.log(results);return;
	});

	//Write the files

	//Figure out where metadata goes in this process (plates)
};
