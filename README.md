# slicease.js 3.0

> [[domain] http://studease.cn](http://studease.cn)

> [[source] https://github.com/studease/slicease](https://github.com/studease/slicease)

> [[zh_doc] http://blog.csdn.net/icysky1989/article/details/39624155](http://blog.csdn.net/icysky1989/article/details/39624155)

This is a 3D image rotator using webgl, designed for my homepage. 


## Example

The example below will find the element with an id of sli-box and render a slicer into it.

```js
slicease('slicer').setup({
	width: 1200,
	height: 500,
	sources: ['images/img1.png', 'images/img2.png', 'images/img3.png'],
	range: '3-6'
});
```

For more configurations, please check cn/studease/embed/slicease.embed.config.js.

```js
_defaults = {
	width: 640,
	height: 360,
	sources: [],
	range: '3-10',
	controls: true,
	interval: 5000,
	render: {
		name: rendermodes.DEFAULT,
		precision: precisions.HIGH_P
	},
	skin: {
		name: skinmodes.DEFAULT
	}
}
```


## Modify

Please check the test/index.html for scripts sequence.


## Software License

MIT.
