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
		data,
		date,
		split,
		title;
	o = (o || {});

	//If a specific path was not called, then initialize in the current path of the CLI
	var libPath     = (o.libPath || Muffin.path.lib);
	var outputPath  = (o.outputPath || Muffin.path.called);
	var articlePath = outputPath + '/articles';

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

	//Get all articles to be built
	readDir(articlePath, function(dunno, found) {
		var dirs = found.dirs,
			dirsList = [],
			results;

		//Build out the directories to write the files
		dirs.forEach(function(dir, key) {
			if(typeof dir == "string") {
				//console.log(dir);return;
				var obj = {}, ymd, hms, datePieces, year, month, day, hour, minute, second;
				data = require(dir + '/data.json');
				datePieces = data.date.split(' ');
				//console.log(datePieces); return;
				ymd = datePieces[0].split('-');
				hms = datePieces[1].split(':');

				//(Y, M, D, H, M, S)
				obj.date = new Date(ymd[0], ymd[1], ymd[2], hms[0], hms[1], hms[2]);

				obj.title = dir.split(/[/ ]+/).pop();

				return dirsList.push(obj);
			}
		});

		/*dirs = dirs.sort((function(index){
		    return function(a, b){
		         console.log(a[index] + " " + b[index]);
		        return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
		    };
		})(0)); // 2 is the index*/
		//console.log(dirsList);
		results = dirsList.sortBy(function(o) {return o.date});

		console.log(results);return;

		//Get the name of each directory to build as an array
		/*var articleTitles = dirs.map(function(dir) {
			return dir.split(/[/ ]+/).pop();
		});*/
		//console.log(articles);


	});

	

	//Write the files

	//Figure out where metadata goes in this process (plates)
};
