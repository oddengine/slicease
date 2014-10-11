slicease.js
===========

[domain](http://studease.cn/)
[source](https://github.com/studease/Slicease)
[Chinese doc](http://blog.csdn.net/icysky1989/article/details/39624155)

### Description ###

This is a 3D image rotator with animation easing based on Bezier curve, 
which was planned as the tile of my proposed website. 

It is built with html5 canvas and pure javascript, and easy to config. 
This project is open-sourced with MIT lisence. Enjoy it wherever you like :)

### Usage ###

Include the library under the folder of 'js'. You just need a canvas tag in your html file and make your images ready.
Then, as the index.html does, here we go~

//script
var slicease = new Slicease();
var markfunc = new Func();
markfunc.setup(markIndex);
var config = {
	canvas_id: 'canvas', 
	images: ['contents/img1.png', 'contents/img2.png', 'contents/img3.png'], 
	pieces: [5, 4, 6],
	mark_func: markfunc
};
slicease.setup(config);
slicease.init();
slicease.play();
//endscript

The 'pieces' in the config means how many cubes of each image should be separated.
'mark_func' must be typed with Func, not just a function.
There are more configurations. You can find them marked with 'Available settings' in the main class named 'Slicease'. 
Such as 'padding', 'delays', 'duration', etc.
Which should be noticed is that 'screen_z' must be closer or smaller than 'object_z'.

There are several cfgs named 'easing_xxx', and you can have a look at the Slicease.init function once you want to 
change the easing params or redefine the easing functions. 
