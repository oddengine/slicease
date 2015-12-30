(function(slicease) {
	var utils = slicease.utils,
		
		timingfunction = {
		LINEAR: 'linear',
		EASE: 'ease',
		EASE_IN: 'ease-in',
		EASE_OUT: 'ease-out',
		EASE_IN_OUT: 'ease-in-out',
		ELASTIC: 'elastic',
		WAVES_IN: 'waves-in'
	};
	
	var p = function(a, b, c) {
		return { x: a || 0, y: b || 0, z: c || 0 };
	};
	
	slicease.animation = function(config) {
		var _this = this,
			_defaults = {
				properties: {},
	 			duration: 0,
	 			'timing-function': timingfunction.EASE,
	 			delay: 0,
	 			'iteration-count': 1,
	 			direction: 'normal'// alternate
			},
			_points;
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.extend(_this, _this.config);
			utils.foreach(_this.properties, function(name, property) {
				var keyframes = [];
				utils.foreach(property.keyframes, function(key, val) {
					keyframes.push({
						ratio: (key === 'from' ? 0 : (key === 'to' ? 100 : parseInt(key))) / 100,
						value: val
					});
				});
				keyframes.sort(function(a, b) {
					return a.ratio - b.ratio;
				});
				property.keyframes = keyframes;
			});
		}
		
		_this.ease = function(time, oneach) {
			var timeratio = _getTimeRatio(time);
			utils.foreach(_this.properties, function(name, property) {
				var prop = {};
				for (var i = 0; i < property.keyframes.length; i++) {
					var keyframe = property.keyframes[i];
					if (keyframe.ratio < timeratio || prop.from === undefined) {
						prop.from = keyframe.value;
						prop.to = undefined;
						prop.fr = keyframe.ratio;
					} else if (prop.to === undefined) {
						prop.to = keyframe.value;
						prop.tr = keyframe.ratio;
					}
				}
				
				if (typeof oneach === 'function') {
					if (prop.to === undefined) {
						oneach(name, prop.from);
					} else {
						var exacttimeratio = (timeratio - prop.fr) / (prop.tr - prop.fr),
							points = _getPoints(property['timing-function']),
							shrinked = _bezierShrink(points, exacttimeratio),
							valueratio = shrinked[0].y,
							finalvalue = prop.from + (prop.to - prop.from) * valueratio;
						oneach(name, finalvalue);
					}
				}
			});
		};
		
		function _getTimeRatio(time) {
			if (_this.duration === 0) {
				return 1;
			}
			if (time <= _this.delay) {
				return 0;
			}
			
			var actualtime = time - _this.delay;
			if (actualtime >= _this['iteration-count'] * _this.duration) {
				return (_this.direction === 'alternate' ? (Math.ceil(actualtime / _this.duration) % 2) : 1);
			}
			
			var ratio = (actualtime % _this.duration) / _this.duration;
			return _this.direction === 'alternate' && !(Math.ceil(actualtime / _this.duration) % 2) ? 1 - ratio : ratio;
		}
		
		function _bezierShrink(points, ratio) {
			if (!points || points.length < 2) {
				return 1;
			}
			
			var shrinked = [];
			for (var i = 1; i < points.length; i++) {
				var m = points[i - 1];
				var n = points[i];
				shrinked.push(p(m.x + (n.x - m.x) * ratio, m.y + (n.y - m.y) * ratio));
			}
			if (shrinked.length > 1) {
				shrinked = _bezierShrink(shrinked, ratio);
			}
			return shrinked;
		}
		
		function _getPoints(timingfn) {
			if (!timingfn) {
				timingfn = _this['timing-function'];
			}
			var points;
			switch (timingfn) {
				case timingfunction.LINEAR:
					points = [p(0, 0), p(1, 1)];
					break;
				case timingfunction.EASE:
					points = [p(0, 0), p(0.25, 0.1), p(0.25, 1), p(1, 1)];
					break;
				case timingfunction.EASE_IN:
					points = [p(0, 0), p(0.42, 0), p(1, 1)];
					break;
				case timingfunction.EASE_OUT:
					points = [p(0, 0), p(0.58, 1), p(1, 1)];
					break;
				case timingfunction.EASE_IN_OUT:
					points = [p(0, 0), p(0.42, 0), p(0.58, 1), p(1, 1)];
					break;
				case timingfunction.ELASTIC:
					points = [p(0, 0), p(0.5, 0.5), p(0.75, 1), p(0.85, 2), p(0.95, 1), p(0.97, 0.7), p(1, 1)];
					break;
				case timingfunction.WAVES_IN:
					points = [p(0, 0), p(0.2, -0.5), p(0.4, 0.5), p(0.6, -0.5), p(1, 1)];
					break;
				default:
					points = _points;
					break;
			}
			return points;
		}
		
		_this.setPoints = function(points) {
			_points = points;
		};
		
		_init();
	};
})(slicease);
