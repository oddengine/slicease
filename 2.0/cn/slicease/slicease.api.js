(function(slicease, undefined) {
	var utils = slicease.utils,
		events = slicease.events;
	
	var _apis = [];
	var _eventMapping = {
		onError: events.SLICEASE_ERROR,
		onSetupError: events.SLICEASE_SETUP_ERROR,
		onReady: events.SLICEASE_READY,
		onResize: events.SLICEASE_RESIZE,
		onRenderMode: events.SLICEASE_RENDER_MODE,
		onState: events.SLICEASE_STATE
	};
	
	slicease.api = function(container) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_slicer;
		
		_this.container = container;
        _this.id = container.id;
        
        utils.foreach(_eventMapping, function(name, type) {
			_this[name] = function(callback) {
				_this.addEventListener(type, callback);
			};
		});
        
		_this.setup = function(options) {
			utils.emptyElement(_this.container);
			
			_this.config = options;
			_this.embedder = new slicease.embed(_this);
			_this.embedder.addEventListener(events.SLICEASE_SETUP_ERROR, _onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		function _onEvent(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.setSlicer = function(slicer, renderMode) {
			_slicer = slicer;
			_this.renderMode = renderMode;
        };
        
        _this.resize = function(width, height) {
        	
        };
		
		return _this;
	};
	
	slicease.api.getSlicer = function(identifier) {
		var _container;
		
		if (identifier == null) {
			identifier = 0;
		} else if (identifier.nodeType) {
			_container = identifier;
		} else if (typeof identifier === 'string') {
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var _slicer = slicease.api.findSlicer(_container.id);
			if (!_slicer) {
				_slicer = new slicease.api(_container);
			}
			return _slicer;
		} else if (typeof identifier === 'number') {
			return _apis[identifier];
		}
		
		return null;
	};
	
	slicease.api.findSlicer = function(id) {
		for (var i = 0; i < _apis.length; i++) {
			if (_apis[i].id === id) {
				return _apis[i];
			}
		}
		return null;
	};
})(window.slicease);
