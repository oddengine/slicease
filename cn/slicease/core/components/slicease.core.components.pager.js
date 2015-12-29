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
			_span,
			_defaults = {
				btnStyle: {
					width: '24px',
				 	height: '24px',
					'font-size': '14px',
					'font-weight': 'bold',
					color: '#25292c',
					background: '#999'
				},
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_pager = utils.createElement('div', PAGER_CONTAINER_CLASS);
			_pager.id = slicer.id + '_pager';
			
			_span = utils.createElement('span');
			var pages = slicer.model.sources.length;
			for (var i = 0; i < pages; i++) {
				var a = utils.createElement('a');
				a.innerHTML = i + 1;
				a.addEventListener('click', (function(n) {
					return function(e) {
						_this.dispatchEvent(events.SLICEASE_STATE, { state: states.PLAYING, item: n });
					};
				})(i));
				_span.appendChild(a);
			}
			_pager.appendChild(_span);
			
			css('.' + PAGER_CONTAINER_CLASS, {
				height: _this.config.btnStyle.height
			});
			
			css('.' + PAGER_CONTAINER_CLASS + ' a', {
				width: _this.config.btnStyle.width,
				height: _this.config.btnStyle.height,
				'border-radius': _this.config.btnStyle.width / 2 + 'px',
				'line-height': _this.config.btnStyle.height,
				'font-size': _this.config.btnStyle['font-size'],
				'font-weight': _this.config.btnStyle['font-weight'],
				color: _this.config.btnStyle.color,
				background: _this.config.btnStyle.background
			});
		}
		
		_this.setActive = function(item) {
			if (_span === undefined || _span === null) {
				return;
			}
			if (item < 0 || item >= _span.childNodes.length) {
				return;
			}
			
			for (var i = 0; i < _span.childNodes.length; i++) {
				_span.childNodes[i].className = (i === item ? 'active' : '');
			}
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
	
	css('.' + PAGER_CONTAINER_CLASS, {
		width: '100%',
		height: '24px',
		position: 'absolute',
		bottom: '-47px'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' span', {
		height: '100%',
		'text-align': 'center'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' a', {
		'margin-left': '10px',
		width: '24px',
		height: '24px',
		'border-radius': '12px',
		display: 'inline-block',
		'line-height': '24px',
		'font-size': '14px',
		'font-weight': 'bold',
		color: '#25292c',
		cursor: 'pointer',
		overflow: 'hidden',
		background: '#999'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' a:hover, .' + PAGER_CONTAINER_CLASS + ' a.active', {
		background: '#ccc'
	});
})(slicease);
