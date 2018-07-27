# slicease.js 3.0

> [[domain] http://studease.cn](http://studease.cn)

> [[source] https://github.com/studease/slicease](https://github.com/studease/slicease)

> [[zh_doc] http://blog.csdn.net/icysky1989/article/details/39624155](http://blog.csdn.net/icysky1989/article/details/39624155)

This is a 3D image rotator using webgl, designed for my homepage. 


## Example

The example below will find the element with an id of sli-box and render a slicer into it.

```js
slicease('slicer').setup({
	width: 1000,
	height: 460,
	sources: ['images/img1.png', 'images/img2.png', 'images/img3.png', 'images/img4.png'],
	range: '3-9',
	cubic: '5,4',
	distance: 12
});
```

For more configurations, please check cn/studease/embed/slicease.embed.config.js.

```js
_defaults = {
	width: 640,
	height: 360,
	aspectratio: '',
	sources: [],
	range: '3-9',
	cubic: '5,4',
	distance: 12,
	interval: 5000,
	controls: true,
	debug: false,
	render: {
		name: rendertypes.DEFAULT,
		precision: precisions.HIGH_P,
		profile: [0.6, 0.6, 0.6, 1.0]
	},
	skin: {
		name: skintypes.DEFAULT
	},
	events: {
		
	}
}
```


## Modify

Please check the test/index.html for scripts sequence.


## Software License

MIT.
