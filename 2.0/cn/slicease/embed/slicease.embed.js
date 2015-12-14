(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode;
	
	var embed = slicease.embed = function(api) {
		var _this = this,
			_config = new embed.config(api.config),
			_width = _config.width,
			_height = _config.height,
			_errorOccurred = false,
			_errorText = 'Error embedding slicer: ',
			_render = null;
		
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
				_render = new embed[_config.renderMode]();
			} catch (e) {
				utils.log('Render not found');
			}
			
			if (!_render || !_render.supports()) {
				if (_config.fallback) {
					_render = new embed.spare();
				} else {
					_errorScreen(_errorText + 'No suitable render found');
					return;
				}
			}
			
			_render.addEventListener(events.SLICEASE_SETUP_ERROR, _onSetupError);
			_render.embed();
			_insertCSS();
        };
		
		function _onSetupError(e) {
			_errorScreen(_errorText + e.message);
		}
		
		function _errorScreen(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			_displayError(api.container, message, _config);
			_dispatchSetupError(message);
		}
		
		function _dispatchSetupError(message) {
			_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, {
				message: message
			});
			utils.log(message);
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
