(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	utils.timer = function(delay, repeatCount) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_intervalId,
			_currentCount = 0,
			_running = false;
		
		function _init() {
			utils.extend(_this, {
				delay: delay || 50,
				repeatCount: repeatCount || 0
			});
		}
		
		_this.start = function() {
			if (_running === false) {
				_intervalId = setInterval(_ontimer, _this.delay);
				_running = true;
			}
		};
		
		function _ontimer() {
			_currentCount++;
			_this.dispatchEvent(events.SLICEASE_TIMER);
			
			if (_this.repeatCount > 0 && _this._currentCount >= _this.repeatCount) {
				_this.stop();
				_this.dispatchEvent(events.SLICEASE_TIMER_COMPLETE);
			}
		}
		
		_this.stop = function() {
			if (_running) {
				clearInterval(_intervalId);
				_intervalId = 0;
				_running = false;
			}
		};
		
		_this.reset = function() {
			_this.stop();
			_currentCount = 0;
		};
		
		_this.currentCount = function() {
			return _currentCount;
		};
		
		_this.running = function() {
			return _running;
		};
		
		_init();
	};
})(slicease);
