(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core;
	
    core.slicer = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_model,
			_view,
			_controller;
		
		function _init() {
			_this.id = config.id;
			_this.model = _model = new core.model(config);
			_this.view = _view = new core.view(_this, _model);
			_this.controller = _controller = new core.controller(_model, _view);
			_controller.addGlobalListener(_forward);
			
			_initializeAPI();
			_this.initializeAPI = _initializeAPI;
		}
		
		_this.setup = function() {
			_view.setup();
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		function _initializeAPI() {
			_this.play = _controller.play;
			_this.prev = _controller.prev;
			_this.next = _controller.next;
			_this.runnable = _controller.runnable;
			_this.resize = _view.resize;
			
			_this.destroy = function() {
				if (_controller) {
					_controller.stop();
				}
				if (_view) {
					_view.destroy();
				}
				if (_model) {
					_model.destroy();
				}
			};
		}
		
		_init();
	};
})(slicease);
