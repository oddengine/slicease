(function(slicease) {
	var utils = slicease.utils,
		
		timingfunctions = {
			LINEAR: 'linear',
			EASE: 'ease',
			EASE_IN: 'ease-in',
			EASE_OUT: 'ease-out',
			EASE_IN_OUT: 'ease-in-out',
			ELASTIC: 'elastic',
			WAVES_IN: 'waves-in',
			CUBIC_BEZIER: 'cubic-bezier'
		},
		typicpoints = {
			'linear': [0, 0, 1, 1],
			'ease': [0.25, 0.1, 0.25, 1],
			'ease-in': [0.42, 0, 1, 1],
			'ease-out': [0, 0, 0.58, 1],
			'ease-in-out': [0.42, 0, 0.58, 1],
			'elastic': [0.42, 2, 0.58, 2],
			'waves-in': [0.42, 1, 0.58, 1]
		},
		infinite = -1,
		directions = {
			NORMAL: 'normal',
			ALTERNATE: 'alternate'
		};
	
	slicease.animation = function(config) {
		var _this = this,
			_defaults = {
	 			duration: 0,
	 			timingfunction: timingfunctions.EASE,
	 			delay: 0,
	 			iterationcount: 1,
	 			direction: directions.NORMAL,
	 			points: undefined,
	 			factor: .2
			},
			_start,
			_end,
			_points;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_start = [0, 0];
			_end = [1, 1];
			
			var points = [];
			switch (_this.config.timingfunction) {
				case timingfunctions.WAVES_IN:
					_this.config.direction = directions.ALTERNATE;
				case timingfunctions.ELASTIC:
					_end = [1, 0];
				case timingfunctions.LINEAR:
				case timingfunctions.EASE:
				case timingfunctions.EASE_IN:
				case timingfunctions.EASE_OUT:
				case timingfunctions.EASE_IN_OUT:
					points = typicpoints[_this.config.timingfunction];
					break;
				case timingfunctions.CUBIC_BEZIER:
					if (_this.config.points) {
						points = _this.config.points;
					}
					break;
				default:
					break;
			}
			_points = _start.concat(points, _end);
		}
		
		_this.ease = function(time) {
			if (_this.config.duration <= 0) {
				return _points[_points.length - 1];
			}
			
			if (time <= _this.config.delay) {
				return _points[1];
			}
			
			time -= _this.config.delay;
			
			var count = Math.ceil((time ? time : 1) / _this.config.duration);
			
			if (_this.config.iterationcount != infinite && time >= _this.config.iterationcount * _this.config.duration) {
				if (_this.config.direction == directions.ALTERNATE && _this.config.iterationcount % 2 == 1) {
					return _points[_points.length - 1];
				}
				
				return _points[1];
			}
			
			var ms = time % _this.config.duration;
			var ratio = ms / _this.config.duration;
			if (_this.config.direction == directions.ALTERNATE && (count % 2 == 0 || time == _this.config.duration)) {
				ratio = 1 - ratio;
			}
			
			var point = _bezierShrink(_points, ratio);
			if (_this.config.timingfunction == timingfunctions.ELASTIC && count > 2) {
				var n = Math.ceil((count - 2) / 2);
				var f = (1 - _this.config.factor) ^ n;
				point[1] *= f;
			}
			
			return point[1];
		};
		
		function _bezierShrink(points, ratio) {
			if (utils.typeOf(points) != 'array' || points.length < 4) {
				throw 'Failed to shrink bezier points: Bad array!';
				return;
			}
			
			var arr = [];
			for (var i = 0; i < points.length; i++) {
				var x0 = points[i++];
				var y0 = points[i++];
				var x1 = points[i++];
				var y1 = points[i];
				
				arr.push(x0 + (x1 - x0) * ratio);
				arr.push(y0 + (y1 - y0) * ratio);
			}
			
			if (arr.length > 2) {
				arr = _bezierShrink(arr, ratio);
			}
			
			return arr;
		}
		
		_init();
	};
	
	slicease.animation.timingfunctions = timingfunctions;
	slicease.animation.directions = directions;
})(slicease);
