(function(slicease) {
	var utils = slicease.utils,
		
		timingfunction = {
		LINEAR: 'linear',
		EASE: 'ease',
		EASE_IN: 'ease-in',
		EASE_OUT: 'ease-out',
		EASE_IN_OUT: 'ease-in-out',
		ELASTIC: 'elastic'
	};
	
	var p = function(a, b, c) {
		return {x: a || 0, y: b || 0, z: c || 0};
	};
	
	slicease.animation = function(config) {
		var _this = this,
			_defaults = {
				keyframes: {},
	 			duration: 0,
	 			'timing-function': timingfunction.EASE,
	 			delay: 0,
	 			'iteration-count': 1,
	 			direction: 'normal'// alternate
			},
			_points;
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.deepExtend(_this, _this.config, {
				keyframes: (function() {
					var keyframes = [];
					utils.foreach(_this.config.keyframes, function(key, val) {
						keyframes.push({
							ratio: (key === 'from' ? 0 : (key === 'to' ? 100 : parseInt(key))) / 100,
							properties: val
						});
					});
					keyframes.sort(function(a, b) {
						return a.ratio - b.ratio;
					});
					return keyframes;
				})()
			});
			
			_points = _getPoints();
		}
		
		_this.ease = function(time, oneach) {
			if (!_points || _points.length < 2) {
				return;
			}
			
			var timeratio = _getTimeRatio(time),
				valueratio = _bezierShrink(_points, timeratio),
				properties = {};
			for (var i = 0; i < _this.keyframes.length; i++) {
				var keyframe = _this.keyframes[i];
				utils.foreach(keyframe.properties, function(key, val) {
					if (properties.hasOwnProperty(key) === false) {
						properties[key] = { from: val, to: null };
					} else if (keyframe.ratio <= timeratio || properties[key].to === null) {
						if (properties[key].to !== null) {
							properties[key].from = properties[key].to;
						}
						properties[key].to = val;
					}
				});
			}
			
			utils.foreach(properties, function(k, v) {
				if (v.to !== null && typeof oneach === 'function') {
					oneach(k, v.from + (v.to - v.from) * valueratio);
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
				_bezierShrink(shrinked, ratio);
			} else {
				return shrinked[0].y;
			}
		}
		
		function _getPoints() {
			var points;
			switch (_this['timing-function']) {
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
				default:
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
