(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		components = core.components,
		css = utils.css,
		
		PAGER_CONTAINER_CLASS = 'sepager',
		
		PAGER_HIDE_DELAY = 2000,
		
		HIDDEN = {
			display: 'none'
		},
		SHOWING = {
			display: 'block'
		},
		NOT_HIDDEN = {
			display: ''
		};
	
	components.pager = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_pager,
			_defaults = {
				btnStyle: {
					width: '40px',
				 	height: '100%'
				},
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_pager = utils.createElement('div', PAGER_CONTAINER_CLASS);
			_pager.id = slicer.id + '_pager';
			
			var pagesContainer = utils.createElement('span');
				pages = slicer.model.sources.length;
			for (var i = 0; i < pages; i++) {
				var a = utils.createElement('a');
				a.innerHTML = i + 1;
				a.addEventListener('click', (function(n) {
					return function(e) {
						_this.dispatchEvent(events.SLICEASE_STATE, { state: states.PLAYING, item: n });
					};
				})(i));
				pagesContainer.appendChild(a);
			}
			_pager.appendChild(pagesContainer);
		}
		
		_this.setActive = function(index) {
			
		};
		
		_this.hide = function(immediate) {
			setTimeout(_hide, immediate ? 0 : PAGER_HIDE_DELAY);
		};
		function _hide() {
			css.style(_this.element(), HIDDEN);
		}
		
		_this.show = function() {
			css.style(_this.element(), SHOWING);
		};
		
		_this.element = function() {
			return _pager;
		};
		
		_this.destroy = function() {
			
		};
		
        _init();
	};
	
	
})(slicease);
