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

##Configuration
Settings for baking the site/blog.

	{
		"blog": "/Y/m/d/T"
	}

Y = Year&nbsp; 4 digits
m = Month 2 digits
d = Day&nbsp;&nbsp; 2 digits
T = Full title of the article

Set up the format of the blog's url structure: Y, m, d are all optional and T is required

##Todo

 - Clean up Muffin.bake because it's a mess
 - Set limit on # of chars. for blogs without h2's
 - Allow year in the blog url to be 2 years
 - Make article title in url optionally shorter (have no idea how)
 - Have option for setup using nodejitsu for deployment
 - Have option for setup using Github for deployment
 - Remove JS DOM as a dependency (it sucks)
 - Remove markx as a dependency