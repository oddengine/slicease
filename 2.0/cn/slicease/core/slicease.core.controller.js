(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core;
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher(model.id, model.config.debug)),
			_ready = false,
			_waitingId;
		
		function _init() {
			model.addEventListener(events.SLICEASE_STATE, _modelStateHandler);
			
			view.addEventListener(events.SLICEASE_READY, _onReady);
			view.addEventListener(events.SLICEASE_SETUP_ERROR, _onSetupError);
			view.addEventListener(events.SLICEASE_RENDER_ERROR, _onRenderError);
		}
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.PLAYING:
					if (view.render) {
						view.render.play(e.item);
					}
					if (view.pager) {
						view.pager.setActive(e.item);
					}
					break;
				case states.IDLE:
					_this.wait();
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown state.' });
					break;
			}
		}
		
		function _onReady(e) {
			if (!_ready) {
				_forward(e);
				
				view.addEventListener(events.SLICEASE_STATE, _viewStateHandler);
				
				model.addGlobalListener(_forward);
				view.addGlobalListener(_forward);
				
				_ready = true;
				_this.play();
			}
		}
		
		function _onSetupError(e) {
			_forward(e);
		}
		
		function _onRenderError(e) {
			_forward(e);
		}
		
		function _viewStateHandler(e) {
			model.setState(e.state, e.item);
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.play = function(item) {
			if (item === undefined) {
				return _this.next();
			}
			if (item < 0 || item >= model.sources.length) {
				return false;
			}
			
			_this.interrupt();
			model.setState(states.PLAYING, item);
			return true;
		};
		
		_this.prev = function() {
			var item = model.item - 1;
			return _this.play(item < 0 ? model.sources.length - 1 : item);
		};
		
		_this.next = function() {
			var item = model.item + 1;
			return _this.play(item >= model.sources.length ? 0 : item);
		};
		
		_this.wait = function() {
			_waitingId = setTimeout(function() {
				_this.next();
			}, model.interval);
		};
		_this.interrupt = function() {
			if (_waitingId) clearTimeout(_waitingId);
		};
		
		_this.stop = function() {
			_this.interrupt();
			
		};
		
		_init();
	};
})(slicease);
