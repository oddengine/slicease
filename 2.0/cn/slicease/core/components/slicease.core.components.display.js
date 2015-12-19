(function(slicease) {
	var utils = slicease.utils,
	events = slicease.events,
		core = slicease.core,
		components = core.components,
		css = utils.css,
		
		DISPLAY_CONTAINER_CLASS = 'sedisplay',
		DISPLAY_PREV_CLASS = 'seprev',
		DISPLAY_NEXT_CLASS = 'senext',
		
		DISPLAY_HIDE_DELAY = 2000,
		
		HIDDEN = {
			display: 'none'
		},
		SHOWING = {
			display: 'block'
		},
		NOT_HIDDEN = {
			display: ''
		};
	
	components.display = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_display,
			_prev,
			_next,
			_defaults = {
				btnStyle: {
					width: '40px',
				 	height: '100%'
				},
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_display = utils.createElement('div', DISPLAY_CONTAINER_CLASS);
			_display.id = slicer.id + '_display';
			
			_prev = utils.createElement('div', DISPLAY_PREV_CLASS);
			_next = utils.createElement('div', DISPLAY_NEXT_CLASS);
			
			switch (slicer.skin.type) {
				case 'svg':
					_prev.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_prev"></svg>';
					_next.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_next"></svg>';
					break;
				default:
					break;
			}
			
			_display.appendChild(_prev);
			_display.appendChild(_next);
			
			_display.addEventListener('onmouseover', _onMouseOver);
			_display.addEventListener('onmouseout', _onMouseOut);
		}
		
		function _onMouseOver(e) {
			slicer.runnable(false);
		}
		
		function _onMouseOut(e) {
			slicer.runnable(true);
		}
		
		_this.hide = function(immediate) {
			setTimeout(_hide, immediate ? 0 : DISPLAY_HIDE_DELAY);
		};
		function _hide() {
			css.style(_this.element(), HIDDEN);
		}
		
		_this.show = function() {
			css.style(_this.element(), SHOWING);
		};
		
		_this.element = function() {
			return _display;
		};
		
		_this.destroy = function() {
			if (_display) {
				_display.removeEventListener('onmouseover', _onMouseOver);
				_display.removeEventListener('onmouseout', _onMouseOut);
			}
		};
		
        _init();
	};
	
	
})(slicease);
