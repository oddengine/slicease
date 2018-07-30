(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		components = core.components,
		
		NAV_CLASS = 'sli-nav',
		
		// For all api instances
		CSS_NONE = 'none',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.navigation = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.navigation')),
			_container;
		
		function _init() {
			_this.config = utils.extend({}, config);
			
			_container = utils.createElement('a', NAV_CLASS);
		}
		
		_this.setActive = function(index) {
			var item = _this.config.sources[index];
			
			css.style(_container, {
				display: item.link ? CSS_INLINE_BLOCK : CSS_NONE
			});
			
			_container.setAttribute('href', item.link || '#');
			_container.setAttribute('target', item.target || '_blank');
		};
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(slicease);
