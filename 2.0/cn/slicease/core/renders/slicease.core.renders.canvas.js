(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	var p = function(a, b, c) {
		return {x: a || 0, y: b || 0, z: c || 0};
	};
	
	var cuboid = function(width, height, origin) {
		var _this = this,
			_origin,
			_width,
			_height,
			_points = [];
		
		function _init() {
			_this.width = _width = Math.abs(width || 400);
			_this.height = _height = Math.abs(height || 150);
			_this.origin = _origin = origin || p(0, 0, 0);
			
			_points.push(_this.a0 = p(-_width / 2, _height / 2, -_height / 2));
			_points.push(_this.b0 = p(-_width / 2, -_height / 2, -_height / 2));
			_points.push(_this.c0 = p(-_width / 2, -_height / 2, _height / 2));
			_points.push(_this.d0 = p(-_width / 2, _height / 2, _height / 2));
			
			_points.push(_this.a1 = p(_this.a0.x * -1, _this.a0.y, -_this.a0.z));
			_points.push(_this.b1 = p(_this.b0.x * -1, _this.b0.y, -_this.b0.z));
			_points.push(_this.c1 = p(_this.c0.x * -1, _this.c0.y, -_this.c0.z));
			_points.push(_this.d1 = p(_this.d0.x * -1, _this.d0.y, -_this.d0.z));
		}
		
		_init();
	};
	
	renders.canvas = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_defaults = {
				pieces: [7],
		 		delays: function(index, pieces, item, reverse) {
		 			return (reverse ? pieces - index - 1 : index) * 200;
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 200,
		 		objectDistance: 200,
		 		startAnimation: {
		 			keyframes: {
		 				'0%': { angle: 45, z: 800, alpha: 0 },
		 				'80%': { angle: 90 },
		 				'100%': { z: 0, alpha: 100 }
		 			},
		 			duration: 600,
		 			'timing-function': 'ease',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
		 		animation: {
		 			keyframes: {
		 				'from': { angle: 0, z: 800 },
		 				'to': { angle: 90, z: 0 }
		 			},
		 			duration: 1200,
		 			'timing-function': 'elastic',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
		 		fps: 24,
		 		strokeStyle: 'rgb(0,0,250)',
		 		sideColor: '#999999'
			},
			
			_canvas, _context,
			_cvs, _ctx,
			_startanimation,
			_animations = [],
			_images = [],
			_cuboids,
			_item = -1,
			_pieceIndex = -1,
			_animationIndex = -1,
			_interval,
			_timer,
			_loaded = false,
			_reverse = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config, {
				startAnimation: utils.extend({}, _defaults.startAnimation, config.startAnimation),
				animation: (function() {
					var ani = [],
						cfgani = utils.typeOf(config.animation) === 'array' ? config.animation : [config.animation];
					for (var i = 0; i < cfgani.length; i++) {
						ani.push(utils.extend({}, _defaults.animation, cfgani[i]));
					}
					return ani;
				})()
			});
			_parseConfig();
			
			_canvas = utils.createElement('canvas');
			_canvas.style.width = slicer.model.width + 'px';
			_canvas.style.height = slicer.model.height + 'px';
			_canvas.innerHTML = '<a>Canvas not supported!</a>'
				+ '<a>Please open in a browser listed below:</a>'
				+ '<a>chrome, firefox, opera, safari</a>';
			_context = _canvas.getContext('2d');
			_context.strokeStyle = _this.config.strokeStyle;
			
			_cvs = utils.createElement('canvas');
			_cvs.width = _canvas.width;
			_cvs.height = _canvas.height;
			_ctx = _cvs.getContext('2d');
			
			
		}
		
		function _parseConfig() {
			for (var i = 0; i < slicer.model.sources.length; i++) {
				var imgloader = new renders.imageloader(slicer.model.sources[i]);
				_images.push(imgloader.element());
			}
			
			if (typeof _this.config.padding === 'string') {
				var padding = _this.config.padding.split(' ');
				if (padding.length < 2) padding.push(padding[0]);
				if (padding.length < 3) padding.push(padding[0]);
				if (padding.length < 4) padding.push(padding[1]);
				_this.config.padding = {
					top: parseInt(padding[0]),
					right: parseInt(padding[1]),
					bottom: parseInt(padding[2]),
					left: parseInt(padding[3])
				};
				_this.width = slicer.model.width - _this.config.padding.left - _this.config.padding.right;
				_this.height = slicer.model.height - _this.config.padding.top - _this.config.padding.bottom;
			}
			
			if (config.startAnimation) {
				_startanimation = new slicease.animation(_this.config.startAnimation);
			}
			for (var a = 0; a < _this.config.animation.length; a++) {
				_animations.push(new slicease.animation(_this.config.animation[a]));
			}
			
			_interval = Math.floor(1000 / _this.config.fps);
		}
		
		_this.play = function(item, reverse) {
			var prev = _item;
			_item = item || 0;
			_reverse = reverse || (prev > _item);
			
			if (!_timer) {
				_timer = new utils.timer(_interval);
				_timer.addEventListener(events.SLICEASE_TIMER, _draw);
			}
			_timer.reset();// in case it is drawing, & reset timer.currentCount
			
			_resetCuboids();
			_timer.start();
			
			// For testing
			setTimeout(function() {
				_this.dispatchEvent(events.SLICEASE_STATE, { state: states.IDLE, item: item });
			}, 0);
		};
		
		function _draw() {
			_ctx.width = _ctx.width;// clear
			
			var animation = _startanimation;
			if (_loaded || animation === undefined) {
				_animationIndex = _next(_animations, _animationIndex);
				animation = _animations[_animationIndex];
			}
			
			var currenttime = _timer.currentCount * _interval;
			for (var i = 0; i < _cuboids.length; i++) {
				var time = currenttime - _getCuboidDelay(i);
				animation.ease(time, function(p, v) {
					
				});
			}
		}
		
		function _getCuboidDelay(index) {
			if (typeof _this.config.delays === 'function') {
				return _this.config.delays(index, _cuboids.length, _item, _reverse);
			} else {
				return parseInt(_this.config.delays);
			}
		}
		
		function _object2Camera(objPoint, objOrigin, camOrigin) {
			// camPoint = objPoint - vector
			// = objPoint - (camOrigin - objOrigin)
			return p(
				objPoint.x + objOrigin.x - camOrigin.x,
				objPoint.y + objOrigin.y - camOrigin.y,
				objPoint.z + objOrigin.z - camOrigin.z
			);
		}
		
		function _picturePoint(point, sightDistance) {
			var dist = sightDistance || _this.config.sightDistance;
			if (point.z < 0) {
				return null;
			}
			
			// (x - sight.x) / (point.x - sight.x) = (y - sight.y) / (point.y - sight.y) = (z - sight.z) / (point.z - sight.z)
			var sight = p(0, 0, -dist),
				v = p(point.x - sight.x, point.y - sight.y, point.z - sight.z),
				delta = (0 - sight.z) / v.z;
			return p(v.x * delta + sight.x, v.y * delta + sight.y, 0);
		}
		
		
		function _resetCuboids() {
			_pieceIndex = _next(_this.config.pieces, _pieceIndex);
			var pieces = parseInt(_this.config.pieces[_pieceIndex]);
			
			_cuboids = [];
			var wth = Math.floor(_this.width / pieces);
			for (var i = 0; i < pieces; i++) {
				if (i === pieces - 1) {
					wth = _this.width - (pieces - 1) * wth;
				}
				_cuboids.push(new cuboid(wth, _this.height, p(wth * (i + 1) - wth / 2 - _this.width / 2, 0, 0)));
			}
		}
		
		function _prev(arr, cur) {
			cur--;
			return cur < 0 ? arr.length - 1 : cur;
		}
		function _next(arr, cur) {
			cur++;
			return cur >= arr.length ? 0 : cur;
		}
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
