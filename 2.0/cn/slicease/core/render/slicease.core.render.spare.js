(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		render = core.render,
		css = utils.css;
	
	render.spare = function(slicer, config) {
		var _render,
			_defaults = {
				visible: true
			},
			_this = utils.extend(this, new events.eventdispatcher());
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
		}
		
		_this.element = function() {
			return _render;
		};
		
        _init();
	};
})(slicease);
