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
		articleHTML,
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
		template,
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

	//Template name
	template = muffinConfig.template;

	//Remove stuff as it will be wrotten agains
	wrench.rmdirSyncRecursive(Muffin.path.called + '/public/blog', true);

	//Get all articles to be built - not sure what the first parameter is
	readDir(articlePath, function(dunno, found) {

		var dirs = found.dirs,
			dirsList = [],
			results;

		//Loop through directories and construct object for each directory; push to array for building
		dirs.forEach(function(dir, key) {
			if(typeof dir == "string") {
				obj = {}; //Needs to be reset or will append the new object n + 1 times
				content = fs.readFileSync(dir + '/content.md', 'utf8');
				
				//If there is an h2, get everything before it (it will stop at anything h2 or greater)
				try {
					contentPieces = content.split('##');
					obj.contentPreview = contentPieces[0];
				}
				
				//If there isn't an h2, then get all of the content
				/*
				TODO: Set limit on number of characters to get here
				*/
				catch(e) {
					obj.contentPreview = content;
				}

				//Get data associated with respective article
				data = require(dir + '/data.json');
				datePieces = data.date.split(' ');

				//Get year, month, day
				ymd = datePieces[0].split('-');
				year = ymd[0];
				month = ymd[1];
				day = ymd[2];

				//Get hour, minute, second (for sorting multiple posts on same day/month/year)
				hms = datePieces[1].split(':');

				//(Y, M, D, H, M, S)
				obj.sortDate = new Date(year, month, day, hms[0], hms[1], hms[2]);

				//Get the last part of the path, the article name
				obj.title = dir.split(/[/ ]+/).pop();

				/*
				Respective article directory creation (by date)
				This can be done here or after this for loop - it doesn't matter too much but
				we have to know the Y/M/D pieces in order to generate the date in the url for
				each article. I'm sure this isn't being done super effeciently.
				*/

				urlFormat = muffinConfig.urlformat.split('/');

				var urlPath = Muffin.path.called + '/public/blog';
				var urlSegment = '';

				//Parse URL Format
				urlFormat.forEach(function(segment, key) {
					/*
					BUG: for some reason the first key is blank so we skip it
					*/

					if(key != 0) {

						if(segment === "Y") {
							urlSegment += '/' + year;
						}

						if(segment === "m") {
							urlSegment += '/' + month;
						}

						if(segment === "d") {
							urlSegment += '/' + day;
						}

						if(segment === "T") {
							urlSegment += '/' + obj.title;
						}
					}
				});

				obj.urlSegment = urlSegment;

				//Will need the data filtered/sorted for main page
				dirsList.push(obj);

				//Write directory for respective article
				wrench.mkdirSyncRecursive(urlPath + urlSegment, 0775);

				//Write respective article to it's directory with template wrapped around
				Flow.compile.html({
					md: dir + '/content.md',
					jade: Muffin.path.called + '/templates/' + template + '/template.jade',
					output: urlPath + '/index.html'
				});
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

		//Do all of the DOM parsing for main page
		var convert = require(Muffin.path.lib + '/../node_modules/markx/lib/convert');
		convert(Muffin.path.called + '/templates/' + template + '/template.jade', {}, function(templateFinal) {
			
			//Main page
			jsdom.env({
				html: contentOutput, //content for main page
				scripts: [
					Muffin.path.lib + '/jQuery-1.7.2.min.js'
				]
			}, function (err, window) {
				var $ = window.jQuery;
				//var linkSegment = '/blog' + urlSegment;

				//Make h1's link to respective blog post
				//$('h1').wrap('<a href="'+linkSegment+'" />');
				$('h1').each(function(i, obj) {
					$(obj).wrap('<a href="/blog' + dirsList[i].urlSegment + '" />');
				});

				var output = $('body').html();

				jsdom.env({
					html: templateFinal, //content for main page
					scripts: [
						Muffin.path.lib + '/jQuery-1.7.2.min.js'
					]
				}, function (err, window) {
					var $ = window.jQuery;

					$('#content').html(output);
					$('.jsdom').remove(); //don't need this in template rendation
					//console.log($('body').html());
					var outputFinal = "<!DOCTYPE html>\n" + $('html').html();
					
					// public/index.html file
					fs.writeFileSync(Muffin.path.called + '/public/index.html', outputFinal, 'utf8');
				});
			});
		});
	});

	//Copy CSS from template over to public
	fs.copy(Muffin.path.called + '/templates/' + template + '/css', Muffin.path.called + '/public/css', function(err){
		if(err) {
			console.error(err);
		}
	});

	//Figure out where metadata goes in this process (plates?)
};
