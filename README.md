# slicease.js

> [domain] (http://studease.cn/)

> [source] (https://github.com/studease/Slicease)

> [zh_doc] (http://blog.csdn.net/icysky1989/article/details/39624155)

This is a 3D image rotator designed for my personal homepage. 

It is built on html5 canvas and wrote in pure javascript. Unlike with the css3 animation, the control points of bezier curve are not limited in the range of 0 to 1, so is the number of the points. It also has a powerful and easy-to-understand configuration.


## Example

The example below will find the element with an id of sli-container and render a slicer into it.

```js
var sli = slicease('slicer').setup({
	width: 1200,
	height: 500,
	sources: ['images/img1.png', 'images/img2.png', 'images/img3.png'],
	renderMode: 'canvas', // default mode
	canvas: {
		pieces: [9, 10, 8, 3]
	}
});
```

For more configurations, please check cn/studease/embed/slicease.embed.config.js.

```js
_defaults = {
	sources: [],
	width: 480,
	height: 270,
	controls: true,
	canvas: {},
	display: {},
	pager: {},
	interval: 3500,
	renderMode: renderMode.CANVAS,
	fallback: true
}
```

And also cn/studease/core/renders/slicease.core.renders.canvas.js.

```js
_defaults = {
...
animation: [{
	properties: {
		rotateX: { keyframes: { from: 0, to: 90 } },
		scaleX: { keyframes: { from: 1, '40%': 0.9, to: 1 }, 'timing-function': 'linear' },
		z: { keyframes: { from: 0, '40%': -800, '80%': 0 }, 'timing-function': 'ease-out' }
	},
	duration: 1200,
	'timing-function': 'elastic',
	delay: 0,
	'iteration-count': 1,
	direction: 'normal'
}, {
...
```

You can easily change the params here, or setup a new animation array at the very front initialization.


## Modify

Please check the test/index.html for scripts sequence.


## Software License

This project is open-sourced with MIT lisence. Enjoy it wherever you like :)
