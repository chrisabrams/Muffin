#Muffin
Create a static website/blog.

##What it does
Creates a website/blog into static .html files - no database needed.

 - Converts articles written markdown into .html
 - Allows for a single template written in .jade or .html to be used as the site's template
 - Styling can be written in .css, .less, or .styl

##Getting Started
Install Muffin globally (As we will use it via the CLI)

	npm install Muffin -g

Navigate to the directory that you want to be your root of your site/blog and type

	Muffin setup

###Settings file
In the root of the directory will be a file entitled muffin.json - open this file

 - avatar: this is used for the RSS feed
 - author: this is you
 - domain: this is the full path to the blog (for rss feed links)
 - engines
  - markup: what templating engine for markup to use (currently jade is only option)
  - styles: what css processor (if any) is used (options: css | less | stylus)
 - meta: these are the site/rss meta tags
 - pages: ignore for now
 - template: the name of the template you are using (folder name in /templates)
 - urlformat: used for formatting the article url: Y, m, d are all optional and T is required
  - Y = Year&nbsp; 4 digits
  - m = Month 2 digits
  - d = Day&nbsp;&nbsp; 2 digits
  - T = Full title of the article

##Create a new post

	Muffin post

Then you'll be greated with a prompt asking you for an article name

	name: 

Enter a unique name for the article

##Commands
To get a list of all the commands:

	Muffin -h

##Build

	./build

##Test

	make test

##Todo

 - Clean up Muffin.bake because it's a mess
 - Set limit on # of chars. for blogs without h2's
 - Allow year in the blog url to be 2 years
 - Make article title in url optionally shorter (have no idea how)
 - Have option for setup using nodejitsu for deployment
 - Have option for setup using Github for deployment
 - Remove JS DOM as a dependency (it sucks)
 - Remove markx as a dependency