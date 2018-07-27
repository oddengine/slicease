(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		states = core.states;
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_index = -1,
			_timer;
		
		function _init() {
			model.addEventListener(events.SLICEASE_STATE, _modelStateHandler);
			
			view.addEventListener(events.SLICEASE_READY, _onReady);
			view.addEventListener(events.SLICEASE_STATE, _renderStateHandler);
			view.addEventListener(events.SLICEASE_SETUP_ERROR, _onSetupError);
			view.addEventListener(events.RESIZE, _forward);
			
			view.addEventListener(events.SLICEASE_VIEW_PLAY, _onPlay);
			view.addEventListener(events.SLICEASE_VIEW_STOP, _onStop);
			view.addEventListener(events.SLICEASE_VIEW_PREV, _onPrev);
			view.addEventListener(events.SLICEASE_VIEW_NEXT, _onNext);
			
			view.addEventListener(events.SLICEASE_RENDER_UPDATE_START, _onUpdateStart);
			view.addEventListener(events.SLICEASE_RENDER_UPDATE_END, _onUpdateEnd);
			view.addEventListener(events.SLICEASE_RENDER_ERROR, _onRenderError);
		}
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.IDLE:
				case states.PLAYING:
				case states.STOPPED:
				case states.ERROR:
					_this.dispatchEvent(events.SLICEASE_STATE, { state: e.state, index: _index });
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown model state!', state: e.state });
					break;
			}
		}
		
		function _onReady(e) {
			if (!_ready) {
				_ready = true;
				_forward(e);
				
				_this.play(0);
				
				window.onbeforeunload = function(ev) {
					
				};
			}
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				view.setup();
			}
		};
		
		_this.play = function(index) {
			if (index == undefined) {
				_this.next();
				return;
			}
			
			index = Math.min(Math.max(index, 0), model.getConfig('sources').length - 1);
			var converse = index < _index;
			
			if (view.play(index, converse)) {
				_index = index;
			}
		};
		
		_this.stop = function() {
			_loader.stop();
			_stopTimer();
			
			model.setState(states.STOPPED);
			view.stop();
		};
		
		_this.prev = function() {
			var index = _index - 1;
			if (index < 0) {
				index = model.getConfig('sources').length - 1;
			}
			
			if (view.play(index, true)) {
				_index = index;
			}
		};
		
		_this.next = function() {
			var index = _index + 1;
			if (index > model.getConfig('sources').length - 1) {
				index = 0;
			}
			
			if (view.play(index, false)) {
				_index = index;
			}
		};
		
		
		function _renderStateHandler(e) {
			model.setState(e.state);
			_forward(e);
		}
		
		function _onPlay(e) {
			var state = model.getState();
			if (state != states.PLAYING) {
				_this.play(e.index);
				_forward(e);
			}
		}
		
		function _onStop(e) {
			_this.stop();
			_forward(e);
		}
		
		function _onPrev(e) {
			_this.prev();
			_forward(e);
		}
		
		function _onNext(e) {
			_this.next();
			_forward(e);
		}
		
		function _onUpdateStart(e) {
			//utils.log('onUpdateStart');
			model.setState(states.PLAYING);
		}
		
		function _onUpdateEnd(e) {
			//utils.log('onUpdateEnd');
			model.setState(states.IDLE);
			_startTimer();
		}
		
		function _startTimer() {
			if (!_timer) {
				_timer = new utils.timer(model.getConfig('interval'), 1);
				_timer.addEventListener(events.SLICEASE_TIMER, _onTimer);
			}
			
			_timer.reset();
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) 
				_timer.stop();
		}
		
		function _onTimer(e) {
			_this.next();
		}
		
		function _onSetupError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _onRenderError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);
