(function(slicease) {
	var utils = slicease.utils,
		skin;
	slicease.skins.default = function() {
		var _this = this,
			_this.type = 'svg',
			_skin,
			_svgAttr = {
				id: 'seskin_default',
				version: '1.1',
				xmlns: 'http://www.w3.org/2000/svg',
				'xmlns:xlink': 'http://www.w3.org/1999/xlink',
				x: '0px',
				y: '0px',
				width: '1024px',
				height: '1024px',
				viewBox: '0 0 1024 1024',
				'enable-background': 'new 0 0 1024 1024',
				'xml:space': 'preserve'
			},
			_paths = [{
				id: 'seskin_prev',
				fill: '#ffffff',
				d: 'M658.29178-191.504117l223.006914 0L398.119373 291.657405 881.298746 812 658.291782 812 175.112507 291.657405 658.29178-191.504117z',
				transform: 'translate(0, 812) scale(1, -1)'
			}, {
				id: 'seskin_next',
				fill: '#ffffff',
				d: 'M881.298746 291.657405 398.119373 812 175.112486 812 658.29178 291.657405 175.112507-191.504117l223.006914 0L881.298746 291.657405z',
				transform: 'translate(0, 812) scale(1, -1)'
			}];
		
		function _init() {
			_skin = document.createElement('svg');
			_addAttr(_skin, _svgAttr);
			
			for (var i = 0; i < _paths.length; i++) {
				var _path = document.createElement('path');
				_addAttr(_path, _paths[i]);
				_skin.appendChild(_path);
			}
		}
		
		function _addAttr(tag, attrs) {
			utils.foreach(attrs, function(key, val) {
				tag.setAttribute(key, val);
			});
		}
		
		_this.element = function() {
			return _skin;
		};
		
		_init();
	};
})(slicease);
