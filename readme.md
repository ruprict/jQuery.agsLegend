jQuery AGS Legend
==================

jQuery AGS Legend is a jQuery plugin that will create a TOC type legend
for an ArcGIS Server jsapi map object (esri.Map).

Why?
====
I wanted to write a jQuery plugin and use ArcGIS 10 stuff.  So, here I am.
Oh, and I needed something to present at the Charlotte ESRI Dev Meetup


What's it Do?
======================

It's life-changing: (if your life is especially boring)

* Legend symbols for many AGS layer types (hope to get them all at some point)
* Visiblity control of layers
* Uses the [jQuery Templating plugin](http://github.com/jquery/jquery-tmpl)
* Uses [Raphael](http://raphaeljs.com/)
* REQUIRES ArcGIS 10 and the latest jsapi api from ESRI.


Quick Start: Example Apps You Can Use
=====================================

1. Check out the code from github:

        git clone git://github.com/ruprict/jquery.agsLegend.git

2. Reference it in your HTML page, along with the templating plugin and Raphael.

3. Copy the script block from jquery.agsLegend.templates.js to the bottom of your HTML file

4. In your javascript, create an AGS map.

5. Then you can
	
	legend = $('#toc').agsLegend({map:map});
	
where #toc is a unordered list object.

5. Rock out

Are You Gonna Do Anything Else With It?
=======================================
I dunno, maybe.  There is a lot to be done, like:

* Support all symbols and layer types
* I haven't even thought about group layers yet
* Break up templates.txt into separate files for layer types
* Clean up template loading, big time
* Unit tests (I mean, c'mon, man.)

Feel free to clone it and add stuff and issue a pull request.

