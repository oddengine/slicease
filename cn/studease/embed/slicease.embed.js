﻿(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	var embed = slicease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = {},
			_embedder = null,
			_errorOccurred = false;
		
		function _init() {
			utils.foreach(api.config.events, function(e, cb) {
				var fn = api[e];
				if (utils.typeOf(fn) === 'function') {
					fn.call(api, cb);
				}
			});
		}
		
		_this.embed = function() {
			try {
				_config = new embed.config(api.config);
				_embedder = new embed.embedder(api, _config);
			} catch (e) {
				utils.log('Failed to init embedder!');
				_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, { message: 'Failed to init embedder!', render: _config.render.name });
				return;
			}
			_embedder.addGlobalListener(_onEvent);
			_embedder.embed();
		};
		
		_this.errorScreen = function(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			slicease.api.displayError(message, _config);
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.SLICEASE_SETUP_ERROR:
				case events.SLICEASE_RENDER_ERROR:
					_this.errorScreen(e.message);
					_this.dispatchEvent(events.ERROR, e);
					break;
				default:
					_forward(e);
					break;
			}
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);
