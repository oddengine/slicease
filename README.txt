slicease.js
===========

[domain](http://studease.cn/)
[source](https://github.com/studease/Slicease)
[Chinese doc](http://blog.csdn.net/icysky1989/article/details/39624155)

### About ###

This is a 3D image rotator designed for my personal homepage. 

It is built on html5 canvas and wrote in pure javascript. Unlike with the css3 animation, 
the control points of bezier curve are not limited in the range of 0 to 1, 
so is the number of the points. It also has a powerful and easy-to-understand configuration.

This project is open-sourced with MIT lisence. Enjoy it wherever you like :)

### Usage ###

You just need to name out a container and get your images ready.
Here's the basic settings you may need:

//script
var sli = slicease('slicer').setup({
	width: 1200,
	height: 500,
	sources: ['images/img1.png', 'images/img2.png', 'images/img3.png'],
	canvas: {
		pieces: [7, 8, 7, 6]
	}
});
//endscript

For more configurations, please search for the variables named '_defaults'.

### Modify ###

Please check the test/index.html for scripts sequence.
