(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode;
	
	var embed = slicease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_config = new embed.config(api.config),
			_width = _config.width,
			_height = _config.height,
			_errorOccurred = false,
			_embedder = null;
		_config.id = api.id;
		
		utils.foreach(_config.events, function(e, cb) {
			var fn = api[e];
			if (typeof fn === 'function') {
				fn.call(api, cb);
			}
		});
		
		_this.embed = function() {
			api.container.style.width = _width.toString().indexOf('%') > 0 ? _width : (_width + 'px');
			api.container.style.height = _height.toString().indexOf('%') > 0 ? _height : (_height + 'px');
			
			try {
				_embedder = new embed[_config.renderMode](api, _config);
			} catch (e) {
				utils.log('Render not found');
			}
			
			if (!_embedder || !_embedder.supports()) {
				if (_config.fallback) {
					_config.renderMode = _config.renderMode = renderMode.SPARE;
					_embedder = new embed.spare(api, _config);
				} else {
					_errorScreen('No suitable render found.');
					return;
				}
			}
			
			_embedder.addGlobalListener(_onEvent);
			_embedder.embed();
			_insertCSS();
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.SLICEASE_SETUP_ERROR:
				case events.SLICEASE_RENDER_ERROR:
					_errorScreen(e.message);
					break;
				default:
					break;
			}
			_forward(e);
		}
		
		function _errorScreen(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			_displayError(api.container, message, _config);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.errorScreen = _errorScreen;
		
		return _this;
	};
	
	function _insertCSS() {
		utils.css('object.jwswf, .jwplayer:focus', {
			outline: 'none'
		});
		utils.css('.jw-tab-focus:focus', {
			outline: 'solid 2px #0B7EF4'
		});
	}
	
	function _displayError(container, message, config) {
		var style = container.style;
		style.backgroundColor = '#000';
		style.color = '#FFF';
		style.width = utils.styleDimension(config.width);
		style.height = utils.styleDimension(config.height);
		style.display = 'table';
		style.opacity = 1;
		
		var text = document.createElement('p'),
			textStyle = text.style;
		textStyle.verticalAlign = 'middle';
		textStyle.textAlign = 'center';
		textStyle.display = 'table-cell';
		textStyle.font = '15px/20px Arial, Helvetica, sans-serif';
		text.innerHTML = message.replace(':', ':<br>');
		
		container.innerHTML = '';
		container.appendChild(text);
	}
	
	embed.errorScreen = _displayError;
})(slicease);
