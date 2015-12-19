(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		component = core.component,
		css = utils.css,
		
		DISPLAY_CONTAINER_CLASS = 'sedisplay',
		DISPLAY_PREV_CLASS = 'seprev',
		DISPLAY_NEXT_CLASS = 'senext';
	
	component.display = function(slicer, config) {
		var _this = this,
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
		
		_this.element = function() {
			return _display;
		};
		
        _init();
	};
	
	css(D_CLASS, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });

    _css(D_CLASS + ' ' + D_PREVIEW_CLASS, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: '#000 no-repeat center',
        overflow:'hidden',
        opacity: 0
    });
})(slicease);
