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
	 			duration: 0,
	 			'timing-function': timingfunction.EASE,
	 			delay: 0,
	 			'iteration-count': 1,
	 			direction: 'normal'// alternate
			},
			_points;
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			_points = _getPoints();
		}
		
		_this.ease = function(time) {
			if (!_points || _points.length < 2) {
				return;
			}
			
			var t = _percent(time);
			return _shrink(_points, t);
		};
		
		function _percent(time) {
			if (_this.config.duration === 0) {
				return 1;
			}
			if (time <= _this.config.delay) {
				return 0;
			}
			
			return Math.min((time - _this.config.delay) / _this.config.duration, 1);
		}
		
		function _shrink(points, percent) {
			var shrinked = [];
			for (var i = 1; i < points.length; i++) {
				var m = points[i - 1];
				var n = points[i];
				shrinked.push(p(m.x + (n.x - m.x) * percent, m.y + (n.y - m.y) * percent));
			}
			if (shrinked.length > 1) {
				_shrink(shrinked, percent);
			} else {
				return shrinked[0].y;
			}
		}
		
		function _getPoints() {
			var points;
			switch (_this.config['timing-function']) {
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
