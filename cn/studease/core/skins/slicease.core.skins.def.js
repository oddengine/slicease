﻿(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		skins = slicease.core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'sli-wrapper',
		SKIN_CLASS = 'sli-skin',
		RENDER_CLASS = 'sli-render',
		POSTER_CLASS = 'sli-poster',
		CONTROLS_CLASS = 'sli-controls',
		CONTEXTMENU_CLASS = 'sli-contextmenu',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: _width + 'px',
				height: _height + 'px',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.05)'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': '微软雅黑,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				//border: '1px solid #1184ce',
				//'border-radius': '4px',
				position: CSS_RELATIVE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' canvas', {
				'background-color': '#585862'
			});
		}
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(slicease);
