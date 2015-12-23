(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
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
			_width = Math.abs(width || 400);
			_height = Math.abs(height || 150);
			_origin = origin || p(0, 0, 0);
			
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
			_canvas,
			_defaults = {
				pieces: [7],
		 		delays: function(item, total, reverse) {
		 			return (reverse ? total - item - 1 : item) * 200;
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 200,
		 		objectDistance: 200,
		 		openingAnimation: {
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
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			_parseConfig();
			
			_canvas = utils.createElement('canvas');
			_canvas.style.width = slicer.model.width + 'px';
			_canvas.style.height = slicer.model.height + 'px';
			_canvas.innerHTML = '<a>Canvas not supported!</a>'
				+ '<a>Please open in a browser listed below:</a>'
				+ '<a>chrome, firefox, opera, safari</a>';
		}
		
		function _parseConfig() {
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
			}
			
			if (utils.typeOf(_this.config.keyframes) === 'object') {
				var keyframes = [];
				utils.foreach(_this.config.keyframes, function(key, val) {
					keyframes.push({
						percent: (key === 'from' ? 0 : (key === 'to' ? 100 : parseInt(key))) / 100,
						properties: val
					});
				});
				keyframes.sort(function(a, b) {
					return a.percent - b.percent;
				});
				_this.config.keyframes = keyframes;
			}
		}
		
		_this.play = function(item) {
			if (item === undefined || item === null) {
				item = 0;
			}
			
			// For testing
			_this.dispatchEvent(events.SLICEASE_STATE, { state: states.IDLE, item: item });
		};
		
		function object2Camera(objPoint, objOrigin, camOrigin) {
			// camPoint = objPoint - vector
			// = objPoint - (camOrigin - objOrigin)
			return p(
				objPoint.x + objOrigin.x - camOrigin.x,
				objPoint.y + objOrigin.y - camOrigin.y,
				objPoint.z + objOrigin.z - camOrigin.z
			);
		}
		
		function picturePoint(point, sightDistance) {
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
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
