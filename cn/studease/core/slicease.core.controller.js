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
			view.addEventListener(events.SLICEASE_SETUP_ERROR, _onSetupError);
			
			view.addEventListener(events.SLICEASE_VIEW_PLAY, _onPlay);
			view.addEventListener(events.SLICEASE_VIEW_STOP, _onStop);
			view.addEventListener(events.SLICEASE_VIEW_PREV, _onPrev);
			view.addEventListener(events.SLICEASE_VIEW_NEXT, _onNext);
			
			view.addEventListener(events.SLICEASE_RENDER_UPDATE_START, _onUpdateStart);
			view.addEventListener(events.SLICEASE_RENDER_UPDATE_END, _onUpdateEnd);
			view.addEventListener(events.SLICEASE_RENDER_ERROR, _onRenderError);
		}
		
		_this.play = function(index) {
			if (index === undefined) {
				_this.next();
				return;
			}
			
			_index = Math.min(Math.max(index, 0), model.config.sources.length - 1);
			view.render.play(_index);
		};
		
		_this.stop = function() {
			_loader.stop();
			_stopTimer();
			
			model.setState(states.STOPPED);
			view.render.stop();
		};
		
		_this.prev = function() {
			if (_index-- === 0) {
				_index = model.config.sources.length - 1;
			}
			view.render.play(_index);
		};
		
		_this.next = function() {
			if (_index++ === model.config.sources.length - 1) {
				_index = 0;
			}
			view.render.play(_index);
		};
		
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
		
		function _onPlay(e) {
			var state = model.getState();
			if (state !== states.PLAYING) {
				_this.play(e.index);
			}
		}
		
		function _onStop(e) {
			_this.stop();
		}
		
		function _onPrev(e) {
			_this.prev();
		}
		
		function _onNext(e) {
			_this.next();
		}
		
		function _onUpdateStart(e) {
			utils.log('onUpdateStart');
			model.setState(states.PLAYING);
		}
		
		function _onUpdateEnd(e) {
			utils.log('onUpdateEnd');
			model.setState(states.IDLE);
			_startTimer();
		}
		
		function _startTimer() {
			if (!_timer) {
				_timer = new utils.timer(model.config.interval, 1);
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
			_forward(e);
		}
		
		function _onRenderError(e) {
			model.setState(states.ERROR);
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);
