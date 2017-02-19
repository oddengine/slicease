(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	utils.imageloader = function() {
		var _this = utils.extend(this, new events.eventdispatcher('utils.imageloader')),
			_loading,
			_image;
		
		function _init() {
			_loading = false;
		}
		
		_this.load = function(url) {
			_image = new Image();
			_image.onload = _onload;
			_image.onabort = _onerror;
			_image.onerror = _onerror;
			
			_loading = true;
			
			_image.src = url;
		};
		
		function _onload(e) {
			var img = e.target;
			_loading = false;
			_this.dispatchEvent(events.SLICEASE_COMPLETE, { data: img, src: img.src });
		}
		
		function _onerror(e) {
			var img = e.target;
			_loading = false;
			_this.dispatchEvent(events.ERROR, { message: 'Failed to load image ' + img.src + '.', src: img.src });
		}
		
		_this.stop = function() {
			if (_loading) {
				_image.onload = _image.onabort = _image.onerror = null;
				_image = null;
			}
			
			_loading = false;
		};
		
		_this.loading = function() {
			return _loading;
		};
		
		_init();
	};
})(slicease);
