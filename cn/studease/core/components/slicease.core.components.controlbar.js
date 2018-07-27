(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		components = core.components,
		
		PAGES_CLASS = 'sli-pages',
		CONTROL_CLASS = 'sli-control',
		SELECTED_CLASS = 'selected',
		PREV_CLASS = 'prev',
		NEXT_CLASS = 'next',
		
		BUTTON_CLASS = 'sli-button',
		
		// For all api instances
		CSS_BLOCK = 'block';
	
	components.controlbar = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.controlbar')),
			_defaults = {},
			_pages,
			_prev,
			_next;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_buildLayout();
		}
		
		function _buildLayout() {
			_pages = utils.createElement('div', PAGES_CLASS);
			
			for (var i = 0; i < config.pages; i++) {
				var element = utils.createElement('span', BUTTON_CLASS);
				element.setAttribute('index', i);
				element.innerHTML = '<a></a>';
				element.addEventListener('click', _onPageClick);
				
				_pages.appendChild(element);
			}
			
			_prev = utils.createElement('div', CONTROL_CLASS + ' ' + BUTTON_CLASS + ' ' + PREV_CLASS);
			_prev.innerHTML = '<span></span>';
			_prev.addEventListener('click', function(e) {
				_this.dispatchEvent(events.SLICEASE_VIEW_PREV);
			});
			
			_next = utils.createElement('div', CONTROL_CLASS + ' ' + BUTTON_CLASS + ' ' + NEXT_CLASS);
			_next.innerHTML = '<span></span>';
			_next.addEventListener('click', function(e) {
				_this.dispatchEvent(events.SLICEASE_VIEW_NEXT);
			});
			
			layer.appendChild(_pages);
			layer.appendChild(_prev);
			layer.appendChild(_next);
		}
		
		function _onPageClick(e) {
			var index = e.currentTarget.getAttribute('index');
			_this.dispatchEvent(events.SLICEASE_VIEW_PLAY, { index: index });
		}
		
		_this.setActive = function(index) {
			for (var i = 0; i < _pages.childNodes.length; i++) {
				var element = _pages.childNodes[i];
				if (i == index) {
					utils.addClass(element, SELECTED_CLASS);
				} else {
					utils.removeClass(element, SELECTED_CLASS);
				}
			}
		};
		
		_this.resize = function(width, height) {
			css.style(_pages, {
				left: ((width - (_pages.childNodes.length * 33 - 8)) / 2) + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);
