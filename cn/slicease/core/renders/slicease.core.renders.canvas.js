(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		renders = core.renders,
		css = utils.css,
		
		VIEW_CONTROLS_CONTAINER_CLASS = 'secontrols',
		PAGER_CONTAINER_CLASS = 'sepager';
	
	function p(a, b, c) {
		return { x: a || 0, y: b || 0, z: c || 0 };
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
		 			return (reverse ? pieces - index - 1 : index) * (pieces > 5 ? 100 : 200);
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 1200,
		 		objectDistance: 100,
		 		startAnimation: {
		 			properties: {
		 				rotateX: { keyframes: { from: 45, to: 90 } },
		 				scaleX: { keyframes: { from: 0.9, to: 1 } },
		 				z: { keyframes: { from: -1000, to: 0 } },
		 				alpha: { keyframes: { from: 0, to: 100 } }
		 			},
		 			duration: 600,
		 			'timing-function': 'ease-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
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
		 			properties: {
		 				rotateX: { keyframes: { from: 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '25%': 0.9, '75%': 0.9, to: 1 }, 'timing-function': 'linear' },
		 				z: { keyframes: { from: 0, '25%': -1000, '60%': -1000, to: 0 }, 'timing-function': 'ease-out' }
		 			},
		 			duration: 1200,
		 			'timing-function': 'waves-in',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}, {
		 			properties: {
		 				rotateX: { keyframes: { from: 0, '60%': 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '60%': 0.8, to: 1 }, 'timing-function': 'linear' },
		 				scaleY: { keyframes: { from: 1, '60%': 0.8, to: 1 }, 'timing-function': 'linear' },
		 				z: { keyframes: { from: 0, '80%': -400, to: 0 }, 'timing-function': 'ease-out' }
		 			},
		 			duration: 1200,
		 			'timing-function': 'ease-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}, {
		 			properties: {
		 				rotateX: { keyframes: { from: 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '50%': 0.9, to: 1 } },
		 				z: { keyframes: { from: 0, '50%': -800, to: 0 } }
		 			},
		 			duration: 1200,
		 			'timing-function': 'ease-in-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}],
		 		fps: 24,
		 		strokeStyle: 'rgb(0,0,250)',
		 		tbStyle: '#aaa',
		 		lrStyle: '#ccc'
			},
			
			_canvas, _context,
			_cvs, _ctx,
			_startanimation,
			_animations = [],
			_images = [],
			_cuboids,
			_camera,
			_previtem = -1,
			_item = -1,
			_pieceIndex = -1,
			_animationIndex = -1,
			_interval,
			_timer,
			_loaded = false,
			_reverse = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
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
			
			css('.' + VIEW_CONTROLS_CONTAINER_CLASS, {
				height: _this.height + 'px',
				top: _this.config.padding.top + 'px'
			});
			
			css('.' + PAGER_CONTAINER_CLASS, {
				bottom: Math.min(- 24 - (_this.config.padding.bottom - 24) / 2, -24) + 'px'
			});
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
			
			if (!config.hasOwnProperty('startAnimation') || config.startAnimation !== null) {
				_startanimation = new slicease.animation(_this.config.startAnimation);
			}
			for (var a = 0; a < _this.config.animation.length; a++) {
				_animations.push(new slicease.animation(_this.config.animation[a]));
			}
			
			_camera = p(0, 0, _this.config.objectDistance + _this.height / 2);
			_interval = Math.floor(1000 / _this.config.fps);
		}
		
		_this.play = function(item, reverse) {
			_previtem = _item < 0 ? slicer.model.sources.length - 1 : _item;
			_item = item || 0;
			
			_resetCuboids();
			_reverse = reverse || (_previtem > _item && (_previtem !== slicer.model.sources.length - 1 || _item !== 0));
			
			_animationIndex = _next(_animations, _animationIndex);
			
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
				animation = _animations[_animationIndex];
			}
			
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
							_ctx.globalAlpha = v / 100;
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
							cub.origin[k] = v;
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
				
				//_drawLines(picPoints);
				_drawTexture(picPoints, i, _cuboids.length);
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
		
		function _drawTexture(points, index, pieces) {
			var img = _images[_item],
				swidth = img.width / pieces,
				sheight = img.height,
				sx = swidth * index,
				rightSide = index >= pieces / 2;
			if (index === pieces - 1) {
				//swidth = img.width - swidth * index;
			}
			
			if (index < pieces / 2) {
				// right side
				_fill(points.a1, points.b1, points.c1, points.d1, _this.config.lrStyle, true);
				if (_reverse) {
					// top side
					if (points.a0.y > points.d0.y) {
						_fill(points.a0, points.a1, points.d1, points.d0, _this.config.tbStyle, true);
					}
				} else {
					// bottom side
					if (points.c0.y > points.b0.y) {
						_fill(points.b0, points.b1, points.c1, points.c0, _this.config.tbStyle, true);
					}
				}
				// back side
				if (points.d0.y > points.c0.y) {
					_fill(points.c0, points.c1, points.d1, points.d0, _this.config.tbStyle, true);
				}
			}
			
			if (_reverse) {
				// bottom side
				if (points.c0.y > points.b0.y) {
					_drawTriangle(img, sx, 0, swidth, sheight, points.b0, points.c0, rightSide ? points.b1 : null, rightSide ? null : points.c1, !rightSide);
					_drawTriangle(img, sx, 0, swidth, sheight, rightSide ? null : points.b0, rightSide ? points.c0 : null, points.b1, points.c1, !rightSide);
				}
				
				// front side
				if (points.b0.y > points.a0.y) {
					var imgnext = _images[_previtem];
					imgnext.width = img.width;
					imgnext.height = img.height;
					_drawTriangle(imgnext, sx, 0, swidth, sheight, points.a0, points.b0, rightSide ? null : points.a1, rightSide ? points.b1 : null, !rightSide);
					_drawTriangle(imgnext, sx, 0, swidth, sheight, rightSide ? points.a0 : null, rightSide ? null : points.b0, points.a1, points.b1, !rightSide);
				}
			} else {
				// top side
				if (points.a0.y > points.d0.y) {
					_drawTriangle(img, sx, 0, swidth, sheight, points.d0, points.a0, rightSide ? null : points.d1, rightSide ? points.a1 : null, !rightSide);
					_drawTriangle(img, sx, 0, swidth, sheight, rightSide ? points.d0 : null, rightSide ? null : points.a0, points.d1, points.a1, !rightSide);
				}
				
				// front side
				if (points.b0.y > points.a0.y) {
					var imgprev = _images[_previtem];
					imgprev.width = img.width;
					imgprev.height = img.height;
					_drawTriangle(imgprev, sx, 0, swidth, sheight, points.a0, points.b0, rightSide ? points.a1 : null, rightSide ? null : points.b1, !rightSide);
					_drawTriangle(imgprev, sx, 0, swidth, sheight, rightSide ? null : points.a0, rightSide ? points.b0 : null, points.a1, points.b1, !rightSide);
				}
			}
			
			if (index > pieces / 2) {
				// left side
				_fill(points.a0, points.b0, points.c0, points.d0, _this.config.lrStyle, false);
				if (_reverse) {
					// top side
					if (points.a0.y > points.d0.y) {
						_fill(points.a0, points.a1, points.d1, points.d0, _this.config.tbStyle, false);
					}
				} else {
					// bottom side
					if (points.c0.y > points.b0.y) {
						_fill(points.b0, points.b1, points.c1, points.c0, _this.config.tbStyle, false);
					}
				}
				// back side
				if (points.d0.y > points.c0.y) {
					_fill(points.c0, points.c1, points.d1, points.d0, _this.config.tbStyle, false);
				}
			}
		}
		
		function _drawTriangle(img, sx, sy, swidth, sheight, a0, b0, a1, b1, sourceOver) {
			var cvs, ctx;
			cvs = utils.createElement('canvas');
			cvs.width = _canvas.width;
			cvs.height = _canvas.height;
			ctx = cvs.getContext('2d');
			
			var a, b = 0, c, d,
				e = a0 ? a0.x : b0.x + a1.x - b1.x,
				f = a0 ? a0.y : a1.y;
			
			ctx.beginPath();
			ctx.strokeStyle = _this.config.strokeStyle;
			if (a0 === null) {
				ctx.moveTo(b0.x, b0.y);
				ctx.lineTo(a1.x, a1.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (b1.x - b0.x) / swidth;
				c = (b1.x - a1.x) / sheight;
				d = (b1.y - a1.y) / sheight;
			} else if (b0 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(a1.x, a1.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (a1.x - a0.x) / swidth;
				c = (b1.x - a1.x) / sheight;
				d = (b1.y - a1.y) / sheight;
			} else if (a1 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(b0.x, b0.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (b1.x - b0.x) / swidth;
				c = (b0.x - a0.x) / sheight;
				d = (b0.y - a0.y) / sheight;
			} else if (b1 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(b0.x, b0.y);
				ctx.lineTo(a1.x, a1.y);
				
				a = (a1.x - a0.x) / swidth;
				c = (b0.x - a0.x) / sheight;
				d = (b0.y - a0.y) / sheight;
			}
			ctx.closePath();
			//ctx.stroke();
			ctx.clip();
			
			ctx.setTransform(a, b, c, d, e, f);
			ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
			
			_ctx.globalCompositeOperation = sourceOver ? 'source-over' : 'destination-over';
			_ctx.drawImage(cvs, 0, 0, cvs.width, cvs.height, 0, 0, _cvs.width, _cvs.height);
		}
		
		function _fill(a, b, c, d, fillStyle, sourceOver) {
			_ctx.globalCompositeOperation = sourceOver ? 'source-over' : 'destination-over';
			_ctx.beginPath();
			_ctx.moveTo(a.x, a.y);
			_ctx.lineTo(b.x, b.y);
			_ctx.lineTo(c.x, c.y);
			_ctx.lineTo(d.x, d.y);
			_ctx.lineTo(a.x, a.y);
			_ctx.fillStyle = fillStyle || '#ccc';
			_ctx.fill();
			_ctx.closePath();
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
			var wth = _this.width / pieces;
			for (var i = 0; i < pieces; i++) {
				if (i === pieces - 1) {
					//wth = _this.width - wth * i;
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
