(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		renders = core.renders;
	
	renders.imageloader = function(url, onload, onerror) {
		var _this = this,
			_img,
			_loading = false,
			_error = false;
		
		function _init() {
			_img = new Image();
			_img.onload = function() {
				_loading = false;
				if (onload  && typeof onload === 'function') {
					onload();
				}
			};
			_img.onerror = function() {
				_loading = false;
				_error = true;
				if (onerror && typeof onerror === 'function') {
					onerror();
				}
			};
			
			_loading = true;
			_img.src = url;
		}
		
		_this.loading = function() {
			return _loading;
		};
		
		_this.error = function() {
			return _error;
		};
		
		_this.element = function() {
			return _img;
		};
		
		_init();
	};
})(slicease);
