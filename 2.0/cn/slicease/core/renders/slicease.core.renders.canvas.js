(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	renders.canvas = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_canvas,
			_defaults = {
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_canvas = utils.createElement('canvas');
			_canvas.style.width = slicer.model.width;
			_canvas.style.height = slicer.model.height;
			_canvas.innerText = 'Canvas not supported!';
		}
		
		_this.play = function(item) {
			if (item === undefined) {
				return false;
			}
			
			
		};
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
