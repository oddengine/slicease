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
			
			_prev.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_prev"></svg>';
			_next.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_next"></svg>';
			
			_prev.addEventListener('click', slicer.prev);
			_next.addEventListener('click', slicer.next);
			
			_display.appendChild(_prev);
			_display.appendChild(_next);
			
			_display.addEventListener('onmouseover', _onMouseOver);
			_display.addEventListener('onmouseout', _onMouseOut);
			
			css('.' + DISPLAY_PREV_CLASS + ', .' + DISPLAY_NEXT_CLASS, {
				width: _this.config.btnStyle.width,
				height: _this.config.btnStyle.height
			});
			
			css('.' + DISPLAY_PREV_CLASS + ' svg, .' + DISPLAY_NEXT_CLASS + ' svg', {
				width: '100%',
				height: _this.config.btnStyle.width
			});
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
	
	css('.' + DISPLAY_CONTAINER_CLASS, {
		width: '100%',
		height: '100%',
		filter: 'Alpha(opacity=0)',
		opacity: 0
	});
	
	css('.' + DISPLAY_CONTAINER_CLASS + ':hover', {
		filter: 'Alpha(opacity=100)',
		opacity: 1
	});
	
	css('.' + DISPLAY_PREV_CLASS + ', .' + DISPLAY_NEXT_CLASS, {
		width: '40px',
		height: '100%',
		position: 'relative',
		cursor: 'pointer',
		filter: 'Alpha(opacity=30)',
		opacity: 0.3
	});
	
	css('.' + DISPLAY_PREV_CLASS, {
		'float': 'left'
	});
	css('.' + DISPLAY_NEXT_CLASS, {
		'float': 'right'
	});
	
	css('.' + DISPLAY_PREV_CLASS + ':hover, .' + DISPLAY_NEXT_CLASS + ':hover', {
		filter: 'Alpha(opacity=60)',
		opacity: 0.6
	});
	
	css('.' + DISPLAY_PREV_CLASS + ' svg, .' + DISPLAY_NEXT_CLASS + ' svg', {
		'margin-top': '-20px',
		width: '100%',
		height: '40px',
		position: 'absolute',
		top: '50%'
	});
	
	css('.' + DISPLAY_PREV_CLASS + ':hover svg, .' + DISPLAY_NEXT_CLASS + ':hover svg', {
		fill: '#0f0'
	});
})(slicease);
