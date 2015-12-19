(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	renders.spare = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_spare,
			_defaults = {
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			
		}
		
		_this.element = function() {
			return _spare;
		};
		
		_init();
	};
})(slicease);
