(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		component = core.component,
		css = utils.css,
		
		PAGER_CONTAINER_CLASS = 'sedisplay';
	
	component.pager = function(slicer, config) {
		var _this = this,
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
			
			var i = 0, pages = slicer.model.sources.length;
			for (; i < pages; i++) {
				var a = utils.createElement('a');
				a.innerText = i + 1;
				a.addEventListener('click', (function(n) {
					return function(e) {
						slicer.play(n);
					};
				})(i);
				_pager.appendChild(a);
			}
		}
		
		_this.element = function() {
			return _pager;
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
