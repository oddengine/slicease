(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		states = core.states,
		components = core.components,
		
		BUTTON_CLASS = 'sli-button',
		
		DISPLAY_CLASS = 'sli-display',
		DISPLAY_ICON_CLASS = 'sli-display-icon',
		DISPLAY_LABEL_CLASS = 'sli-display-label',
		
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.display = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.display')),
			_defaults = {
				id: 'sli-display'
			},
			_container,
			_icon,
			_label,
			_timer;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_container = utils.createElement('div', DISPLAY_CLASS);
			
			_icon = utils.createElement('span', BUTTON_CLASS + ' ' + DISPLAY_ICON_CLASS);
			_container.appendChild(_icon);
			
			_label = utils.createElement('span', DISPLAY_LABEL_CLASS);
			_label.id = _this.config.id;
			_container.appendChild(_label);
		}
		
		_this.show = function(state, message) {
			switch (state) {
				case states.ERROR:
					break;
					
				default:
					break;
			}
			
			css.style(_label, {
				display: message ? CSS_INLINE_BLOCK : CSS_NONE
			});
			
			_label.innerHTML = message;
		};
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			css.style(_icon, {
				top: (height - 48) / 2 + 'px',
				left: (width - 48) / 2 + 'px'
			});
			css.style(_label, {
				'margin-top': (height - 32) / 2 + 'px'
			});
		};
		
		_init();
	};
})(slicease);
