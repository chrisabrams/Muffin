var exec     = require('child_process').exec,
	Flow     = require(__dirname + '/../node_modules/flow/lib/flow')({
		called : process.cwd(),
		lib    : __dirname + '/../lib',
		markx  : __dirname + '/../node_modules/markx/bin/markx'
	}), //It doesn't find it normally
	fs       = require('fs-extra'),
	less     = require('less'),
	jade     = require('jade'),
	$        = require('jQuery'),
	jsdom    = require('jsdom'),
	markdown = require('markdown').markdown,
	path     = require('path'),
	RSS      = require('rss'),
	stylus   = require('stylus'),
	util     = require('util'),
	wrench   = require('wrench');

var Muffin = {};

module.exports = function(path) {
	Muffin.path = path;

	return Muffin;
};

/**
 * Returns object with filesrelevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to files that will be wiped
 */

Muffin.files = function(o) {
	var o = (o || {});

	var libPath    = (o.libPath || Muffin.path.lib);
	var outputPath = (o.outputPath || Muffin.path.called);

	return {
		authors : {
			default : libPath + '/authors/default.json',
			copy    : outputPath + '/authors/default.json'
		},
		content : {
			default : libPath + '/articles/content.md',
			copy    : outputPath + '/articles/hello-world/content.md'
		},
		data : {
			default : libPath + '/articles/data.json',
			copy    : outputPath + '/articles/hello-world/data.json'
		},
		index : {
			default : libPath + '/index.html',
			copy    : outputPath + '/index.html'
		},
		muffin : {
			default : libPath + '/muffin.json',
			copy    : outputPath + '/muffin.json'
		},
		package : {
			default : libPath + '/package.json',
			copy    : outputPath + '/package.json'
		},
		templates : {
			default : libPath + '/templates/default.jade',
			copy    : outputPath + '/templates/default.jade'
		}
	};
};

/**
 * Returns object with directories relevant to `muffin.prepare` and `muffin.burn`.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path to directories that will be wiped
 */
Muffin.dir = function(o) {
	o = (o || {});

	var calledPath = (o.path || Muffin.path.called);

	var dir = [
		calledPath + '/articles',
		calledPath + '/authors',
		calledPath + '/public',
		calledPath + '/templates'
	];

	dir.create = dir;
	dir.create.push(calledPath + '/articles/hello-world');
	dir.create.push(calledPath + '/public/blog');
	dir.destroy = dir;

	return dir;
};

/**
 * Destroys the site.
 * 
 * @param o          {Object} Options that are passed to destroy()
 * @param o.path     {String} Path that files will be wiped
 */
Muffin.burn = function(o) {
	var _this    = this,
		o = (o || {});

	//If a specific path was not called, then destroy (remove) the current path of the CLI
	var destroyPath = (o.path || Muffin.path.called);

	var dirPaths = Muffin.dir({
		path: destroyPath
	});

	//Remove directories
	dirPaths.destroy.forEach(function(path) {
		wrench.rmdirSyncRecursive(path, true);
	});

	//Remove files
	var files = Muffin.files({
		path: destroyPath
	});

	var package = path.existsSync(files.package.copy);
	if(package) {
		fs.unlink(files.package.copy);
	}
};

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
		articleContent = '',
		config = require(Muffin.path.called + '/muffin.json'),
		content,
		contentOutput,
		contentPieces,
		contentPreview,
		data,
		date,
		datePieces,
		paths = {
			public: Muffin.path.called + '/public',
			template: Muffin.path.called + '/templates'
		},
		sortDate,
		split,
		template,
		obj = {},
		url = '',
		urlFormat,
		ymd, hms, year, month, day, hour, minute, second;
	o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath     = (o.libPath || Muffin.path.lib);
	var outputPath  = (o.outputPath || Muffin.path.called);
	var articlePath = outputPath + '/articles';

	//Create RSS Feed (will use it at the end but need object for looping through articles)
	var feed = new RSS({
        title: config.meta.title,
        description: config.meta.desc,
        feed_url: config.domain + '/rss.xml',
        site_url: config.domain,
        image_url: config.avatar,
        author: config.author
    });

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

				/*
				Respective article directory creation (by date)
				This can be done here or after this for loop - it doesn't matter too much but
				we have to know the Y/M/D pieces in order to generate the date in the url for
				each article. I'm sure this isn't being done super effeciently.
				*/

				urlFormat = config.urlformat.split('/');

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

				content = fs.readFileSync(dir + '/content.md', 'utf8');
				
				//If there is an h2, get everything before it (it will stop at anything h2 or greater)
				try {
					contentPieces = content.split('##');
					//obj.contentPreview = contentPieces[0];
					obj.article = markdown.toHTML(contentPieces[0]);
				}
				
				//If there isn't an h2, then get all of the content
				/*
				TODO: Set limit on number of characters to get here
				*/
				catch(e) {
					obj.article = markdown.toHTML(content);
				}

				//Make some adjustments to article
				var window = require('jsdom').jsdom(obj.article).createWindow(),
					script = window.document.createElement('script');

				script.className = 'jsdom';
				script.src = Muffin.path.lib + '/jQuery-1.7.2.min.js';
				script.onload = function() {
					var $ = window.jQuery;

					$('.jsdom').remove(); //Don't want this on rendered output - just using it here
					$('body').wrapInner('<article />'); //Wrap each article with <article> tag
					$('h1').wrap('<a href="'+urlSegment+'" />'); //Make h1's link to respective blog post

					obj.article = $('body').html(); //Only need the inner content for the article
				};

				// Append the element to the head element of the document
				window.document.body.appendChild(script);

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

				//Add data to RSS feed
				feed.item({
				    title: config.meta.title,
				    description: config.meta.desc, //need to change to like first <p> or something
				    url: config.domain + '/blog' + urlSegment, // link to the item
				    date: obj.sortDate // any format that js Date can parse.
				});

				//Will need the data filtered/sorted for main page
				dirsList.push(obj);

				//Write directory for respective article
				wrench.mkdirSyncRecursive(urlPath + urlSegment, 0775);

				//Write respective article to it's directory with template wrapped around
				Flow.compile.html({
					md: dir + '/content.md',
					jade: paths.template + '/' + config.template + '/template.jade',
					output: urlPath + '/index.html'
				});
			}
		});

		//Sort results in descending order
		results = dirsList.sortBy(function(o) {return -o.sortDate});

		//Main content page
		results.forEach(function(result) {
			if(result != "undefined" && result.contentPreview != "undefined") {
				articleContent += result.content;
			}
		});

		//Do all of the DOM parsing for main page
		var convert = require(Muffin.path.lib + '/../node_modules/markx/lib/convert');
		convert(paths.template + '/' + config.template + '/template.jade', {}, function(template) {
			
			//Generate main page HTML
			var window = require('jsdom').jsdom(template).createWindow(),
				script = window.document.createElement('script');

			script.className = 'jsdom';
			script.src = Muffin.path.lib + '/jQuery-1.7.2.min.js';
			script.onload = function() {
				var $ = window.jQuery;

				$('.jsdom').remove(); //Don't want this on rendered output - just using it here
				$('#content').html(articleContent);

				var output = window.document.doctype + $('html').html();

				fs.writeFileSync(paths.public + '/index.html', output, 'utf8');
			};

			// Append the element to the head element of the document
			window.document.body.appendChild(script);
		});

		//Generate and write RSS file
		fs.writeFileSync(paths.public + '/rss.xml', feed.xml(), 'utf8');
	});

	//Copy CSS from template over to public/css
	switch(config.engines.styles) {
		case 'css':
			fs.copy(paths.template + '/' + config.template + '/css', paths.public + '/css', function(err){
				if(err) {
					console.error(err);
				}
			});

			break;

		case 'less':
			var lessies = wrench.readdirSyncRecursive(paths.template + '/' + config.template + '/less');

			//Loop through each .less and convert & output to .css
			lessies.forEach(function(less, key) {
				var name = less.split('.'); //get the filename without extension
				var lessPath = paths.template + '/' + config.template + '/less/' + less;
				var lesscPath = Muffin.path.lib + '/../node_modules/less/bin/lessc';
				var cssPath = paths.public + '/css/' + name[0] + '.css';

				//Run less compiler
				exec(lesscPath + ' ' + lessPath + ' > ' + cssPath, function(error, stdout, stderr) {
					if(error != null) {
						console.log(stdout);
						console.log(stderr);
					}
				});
			});

			break;

		case 'stylus':
			var styls = wrench.readdirSyncRecursive(paths.template + '/' + config.template + '/stylus');
			
			//Loop through each .styl and convert & output to .css
			styls.forEach(function(styl, key) {
				var name = styl.split('.'); //get the filename without extension

				stylus(fs.readFileSync(paths.template + '/' + config.template + '/stylus/' + styl, 'utf8')) //Get contents of stylus file
					.render(function(err, css) {
						fs.writeFileSync(paths.public + '/css/' + name[0] + '.css', css, 'utf8');
					});
			});
			break;
	}

	//Figure out where metadata goes in this process (plates?)
};

Muffin.blog = {};

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

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();

var getFilesByExt = function(o, callback) {
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

			if(typeof callback == "function") callback(files);
		});
	} else {
		throw new Error();
	}
};

function readDir(start, callback) {
    // Use lstat to resolve symlink if we are passed a symlink
    fs.lstat(start, function(err, stat) {
        if(err) {
            return callback(err);
        }
        var found = {dirs: [], files: []},
            total = 0,
            processed = 0;
        function isDir(abspath) {
            fs.stat(abspath, function(err, stat) {
                if(stat.isDirectory()) {
                    found.dirs.push(abspath);
                    // If we found a directory, recurse!
                    readDir(abspath, function(err, data) {
                        found.dirs = found.dirs.concat(data.dirs);
                        found.files = found.files.concat(data.files);
                        if(++processed == total) {
                            callback(null, found);
                        }
                    });
                } else {
                    found.files.push(abspath);
                    if(++processed == total) {
                        callback(null, found);
                    }
                }
            });
        }
        // Read through all the files in this directory
        if(stat.isDirectory()) {
            fs.readdir(start, function (err, files) {
                total = files.length;
                for(var x=0, l=files.length; x<l; x++) {
                    isDir(path.join(start, files[x]));
                }
            });
        } else {
            return callback(new Error("path: " + start + " is not a directory"));
        }
    });
};