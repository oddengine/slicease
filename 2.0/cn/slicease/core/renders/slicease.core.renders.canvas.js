(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	function p(a, b, c) {
		return {x: a || 0, y: b || 0, z: c || 0};
	}
	
	function cuboid(width, height, origin) {
		var _this = this,
			_names,
			_points,
			_properties,
			_changed;
		
		function _init() {
			_this.width = Math.abs(width || 400);
			_this.height = Math.abs(height || 150);
			_this.origin = utils.clone(origin) || p(0, 0, 0);
			
			_names = ['a0', 'b0', 'c0', 'd0', 'a1', 'b1', 'c1', 'd1'];
			_points = {};
			
			_properties = {
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				scaleX: 1,
				scaleY: 1,
				scaleZ: 1
			};
			_changed = true;
		}
		
		_this.getPoint = function(name) {
			return _points[name];
		};
		_this.getPoints = function() {
			return _points;
		};
		
		_this.setProperty = function(name, value) {
			if (_properties[name] !== value) {
				_properties[name] = value;
				_changed = true;
			}
		};
		_this.getProperty = function(name) {
			return _properties[name];
		};
		
		_this.flush = function() {
			if (_changed) {
				for (var i = 0; i < _names.length; i++) {
					var name = _names[i];
					_points[name] = _getPoint(name);
				}
				_changed = false;
			}
		};
		
		function _getPoint(name) {
			if (!name || typeof name !== 'string') {
				return null;
			}
			
			var point = p(_this.width / 2, _this.height / 2, _this.height / 2);
			if (name.substr(1, 1) === '0') {
				point.x *= -1;
			}
			switch (name.substr(0, 1)) {
				case 'a':
					point.y *= -1;
					break;
				case 'd':
					point.y *= -1;//do not use 'break' here
				case 'c':
					point.z *= -1;
					break;
			}
			
			var rotateX = _this.getProperty('rotateX'),
				rotateY = _this.getProperty('rotateY'),
				rotateZ = _this.getProperty('rotateZ');
			if (rotateX) {
				var y = point.y * Math.cos(rotateX) - point.z * Math.sin(rotateX);
				var z = point.y * Math.sin(rotateX) + point.z * Math.cos(rotateX);
				point.y = y;
				point.z = z;
			}
			if (rotateY) {
				var x = point.z * Math.sin(rotateY) + point.x * Math.cos(rotateY);
				var z = point.z * Math.cos(rotateY) - point.x * Math.sin(rotateY);
				point.x = x;
				point.z = z;
			}
			if (rotateZ) {
				var x = point.x * Math.cos(rotateZ) - point.y * Math.sin(rotateZ);
				var y = point.x * Math.sin(rotateZ) + point.y * Math.cos(rotateZ);
				point.y = y;
				point.z = z;
			}
			
			point.x *= _this.getProperty('scaleX');
			point.y *= _this.getProperty('scaleY');
			point.z *= _this.getProperty('scaleZ');
			
			return point;
		}
		
		_init();
	}
	
	
	renders.canvas = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_defaults = {
				pieces: [7],
		 		delays: function(index, pieces, item, reverse) {
		 			return (reverse ? pieces - index - 1 : index) * 200;
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 1200,
		 		objectDistance: 100,
		 		startAnimation: {
		 			keyframes: {
		 				'0%': { rotateX: 45, z: -800, alpha: 0 },
		 				'80%': { rotateX: 90 },
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
		 				'from': { rotateX: 0, z: 0 },
		 				//'50%': { z: -500 },
		 				'to': { rotateX: 90, z: 0 }
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
			_camera,
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
			_canvas.width = slicer.model.width;
			_canvas.height = slicer.model.height;
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
			
			_camera = p(0, 0, _this.config.objectDistance + _this.height / 2);
			_interval = Math.floor(1000 / _this.config.fps);
		}
		
		_this.play = function(item, reverse) {
			var prev = _item;
			_item = item || 0;
			
			_resetCuboids();
			_reverse = reverse || (prev > _item && (prev !== slicer.model.sources.length - 1 || _item !== 0));
			
			if (!_timer) {
				_timer = new utils.timer(_interval);
				_timer.addEventListener(events.SLICEASE_TIMER, _draw);
			}
			_timer.reset();// in case it is drawing, & reset timer.currentCount
			_timer.start();
		};
		
		function _draw() {
			_cvs.width = _cvs.width;// clear
			
			var animation = _startanimation;
			if (_loaded || animation === undefined) {
				_animationIndex = _next(_animations, _animationIndex);
				animation = _animations[_animationIndex];
			}
			
			var cvs, ctx;
			cvs = utils.createElement('canvas');
			cvs.width = _canvas.width;
			cvs.height = _canvas.height;
			ctx = cvs.getContext('2d');
			
			var currenttime = _timer.currentCount() * _interval,
				maxdelay = 0;
			for (var i = 0; i < _cuboids.length; i++) {
				var cub = _cuboids[i],
					cubdelay = _getCuboidDelay(i),
					time = currenttime - cubdelay;
				maxdelay = Math.max(maxdelay, cubdelay);
				
				animation.ease(time, function(k, v) {
					switch (k) {
						case 'alpha':
							ctx.globalAlpha = v / 100;
							break;
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
							cub.setProperty(k, (_reverse ? v : 360 - v) * Math.PI / 180);
							break;
						case 'scaleX':
						case 'scaleY':
						case 'scaleZ':
							cub.setProperty(k, v);
							break;
						case 'x':
						case 'y':
						case 'z':
							cub.origin[k] += v;
							break;
						default:
							utils.log('Unknown property ' + k + ', ignored.');
					}
				});
				
				cub.flush();
				var points = cub.getPoints(),
					picPoints = {};
				utils.foreach(points, function(name, point) {
					var camPoint = _object2Camera(point, cub.origin, _camera),
						picPoint;
					picPoints[name] = picPoint = _picturePoint(camPoint);
					
				});
				_drawLines(picPoints);
			}
			
			_canvas.width = _canvas.width;
			_context.drawImage(_cvs, 0, 0, _cvs.width, _cvs.height, 0, 0, _canvas.width, _canvas.height);
			
			if (currenttime >= maxdelay + animation.delay + animation.duration) {
				_loaded = true;
				_timer.stop();
				_this.dispatchEvent(events.SLICEASE_STATE, { state: states.IDLE, item: _item });
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
			if (point.z > 0) {
				return null;
			}
			
			// (x - eye.x) / (point.x - eye.x) = (y - eye.y) / (point.y - eye.y) = (z - eye.z) / (point.z - eye.z)
			var eye = p(0, 0, sightDistance || _this.config.sightDistance),
				vector = p(point.x - eye.x, point.y - eye.y, point.z - eye.z),
				delta = (0 - eye.z) / vector.z,
				point = p(vector.x * delta + eye.x, vector.y * delta + eye.y, 0);
			point.x += _this.config.padding.left + _this.width / 2;
			point.y += _this.config.padding.top + _this.height / 2;
			return point;
		}
		
		function _drawLines(points) {
			_ctx.beginPath();
			_ctx.strokeStyle = _this.config.strokeStyle;
			_ctx.moveTo(points.a0.x, points.a0.y);
			_ctx.lineTo(points.b0.x, points.b0.y);
			_ctx.lineTo(points.c0.x, points.c0.y);
			_ctx.lineTo(points.d0.x, points.d0.y);
			_ctx.lineTo(points.a0.x, points.a0.y);
			
			_ctx.lineTo(points.a1.x, points.a1.y);
			_ctx.lineTo(points.b1.x, points.b1.y);
			_ctx.lineTo(points.c1.x, points.c1.y);
			_ctx.lineTo(points.d1.x, points.d1.y);
			_ctx.lineTo(points.a1.x, points.a1.y);
			_ctx.closePath();
			
			_ctx.moveTo(points.b0.x, points.b0.y);
			_ctx.lineTo(points.b1.x, points.b1.y);
			_ctx.moveTo(points.c0.x, points.c0.y);
			_ctx.lineTo(points.c1.x, points.c1.y);
			_ctx.moveTo(points.d0.x, points.d0.y);
			_ctx.lineTo(points.d1.x, points.d1.y);
			
			_ctx.stroke();
		}
		
		
		function _resetCuboids() {
			_pieceIndex = _next(_this.config.pieces, _pieceIndex);
			var pieces = parseInt(_this.config.pieces[_pieceIndex]);
			
			_cuboids = [];
			var wth = Math.floor(_this.width / pieces);
			for (var i = 0; i < pieces; i++) {
				if (i === pieces - 1) {
					//wth = _this.width - (pieces - 1) * wth;
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
