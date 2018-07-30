slicease = function() {
	if (slicease.api) {
		return slicease.api.getInstance.apply(this, arguments);
	}
};

slicease.version = '3.0.08';

(function(slicease) {
	var utils = slicease.utils = {};
	
	utils.exists = function(item) {
		switch (utils.typeOf(item)) {
			case 'string':
				return (item.length > 0);
			case 'object':
				return (item !== null);
			case 'null':
				return false;
		}
		return true;
	};
	
	utils.extend = function() {
		var args = Array.prototype.slice.call(arguments, 0),
			obj = args[0];
		if (args.length > 1) {
			for (var i = 1; i < args.length; i++) {
				utils.foreach(args[i], function(key, val) {
					if (val !== undefined && val !== null) {
						obj[key] = val;
					}
				});
			}
		}
		return obj;
	};
	
	utils.foreach = function(data, fn) {
		for (var key in data) {
			if (data.hasOwnProperty && utils.typeOf(data.hasOwnProperty) === 'function') {
				if (data.hasOwnProperty(key)) {
					fn(key, data[key]);
				}
			} else {
				// IE8 has a problem looping through XML nodes
				fn(key, data[key]);
			}
		}
	};
	
	utils.getCookie = function(key) {
		var arr, reg=new RegExp('(^| )' + key + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		return null;
	};
	
	utils.formatTime = function(date) {
		var hours = date.getHours() + 1;
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		return date.toLocaleDateString() + ' ' + utils.pad(hours, 2) + ':' + utils.pad(minutes, 2) + ':' + utils.pad(seconds, 2);
	};
	
	utils.pad = function(val, len) {
		var str = val + '';
		while (str.length < len) {
			str = '0' + str;
		}
		
		return str;
	};
	
	utils.typeOf = function(value) {
		if (value === null || value === undefined) {
			return 'null';
		}
		
		var typeofString = typeof value;
		if (typeofString === 'object') {
			try {
				var str = Object.prototype.toString.call(value);
				var arr = str.match(/^\[object ([a-z]+)\]$/i);
				if (arr && arr.length > 1 && arr[1]) {
					return arr[1].toLowerCase();
				}
			} catch (err) {
				/* void */
			}
		}
		
		return typeofString;
	};
	
	utils.isInt = function(value) {
		return parseFloat(value) % 1 === 0;
	};
	
	utils.trim = function(inputString) {
		return inputString.replace(/^\s+|\s+$/g, '');
	};
	
	utils.indexOf = function(array, item) {
		if (array == null) {
			return -1;
		}
		
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		
		return -1;
	};
	
	
	/* DOM */
	utils.createElement = function(elem, className) {
		var newElement = document.createElement(elem);
		if (className) {
			newElement.className = className;
		}
		return newElement;
	};
	
	utils.addClass = function(element, classes) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var addClasses = utils.typeOf(classes) === 'array' ? classes : classes.split(' ');
		
		utils.foreach(addClasses, function(n, c) {
			if (utils.indexOf(originalClasses, c) === -1) {
				originalClasses.push(c);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.hasClass = function(element, classes) {
		var originalClasses = element.className || '';
		var hasClasses = utils.typeOf(classes) === 'array' ? classes : classes.split(' ');
		
		for (var i = 0; i < hasClasses.length; i++) {
			var re = new RegExp('\\b' + hasClasses[i] + '\\b', 'i');
			if (originalClasses.search(re) == -1) {
				return false;
			}
		}
		
		return true;
	};
	
	utils.removeClass = function(element, classes) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var removeClasses = utils.typeOf(classes) === 'array' ? classes : classes.split(' ');
		
		utils.foreach(removeClasses, function(n, c) {
			var index = utils.indexOf(originalClasses, c);
			if (index >= 0) {
				originalClasses.splice(index, 1);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.emptyElement = function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	};
	
	
	/* Browser */
	utils.isMSIE = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('MSIE\\s*' + version, 'i'));
	};
	
	utils.isIETrident = function() {
		return _userAgentMatch(/trident\/.+rv:\s*11/i);
	};
	
	utils.isEdge = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\sEdge\\/' + version, 'i'));
	};
	
	utils.isMac = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\sMac OS X ' + version, 'i'));
	};
	
	utils.isSafari = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\sSafari\\/' + version, 'i'))
				&& !_userAgentMatch(/Chrome/i) && !_userAgentMatch(/Chromium/i) && !_userAgentMatch(/Android/i);
	};
	
	utils.isIOS = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('iP(hone|ad|od).+\\sOS\\s' + version, 'i'));
	};
	
	utils.isAndroid = function(version, excludeChrome) {
		//Android Browser appears to include a user-agent string for Chrome/18
		if (excludeChrome && _userAgentMatch(/Chrome\/[123456789]/i) && !_userAgentMatch(/Chrome\/18/)) {
			return false;
		}
		
		version = version || '';
		return _userAgentMatch(new RegExp('Android\\s*' + version, 'i'));
	};
	
	utils.isMobile = function() {
		return utils.isIOS() || utils.isAndroid();
	};
	
	utils.isFirefox = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('Firefox\\/' + version, 'i'));
	};
	
	utils.isChrome = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\s(?:Chrome|CriOS)\\/' + version, 'i')) && !utils.isEdge();
	};
	
	utils.isSogou = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('MetaSr\\s' + version, 'i'));
	};
	
	utils.isWeixin = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('MicroMessenger\\/' + version, 'i'));
	};
	
	utils.isQQBrowser = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('QQBrowser\\/' + version, 'i'));
	};
	
	function _userAgentMatch(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	};
	
	utils.isHorizontal = function() {
		if (window.orientation != undefined) {
			return (window.orientation == 90 || window.orientation == -90);
		} else {
			return window.innerWidth > window.innerHeight;
		}
	};
	
	utils.getFlashVersion = function() {
		if (utils.isAndroid()) {
			return 0;
		}
		
		var plugins = navigator.plugins, flash;
		if (plugins) {
			flash = plugins['Shockwave Flash'];
			if (flash && flash.description) {
				var version = flash.description.replace(/\D+(\d+\.?\d*).*/, '$1');
				return parseFloat(version);
			}
		}
		
		if (typeof window.ActiveXObject !== 'undefined') {
			try {
				flash = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (flash) {
					var version = flash.GetVariable('$version').split(' ')[1].replace(/\s*,\s*/, '.')
					return parseFloat(version);
				}
			} catch (err) {
				return 0;
			}
			
			return flash;
		}
		
		return 0;
	};
	
	
	/* protocol & extension */
	utils.getProtocol = function(url) {
		var protocol = 'http';
		
		var arr = url.match(/^([a-z]+)\:\/\//i);
		if (arr && arr.length > 1) {
			protocol = arr[1];
		}
		
		return protocol;
	};
	
	utils.getOrigin = function(file) {
		var origin = '';
		
		var arr = file.match(/^[a-z]+\:\/\/([a-z0-9\-.:])\//i);
		if (arr && arr.length > 1) {
			origin = arr[1];
		}
		
		return origin;
	};
	
	utils.getFileName = function(file) {
		var name = '';
		
		var arr = file.match(/\/([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.[a-z0-9]+)?)$/i);
		if (arr && arr.length > 1) {
			name = arr[1];
		}
		
		return name;
	};
	
	utils.getExtension = function(file) {
		var extension = '';
		
		var arr = file.match(/\/?([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.([a-z0-9]+))*)\??([a-z0-9\.\-_%&=]*)$/i);
		if (arr && arr.length > 3) {
			extension = arr[3];
		}
		
		return extension;
	};
	
	
	/* Logger */
	var console = window.console = window.console || {
		log: function() {}
	};
	
	utils.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (utils.typeOf(console.log) === 'object') {
			console.log(args);
		} else {
			console.log.apply(console, args);
		}
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		sheet;
	
	function createStylesheet() {
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
		return styleSheet.sheet || styleSheet.styleSheet;
	}
	
	var css = utils.css = function(selector, styles) {
		if (!sheet) {
			sheet = createStylesheet();
		}
		
		var _styles = '';
		utils.foreach(styles, function(style, value) {
			_styles += style + ': ' + value + '; ';
		});
		
		try {
			if (sheet.insertRule) 
				sheet.insertRule(selector + ' { ' + _styles + '}', sheet.cssRules.length);
			else 
				sheet.addRule(selector, _styles, sheet.rules.length);
		} catch (e) {
			utils.log('Failed to insert css rule: ' + selector);
		}
	};
	
	css.style = function(elements, styles, immediate) {
		if (elements === undefined || elements === null) {
			return;
		}
		if (elements.length === undefined) {
			elements = [elements];
		}
		
		var rules = utils.extend({}, styles);
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element === undefined || element === null) {
				continue;
			}
			
			utils.foreach(rules, function(style, value) {
				var name = _getStyleName(style);
				if (element.style[name] !== value) {
					element.style[name] = value;
				}
			});
		}
	};
	
	function _getStyleName(name) {
		name = name.split('-');
		for (var i = 1; i < name.length; i++) {
			name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
		}
		return name.join('');
	}
})(slicease);

(function(slicease) {
	slicease.events = {
		// General Events
		ERROR: 'error',
		RESIZE: 'resize',
		
		// API Events
		SLICEASE_READY: 'sliceaseReady',
		SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		SLICEASE_RENDER_ERROR: 'sliceaseRenderError',
		
		SLICEASE_STATE: 'sliceaseState',
		
		SLICEASE_RENDER_UPDATE_START: 'sliceaseRenderUpdateStart',
		SLICEASE_RENDER_UPDATE_END: 'sliceaseRenderUpdateEnd',
		
		// View Events
		SLICEASE_VIEW_PLAY: 'sliceaseViewPlay',
		SLICEASE_VIEW_STOP: 'sliceaseViewStop',
		SLICEASE_VIEW_PREV: 'sliceaseViewPrev',
		SLICEASE_VIEW_NEXT: 'sliceaseViewNext',
		
		// Loader Events
		SLICEASE_PROGRESS: 'sliceaseProgress',
		SLICEASE_COMPLETE: 'sliceaseComplete',
		
		// Timer Events
		SLICEASE_TIMER: 'sliceaseTimer',
		SLICEASE_TIMER_COMPLETE: 'sliceaseTimerComplete'
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	events.eventdispatcher = function(id) {
		var _id = id,
			_listeners = {},
			_globallisteners = [];
		
		this.addEventListener = function(type, listener, count) {
			try {
				if (!utils.exists(_listeners[type])) {
					_listeners[type] = [];
				}
				
				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_listeners[type].push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeEventListener = function(type, listener) {
			if (!_listeners[type]) {
				return;
			}
			try {
				if (listener === undefined) {
					_listeners[type] = [];
					return;
				}
				var i;
				for (i = 0; i < _listeners[type].length; i++) {
					if (_listeners[type][i].listener.toString() === listener.toString()) {
						_listeners[type].splice(i, 1);
						break;
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.hasEventListener = function(type) {
			return _listeners.hasOwnProperty(type);
		};
		
		this.addGlobalListener = function(listener, count) {
			try {
 				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_globallisteners.push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeGlobalListener = function(listener) {
			if (!listener) {
				return;
			}
			try {
				var i;
				for (i = _globallisteners.length - 1; i >= 0; i--) {
					if (_globallisteners[i].listener.toString() === listener.toString()) {
						_globallisteners.splice(i, 1);
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		
		this.dispatchEvent = function(type, data) {
			if (!data) {
				data = {};
			}
			utils.extend(data, {
				id: _id,
				type: type,
				target: this,
				version: slicease.version
			});
			if (slicease.debug) {
				utils.log(type, data);
			}
			_dispatchEvent(_listeners[type], data, type);
			_dispatchEvent(_globallisteners, data, type);
		};
		
		function _dispatchEvent(listeners, data, type) {
			if (!listeners) {
				return;
			}
			for (var index = 0; index < listeners.length; index++) {
				var listener = listeners[index];
				if (listener) {
					if (listener.count !== null && --listener.count === 0) {
						delete listeners[index];
					}
					try {
						listener.listener(data);
					} catch (err) {
						utils.log('Error handling "' + type +
							'" event listener [' + index + ']: ' + err.toString(), listener.listener, data);
					}
				}
			}
		}
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	utils.imageloader = function() {
		var _this = utils.extend(this, new events.eventdispatcher('utils.imageloader')),
			_loading,
			_image;
		
		function _init() {
			_loading = false;
		}
		
		_this.load = function(url) {
			_image = new Image();
			_image.onload = _onload;
			_image.onabort = _onerror;
			_image.onerror = _onerror;
			
			_loading = true;
			
			_image.src = url;
		};
		
		function _onload(e) {
			var img = e.target;
			_loading = false;
			_this.dispatchEvent(events.SLICEASE_COMPLETE, { data: img, src: img.src });
		}
		
		function _onerror(e) {
			var img = e.target;
			_loading = false;
			_this.dispatchEvent(events.ERROR, { message: 'Failed to load image ' + img.src + '.', src: img.src });
		}
		
		_this.stop = function() {
			if (_loading) {
				_image.onload = _image.onabort = _image.onerror = null;
				_image = null;
			}
			
			_loading = false;
		};
		
		_this.loading = function() {
			return _loading;
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	utils.timer = function(delay, repeatCount) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.timer')),
			_intervalId,
			_currentCount = 0,
			_running = false;
		
		function _init() {
			_this.delay = delay || 50;
			_this.repeatCount = repeatCount || 0;
		}
		
		_this.start = function() {
			if (_running === false) {
				_intervalId = setInterval(_onTimer, _this.delay);
				_running = true;
			}
		};
		
		function _onTimer() {
			_currentCount++;
			_this.dispatchEvent(events.SLICEASE_TIMER);
			
			if (_this.repeatCount > 0 && _currentCount >= _this.repeatCount) {
				_this.stop();
				_this.dispatchEvent(events.SLICEASE_TIMER_COMPLETE);
			}
		}
		
		_this.stop = function() {
			if (_running) {
				clearInterval(_intervalId);
				_intervalId = 0;
				_running = false;
			}
		};
		
		_this.reset = function() {
			_this.stop();
			_currentCount = 0;
		};
		
		_this.currentCount = function() {
			return _currentCount;
		};
		
		_this.running = function() {
			return _running;
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	var _insts = {},
		_eventMapping = {
			onError: events.ERROR,
			onReady: events.SLICEASE_READY,
			onState: events.SLICEASE_STATE,
			onResize: events.SLICEASE_RESIZE
		};
	
	slicease.api = function(container) {
		var _this = utils.extend(this, new events.eventdispatcher('api')),
			_entity;
		
		_this.container = container;
		_this.id = container.id;
		
		function _init() {
			utils.foreach(_eventMapping, function(name, type) {
				_this[name] = function(callback) {
					_this.addEventListener(type, callback);
				};
			});
		}
		
		_this.setup = function(options) {
			utils.emptyElement(_this.container);
			
			slicease.debug = !!options.debug;
			
			_this.config = options;
			_this.config.id = _this.id;
			
			_this.embedder = new slicease.embed(_this);
			_this.embedder.addGlobalListener(_onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		_this.setEntity = function(entity) {
			_entity = entity;
			
			_this.play = _entity.play;
			_this.stop = _entity.stop;
			_this.prev = _entity.prev;
			_this.next = _entity.next;
			
			_this.getState = _entity.getState;
			
			_this.resize = _entity.resize;
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
	
	slicease.api.getInstance = function(identifier) {
		var _container;
		
		if (identifier == null) {
			identifier = 0;
		} else if (identifier.nodeType) {
			_container = identifier;
		} else if (utils.typeOf(identifier) === 'string') {
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var inst = _insts[_container.id];
			if (!inst) {
				_insts[identifier] = inst = new slicease.api(_container);
			}
			return inst;
		} else if (utils.typeOf(identifier) === 'number') {
			return _insts[identifier];
		}
		
		return null;
	};
	
	slicease.api.displayError = function(message, config) {
		
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		
		timingfunctions = {
			LINEAR: 'linear',
			EASE: 'ease',
			EASE_IN: 'ease-in',
			EASE_OUT: 'ease-out',
			EASE_IN_OUT: 'ease-in-out',
			ELASTIC: 'elastic',
			WAVES_IN: 'waves-in',
			CUBIC_BEZIER: 'cubic-bezier'
		},
		typicpoints = {
			'linear': [0, 0, 1, 1],
			'ease': [0.25, 0.1, 0.25, 1],
			'ease-in': [0.42, 0, 1, 1],
			'ease-out': [0, 0, 0.58, 1],
			'ease-in-out': [0.42, 0, 0.58, 1],
			'elastic': [0.42, 2, 0.58, 2],
			'waves-in': [0.42, 1, 0.58, 1]
		},
		infinite = -1,
		directions = {
			NORMAL: 'normal',
			ALTERNATE: 'alternate'
		};
	
	slicease.animation = function(config) {
		var _this = this,
			_defaults = {
	 			duration: 0,
	 			timingfunction: timingfunctions.EASE,
	 			delay: 0,
	 			iterationcount: 1,
	 			direction: directions.NORMAL,
	 			points: undefined,
	 			factor: 0
			},
			_start,
			_end,
			_points;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_start = [0, 0];
			_end = [1, 1];
			
			var points = [];
			switch (_this.config.timingfunction) {
				case timingfunctions.WAVES_IN:
					_this.config.direction = directions.ALTERNATE;
				case timingfunctions.ELASTIC:
					_end = [1, 0];
				case timingfunctions.LINEAR:
				case timingfunctions.EASE:
				case timingfunctions.EASE_IN:
				case timingfunctions.EASE_OUT:
				case timingfunctions.EASE_IN_OUT:
					points = typicpoints[_this.config.timingfunction];
					break;
				case timingfunctions.CUBIC_BEZIER:
					if (_this.config.points) {
						points = _this.config.points;
					}
					break;
				default:
					break;
			}
			_points = _start.concat(points, _end);
		}
		
		_this.animate = function(time) {
			if (_this.config.duration <= 0) {
				return _points[_points.length - 1];
			}
			
			if (time <= _this.config.delay) {
				return _points[1];
			}
			
			time -= _this.config.delay;
			
			var count = Math.ceil((time ? time : 1) / _this.config.duration);
			
			if (_this.config.iterationcount != infinite && time >= _this.config.iterationcount * _this.config.duration) {
				if (_this.config.direction == directions.ALTERNATE && _this.config.iterationcount % 2 == 0) {
					return _points[1];
				}
				
				return _points[_points.length - 1];
			}
			
			var ms = time % _this.config.duration;
			var ratio = ms / _this.config.duration;
			if (_this.config.direction == directions.ALTERNATE && (count % 2 == 0 || time == _this.config.duration)) {
				ratio = 1 - ratio;
			}
			
			var point = _bezierShrink(_points, ratio);
			if (_this.config.timingfunction == timingfunctions.ELASTIC && count > 2) {
				var n = Math.ceil((count - 2) / 2);
				var f = (1 - _this.config.factor) ^ n;
				point[1] *= f;
			}
			
			return point[1];
		};
		
		function _bezierShrink(points, ratio) {
			if (utils.typeOf(points) != 'array' || points.length < 4) {
				throw 'Failed to shrink bezier points: Bad array!';
				return;
			}
			
			var arr = [];
			var x0 = points[0];
			var y0 = points[1];
			for (var i = 2; i < points.length; i++) {
				var x1 = points[i++];
				var y1 = points[i];
				
				arr.push(x0 + (x1 - x0) * ratio);
				arr.push(y0 + (y1 - y0) * ratio);
				
				x0 = x1;
				y0 = y1;
			}
			
			if (arr.length > 2) {
				arr = _bezierShrink(arr, ratio);
			}
			
			return arr;
		}
		
		_init();
	};
	
	slicease.animation.timingfunctions = timingfunctions;
	slicease.animation.directions = directions;
})(slicease);

(function(slicease) {
	slicease.core = {};
})(slicease);

(function(slicease) {
	slicease.core.states = {
		IDLE: 'idle',
		PLAYING: 'playing',
		STOPPED: 'stopped',
		ERROR: 'error'
	};
})(slicease);

(function(slicease) {
	var renders = slicease.core.renders = {};
	
	renders.types = {
		DEFAULT: 'def'
	},
	
	renders.precisions = {
		HIGH_P: 'highp',
		MEDIUM_P: 'mediump',
		LOW_P: 'lowp'
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		animation = slicease.animation,
		timingfunctions = animation.timingfunctions,
		directions = animation.directions,
		core = slicease.core,
		renders = core.renders,
		rendertypes = renders.types,
		css = utils.css;
	
	var VERTEX_SHADER_SOURCE = ''
			+ 'attribute vec3 aVertexPosition;'
			+ 'attribute vec4 aVertexColor;'
			+ 'attribute vec2 aTextureCoord;'
			//+ 'attribute vec3 aVertexNormal;'
			
			+ 'uniform mat4 uModelViewMatrix;'
			+ 'uniform mat4 uProjectionMatrix;'
			//+ 'uniform mat4 uNormalMatrix;'
			
			+ 'varying [precision] vec4 vVertexColor;'
			+ 'varying [precision] vec2 vTextureCoord;'
			//+ 'varying [precision] vec3 vLighting;'
			
			+ 'void main() {'
			+ '  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);'
			+ '  vVertexColor = aVertexColor;'
			+ '  vTextureCoord = aTextureCoord;'
			
			//+ '  vec3 ambientLight = vec3(1.0, 1.0, 1.0);'
			//+ '  vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);'
			//+ '  vec3 directionalVector = vec3(0.0, -1.0, 0.0);'
			//+ '  vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);'
			//+ '  float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);'
			//+ '  vLighting = ambientLight + (directionalLightColor * directional);'
			+ '}';
	
	var FRAGMENT_SHADER_SOURCE = ''
			+ 'precision [precision] float;'
			+ 'varying [precision] vec4 vVertexColor;'
			+ 'varying [precision] vec2 vTextureCoord;'
			//+ 'varying [precision] vec3 vLighting;'
			+ 'uniform bool uUseTextures;'
			+ 'uniform sampler2D uSampler;'
			
			+ 'void main() {'
			+ '  vec4 normalColor;'
			+ '  if (uUseTextures) {'
			+ '    normalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));'
			+ '  } else {'
			+ '    normalColor = vVertexColor;'
			+ '  }'
			+ '  gl_FragColor = normalColor;'
			//+ '  gl_FragColor = vec4(normalColor.rgb * vLighting, normalColor.a);'
			+ '}';
	
	renders.def = function(view, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.def')),
			_defaults = {},
			_converse = false,
			_running = false,
			_oldIndex = -1,
			_newIndex = -1,
			_range,
			_cubic,
			_pieces,
			_loader,
			_timer,
			_textures,
			_animation,
			_animations,
			
			_canvas,
			_webgl,
			_shaderProgram,
			_fragmentShader,
			_vertexShader,
			_aVertexPosition,
			//_aVertexNormal,
			_aVertexColor,
			_aTextureCoord,
			_verticesBuffer,
			_verticesColorsBuffer,
			_verticesTextureCoordBuffer,
			//_verticesNormalBuffer,
			_verticesFrontIndexBuffer,
			_verticesBackIndexBuffer,
			_verticesTopIndexBuffer,
			_verticesBottomIndexBuffer,
			_verticesLeftIndexBuffer,
			_verticesRightIndexBuffer;
		
		function _init() {
			_this.name = rendertypes.DEFAULT;
			
			_this.config = utils.extend({}, _defaults, config);
			
			VERTEX_SHADER_SOURCE = VERTEX_SHADER_SOURCE.replace(/\[precision\]/g, _this.config.precision);
			FRAGMENT_SHADER_SOURCE = FRAGMENT_SHADER_SOURCE.replace(/\[precision\]/g, _this.config.precision);
			
			_loader = new utils.imageloader();
			_loader.addEventListener(events.SLICEASE_COMPLETE, _onLoaderComplete);
			_loader.addEventListener(events.ERROR, _onLoaderError);
			
			_animations = [{
				z: new animation({
					duration: 1000,
					timingfunction: animation.timingfunctions.ELASTIC
				}),
				r: new animation({
					duration: 1200,
					timingfunction: animation.timingfunctions.CUBIC_BEZIER,
					points: [0.24, -0.58, 0.58, 2.0, 0.82, 0.58]
				})
			}, {
				z: new animation({
					duration: 1000,
					timingfunction: animation.timingfunctions.WAVES_IN
				}),
				r: new animation({
					duration: 1000,
					timingfunction: animation.timingfunctions.CUBIC_BEZIER,
					points: [0.24, -0.58, 0.82, 1.0]
				})
			}, {
				z: new animation({
					duration: 400,
					timingfunction: animation.timingfunctions.EASE_IN_OUT,
					iterationcount: 2,
					direction: directions.ALTERNATE
				}),
				r: new animation({
					duration: 1000,
					timingfunction: animation.timingfunctions.CUBIC_BEZIER,
					points: [0.42, 2.0, 0.84, 0.5]
				})
			}];
			_animations.index = -1;
			
			_animation = {
				z: new animation({
					duration: 500,
					timingfunction: animation.timingfunctions.EASE_IN
				}),
				r: new animation({
					duration: 500,
					timingfunction: animation.timingfunctions.EASE_IN
				})
			};
			
			_canvas = utils.createElement('canvas');
			_canvas.innerHTML = '<a>Canvas not supported! </a>'
					+ '<a>Please open in a browser listed below: </a>'
					+ '<a>Chrome, Firefox, Opera, Safari, Edge, 360.</a>';
			_canvas.width = _this.config.width;
			_canvas.height = _this.config.height;
			
			_webgl = _canvas.getContext("webgl") || _canvas.getContext("experimental-webgl");
			_webgl.viewport(0, 0, _canvas.width, _canvas.height);
			//_webgl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
			_webgl.clearDepth(1.0);                 // Clear everything
			_webgl.enable(_webgl.DEPTH_TEST);       // Enable depth testing
			_webgl.enable(_webgl.CULL_FACE);
			_webgl.depthFunc(_webgl.LEQUAL);        // Near things obscure far things
		}
		
		_this.setup = function() {
			_range = _this.config.range.split('-');
			_range[0] = parseInt(_range[0]);
			_range[1] = parseInt(_range[1] || _range[0]);
			
			_cubic = _this.config.cubic.split(',');
			_cubic[0] = parseInt(_cubic[0]);
			_cubic[1] = parseInt(_cubic[1] || _cubic[0]);
			_cubic[2] = parseInt(_cubic[2] || _cubic[1] || _cubic[0]);
			
			_textures = new Array(_this.config.sources.length);
			
			_initShaders();
			_initBuffers();
			
			_this.dispatchEvent(events.SLICEASE_READY, { id: _this.config.id });
		};
		
		function _initShaders() {
			_vertexShader = _webgl.createShader(_webgl.VERTEX_SHADER);
			_webgl.shaderSource(_vertexShader, VERTEX_SHADER_SOURCE);
			_webgl.compileShader(_vertexShader);
			if (!_webgl.getShaderParameter(_vertexShader, _webgl.COMPILE_STATUS)) {
				utils.log(_webgl.getShaderInfoLog(_vertexShader));
				_this.dispatchEvent(events.SLICEASE_RENDER_ERROR, { message: 'Failed to compile vertex shader.' });
				return;
			}
			
			_fragmentShader = _webgl.createShader(_webgl.FRAGMENT_SHADER);
			_webgl.shaderSource(_fragmentShader, FRAGMENT_SHADER_SOURCE);
			_webgl.compileShader(_fragmentShader);
			if (!_webgl.getShaderParameter(_fragmentShader, _webgl.COMPILE_STATUS)) {
				utils.log(_webgl.getShaderInfoLog(_fragmentShader));
				_this.dispatchEvent(events.SLICEASE_RENDER_ERROR, { message: 'Failed to compile fragment shader.' });
				return;
			}
			
			_shaderProgram = _webgl.createProgram();
			_webgl.attachShader(_shaderProgram, _vertexShader);
			_webgl.attachShader(_shaderProgram, _fragmentShader);
			_webgl.linkProgram(_shaderProgram);
			if (!_webgl.getProgramParameter(_shaderProgram, _webgl.LINK_STATUS)) {
				_this.dispatchEvent(events.SLICEASE_RENDER_ERROR, { message: 'Failed to create WebGLProgram.' });
				return;
			}
			_webgl.useProgram(_shaderProgram);
			
			_aVertexPosition = _webgl.getAttribLocation(_shaderProgram, "aVertexPosition");
			_webgl.enableVertexAttribArray(_aVertexPosition);
			
			_aVertexColor = _webgl.getAttribLocation(_shaderProgram, "aVertexColor");
			_webgl.enableVertexAttribArray(_aVertexColor);
			
			_aTextureCoord = _webgl.getAttribLocation(_shaderProgram, "aTextureCoord");
			_webgl.enableVertexAttribArray(_aTextureCoord);
			
			//_aVertexNormal = _webgl.getAttribLocation(_shaderProgram, "aVertexNormal");
			//_webgl.enableVertexAttribArray(_aVertexNormal);
		}
		
		function _initBuffers() {
			_verticesBuffer = _webgl.createBuffer();
			_verticesColorsBuffer = _webgl.createBuffer();
			_verticesTextureCoordBuffer = _webgl.createBuffer();
			//_verticesNormalBuffer = _webgl.createBuffer();
			
			_verticesFrontIndexBuffer = _webgl.createBuffer();
			_verticesBackIndexBuffer = _webgl.createBuffer();
			_verticesTopIndexBuffer = _webgl.createBuffer();
			_verticesBottomIndexBuffer = _webgl.createBuffer();
			_verticesLeftIndexBuffer = _webgl.createBuffer();
			_verticesRightIndexBuffer = _webgl.createBuffer();
		}
		
		_this.play = function(index, converse) {
			if (_running) {
				utils.log('Render busy!');
				return false;
			}
			
			if (index < 0 || index >= _this.config.sources.length) {
				utils.log('Index out of bounds!');
				return false;
			}
			
			_converse = converse;
			_running = true;
			_oldIndex = _newIndex;
			_newIndex = index;
			
			_pieces = _range[0] + Math.round(Math.random() * (_range[1] - _range[0]));
			if (_pieces == 8) { // Skipping scratch
				_pieces++;
			}
			
			var animationIndex = _animations.index++;
			if (animationIndex >= 0) {
				_animation = _animations[animationIndex];
				if (_animations.index == _animations.length) {
					_animations.index = 0;
				}
			}
			
			var next = _webgl['TEXTURE' + _newIndex];
			if (_oldIndex < 0 || _textures[_newIndex] == undefined) {
				var item = _this.config.sources[_newIndex];
				if (utils.typeOf(item) != 'object' || !item.file) {
					utils.log('Source item should be object contains file property.');
					return false;
				}
				
				_loader.load(item.file);
				
				return true;
			}
			
			_startTimer();
			
			return true;
		};
		
		function _drawCube(index, total) {
			var x = _cubic[0] / total / 2;
			var y = _cubic[1] / 2;
			var z = _cubic[2] / 2;
			var vertices = [
				// Front face
				-x,  y,  z,
				-x, -y,  z,
				 x, -y,  z,
				 x,  y,  z,
				// Back face
				-x, -y, -z,
				-x,  y, -z,
				 x,  y, -z,
				 x, -y, -z,
				// Top face
				-x,  y, -z,
				-x,  y,  z,
				 x,  y,  z,
				 x,  y, -z,
				// Bottom face
				-x, -y,  z,
				-x, -y, -z,
				 x, -y, -z,
				 x, -y,  z,
				// Left face
				-x,  y, -z,
				-x, -y, -z,
				-x, -y,  z,
				-x,  y,  z,
				// Right face
				 x,  y,  z,
				 x, -y,  z,
				 x, -y, -z,
				 x,  y, -z
			];
			_webgl.bindBuffer(_webgl.ARRAY_BUFFER, _verticesBuffer);
			_webgl.bufferData(_webgl.ARRAY_BUFFER, new Float32Array(vertices), _webgl.STATIC_DRAW);
			_webgl.vertexAttribPointer(_aVertexPosition, 3, _webgl.FLOAT, false, 0, 0);
			/*
			var vertexNormals = [
				// Front
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				// Back
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				// Top
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				// Bottom
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				// Left
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0,
				// Right
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0
			];
			_webgl.bindBuffer(_webgl.ARRAY_BUFFER, _verticesNormalBuffer);
			_webgl.bufferData(_webgl.ARRAY_BUFFER, new Float32Array(vertexNormals), _webgl.STATIC_DRAW);
			_webgl.vertexAttribPointer(_aVertexNormal, 3, _webgl.FLOAT, false, 0, 0);
			*/
			var colors = [];
			for (var i = 0; i < 24; i++) {
				colors = colors.concat(_this.config.profile);
			}
			_webgl.bindBuffer(_webgl.ARRAY_BUFFER, _verticesColorsBuffer);
			_webgl.bufferData(_webgl.ARRAY_BUFFER, new Float32Array(colors), _webgl.STATIC_DRAW);
			_webgl.vertexAttribPointer(_aVertexColor, 4, _webgl.FLOAT, false, 0, 0);
			
			var per = 1 / total;
			var sta = index * per;
			var end = (index + 1) * per;
			var textureCoordinates = [
				// Front
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0,
				// Back
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0,
				// Top
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0,
				// Bottom
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0,
				// Left
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0,
				// Right
				sta,  0.0,
				sta,  1.0,
				end,  1.0,
				end,  0.0
			];
			_webgl.bindBuffer(_webgl.ARRAY_BUFFER, _verticesTextureCoordBuffer);
			_webgl.bufferData(_webgl.ARRAY_BUFFER, new Float32Array(textureCoordinates), _webgl.STATIC_DRAW);
			_webgl.vertexAttribPointer(_aTextureCoord, 2, _webgl.FLOAT, false, 0, 0);
			
			var vertexIndices = [
				0,  1,  2,     0,  2,  3,  // front
				4,  5,  6,     4,  6,  7,  // back
				8,  9,  10,    8,  10, 11, // top
				12, 13, 14,    12, 14, 15, // bottom
				16, 17, 18,    16, 18, 19, // left
				20, 21, 22,    20, 22, 23  // right
			];
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesFrontIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(0, 6)), _webgl.STATIC_DRAW);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesBackIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(6, 12)), _webgl.STATIC_DRAW);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesTopIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(12, 18)), _webgl.STATIC_DRAW);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesBottomIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(18, 24)), _webgl.STATIC_DRAW);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesLeftIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(24, 30)), _webgl.STATIC_DRAW);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesRightIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices.slice(30, 36)), _webgl.STATIC_DRAW);
			
			_setMatrixUniforms(index, total, x);
			
			var curr;
			if (_oldIndex >= 0) {
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), true);
				
				curr = _webgl['TEXTURE' + _oldIndex];
				_webgl.activeTexture(curr);
				_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_oldIndex]);
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _oldIndex);
			} else {
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), false);
			}
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesFrontIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), true);
			
			var next = _webgl['TEXTURE' + _newIndex];
			_webgl.activeTexture(next);
			_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_newIndex]);
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _newIndex);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _converse ? _verticesBottomIndexBuffer : _verticesTopIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), false);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesBackIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _converse ? _verticesTopIndexBuffer : _verticesBottomIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesLeftIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesRightIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
		}
		
		function _setMatrixUniforms(index, total, width) {
			_animation.z.config.delay = _animation.r.config.delay = (_converse ? total - index - 1 : index) * 100;
			
			var time = _timer.currentCount() * _timer.delay;
			var ratioZ = _animation.z.animate(time);
			var ratioR = _animation.r.animate(time);
			var x = (1 - total + index * 2) * width;
			var z = ratioZ * -10;
			var r = ratioR * Math.PI / 2;
			
			if (_oldIndex < 0) {
				z = -10 + ratioZ * 10;
				r = Math.PI / 4 * (1 + ratioR);
			}
			
			if (_converse) {
				r *= -1;
			}
			
			var modelViewMatrix = mat4.create();
			mat4.lookAt(modelViewMatrix, [0, 0, _this.config.distance], [0, 0, 0], [0, 1, 0]);
			mat4.translate(modelViewMatrix, modelViewMatrix, [x, 0.0, z]);
			mat4.rotateX(modelViewMatrix, modelViewMatrix, r);
			var uModelViewMatrix = _webgl.getUniformLocation(_shaderProgram, "uModelViewMatrix");
			_webgl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
			
			var projectionMatrix = mat4.create();
			mat4.perspective(projectionMatrix, Math.PI / 6, _canvas.width / _canvas.height, 0.1, 100);
			var uProjectionMatrix = _webgl.getUniformLocation(_shaderProgram, "uProjectionMatrix");
			_webgl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
		}
		
		function _onLoaderComplete(e) {
			utils.log('Loaded image ' + e.src + '.');
			
			_createTexture(e.data);
			_startTimer();
		}
		
		function _createTexture(image) {
			var texture = _textures[_newIndex] = _webgl.createTexture();
			_webgl.bindTexture(_webgl.TEXTURE_2D, texture);
			_webgl.texImage2D(_webgl.TEXTURE_2D, 0, _webgl.RGBA, _webgl.RGBA, _webgl.UNSIGNED_BYTE, image);
			
			if (_isPowerOf2(image.width) && _isPowerOf2(image.height)) {
				_webgl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MAG_FILTER, _webgl.LINEAR);
				_webgl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MIN_FILTER, _webgl.LINEAR_MIPMAP_NEAREST);
				_webgl.generateMipmap(_webgl.TEXTURE_2D);
			} else {
				_webgl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MIN_FILTER, _webgl.LINEAR);
				_webgl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_S, _webgl.CLAMP_TO_EDGE);
				_webgl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_T, _webgl.CLAMP_TO_EDGE);
			}
			
			if (_newIndex == _pieces - 1) {
				_webgl.bindTexture(_webgl.TEXTURE_2D, null);
			}
		}
		
		function _isPowerOf2(uint) {
			if (uint <= 0) {
				return false;
			}
			
			return (uint - 1 & uint) === 0;
		}
		
		function _onLoaderError(e) {
			utils.log(e.message);
		}
		
		function _startTimer() {
			_this.dispatchEvent(events.SLICEASE_RENDER_UPDATE_START, { index: _newIndex });
			
			if (!_timer) {
				_timer = new utils.timer(15);
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
			_webgl.clear(_webgl.COLOR_BUFFER_BIT | _webgl.DEPTH_BUFFER_BIT);
			
			for (var i = 0; i < _pieces; i++) {
				_drawCube(i, _pieces);
			}
			
			if (_timer.currentCount() * _timer.delay >= _animation.r.config.duration + (_pieces - 1) * 100) {
				_stopTimer();
				_running = false;
				_this.dispatchEvent(events.SLICEASE_RENDER_UPDATE_END);
			}
		}
		
		_this.stop = function() {
			if (_loader) {
				_loader.stop();
			}
		};
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.resize = function(width, height) {
			_canvas.width = width || _this.config.width;
			_canvas.height = height || _this.config.height;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var skins = slicease.core.skins = {};
	
	skins.types = {
		DEFAULT: 'def'
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		states = core.states,
		skins = slicease.core.skins,
		skintypes = skins.types,
		css = utils.css,
		
		WRAP_CLASS = 'sli-wrapper',
		SKIN_CLASS = 'sli-skin',
		RENDER_CLASS = 'sli-render',
		CONTROLS_CLASS = 'sli-controls',
		CONTEXTMENU_CLASS = 'sli-contextmenu',
		
		NAV_CLASS = 'sli-nav',
		
		DISPLAY_CLASS = 'sli-display',
		DISPLAY_ICON_CLASS = 'sli-display-icon',
		DISPLAY_LABEL_CLASS = 'sli-display-label',
		
		PAGES_CLASS = 'sli-pages',
		CONTROL_CLASS = 'sli-control',
		SELECTED_CLASS = 'selected',
		PREV_CLASS = 'prev',
		NEXT_CLASS = 'next',
		
		FEATURED_CLASS = 'pe-featured',
		
		BUTTON_CLASS = 'sli-button',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_VISIBLE = 'visible',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BOLD = 'bold',
		CSS_CENTER = 'center',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block',
		CSS_DEFAULT = 'default',
		CSS_POINTER = 'pointer',
		CSS_NO_REPEAT = 'no-repeat',
		CSS_NOWRAP = 'nowrap';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skintypes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_RELATIVE,
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.05)'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': 'Microsoft YaHei,arial,sans-serif',
				'font-size': '12px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				'text-align': CSS_CENTER,
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER,
				cursor: CSS_POINTER,
				display: CSS_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'font-size': '0',
				'line-height': '0',
				position: CSS_RELATIVE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + NAV_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				top: '0',
				position: CSS_ABSOLUTE,
				display: CSS_INLINE_BLOCK,
				'z-index': '1'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'text-align': CSS_CENTER,
				top: '0',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				display: CSS_NONE,
				'z-index': '2'
			});
			css('.' + SKIN_CLASS + '.' + states.IDLE + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.PLAYING + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.STOPPED + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.ERROR + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS, {
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS, {
				margin: '0 auto',
				width: '48px',
				height: '48px',
				top: (_height - 40 - 48) / 2 + 'px',
				left: (_width - 48) / 2 + 'px',
				position: CSS_ABSOLUTE,
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER,
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_LABEL_CLASS, {
				'margin-top': (_height - 40 - 32) / 2 + 'px',
				'font-size': '14px',
				'line-height': '32px',
				color: '#CCCCCC',
				'text-align': CSS_CENTER,
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_LABEL_CLASS + ' a', {
				'font-size': '14px',
				'font-weight': CSS_BOLD,
				color: '#FFFFFF'
			});
			css('.' + SKIN_CLASS + '.' + states.ERROR + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS, {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUxpcebm5ubm5ufn5+fn5+bm5ubm5ujo6Obm5ubm5uXl5e/v7+bm5v4Cjk0AAAAMdFJOUwDAmSBi7IA9ULDQEGJkMtUAAAFESURBVDjLdVShUgMxEE17Nz0YEHQGDBOBoQgi7gMQeBAIBOIEg8FUVKEQGFwFKAQ1DLYCwQ8EOKCd91FN0lznst2NuMu9d3m72eyLUq1xpISxdyoQ+ksi8M6gd88VUD9QuDhEGFSs0Esc8zLBs4nD3gZO6zhd8AjMznzwyxTPnbaX0PUoJQxskNavKd4DDsJkl6Q0xs9ykmaksgp8jToQSjTGjlS6ksULSamLb57YxhNP3AvJqiE+eGIyFw56agWCy7b34onfdeK8FoghBCkDIbi2zYNmOuM3uBXiMiXJ8ccXcRMXfNlPQtcwB2UQGm9KjzaD5Zuhg3++fUz8kzZcjrokLRpLG5V8wrGpm69raoMgrFshu9E4HjetBSurKfXpzHjV3pI3bX9w03cvm2x3o0LjZ3IFFCZeAKP1K2PfWf129bkALBuQv4Z6ZbEAAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + '.' + states.ERROR + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS + ':hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUxpcQCf6ACf6QCf7wCf6gCg6QCg6QCf6wCf6QCg6QCf6QCf7wCg6Ta1FVAAAAAMdFJOUwDAmSBi7IA9ULDQEGJkMtUAAAFESURBVDjLdVShUgMxEE17Nz0YEHQGDBOBoQgi7gMQeBAIBOIEg8FUVKEQGFwFKAQ1DLYCwQ8EOKCd91FN0lznst2NuMu9d3m72eyLUq1xpISxdyoQ+ksi8M6gd88VUD9QuDhEGFSs0Esc8zLBs4nD3gZO6zhd8AjMznzwyxTPnbaX0PUoJQxskNavKd4DDsJkl6Q0xs9ykmaksgp8jToQSjTGjlS6ksULSamLb57YxhNP3AvJqiE+eGIyFw56agWCy7b34onfdeK8FoghBCkDIbi2zYNmOuM3uBXiMiXJ8ccXcRMXfNlPQtcwB2UQGm9KjzaD5Zuhg3++fUz8kzZcjrokLRpLG5V8wrGpm69raoMgrFshu9E4HjetBSurKfXpzHjV3pI3bX9w03cvm2x3o0LjZ3IFFCZeAKP1K2PfWf129bkALBuQv4Z6ZbEAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' canvas', {
				'background-color': 'transparent'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS, {
				'z-index': '3'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS, {
				bottom: '10px',
				'line-height': '10px',
				position: CSS_ABSOLUTE,
				display: CSS_BLOCK,
				'z-index': '4'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS + ' .' + BUTTON_CLASS, {
				'margin-right': '8px',
				width: '25px',
				height: '11px',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS + ' .' + BUTTON_CLASS + ':last-child', {
				'margin-right': '0'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS + ' .' + BUTTON_CLASS + ' a', {
				margin: '3px 0',
				width: CSS_100PCT,
				height: '5px',
				opacity: '.3',
				background: '#000000',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS + ' .' + BUTTON_CLASS + '.' + SELECTED_CLASS + ' a', {
				opacity: '.6',
				background: '#FFFFFF'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS, {
				'margin-top': '-20px',
				width: '24px',
				height: '40px',
				top: '50%',
				opacity: '.3',
				background: '#000000',
				position: CSS_ABSOLUTE,
				display: CSS_NONE,
				'z-index': '5'
			});
			css('.' + WRAP_CLASS + ':hover .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS, {
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + ':hover', {
				opacity: '.4'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + ' span', {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER,
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + '.' + PREV_CLASS, {
				left: '0'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + '.' + PREV_CLASS + ' span', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAlklEQVRIS7XVwQ2AIBBE0ZnO7ETpDDuxszUcTIwxsDsLnDz9J8QVYvHi4j5SgJltJK/eS8qAmVUAO4BCsj3/Lgl4xVv0JHlMAyLxhoZ2EI2HACXuBtS4C8jEh0A23gVmxCNAJVmU30r3M/3sQkKGc5BFhkA7lgziAjKIG1CREKAgYSCKSMAHmX/hPAO39Mr0TrV8RF7gBqveYhnAXdKeAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + '.' + NEXT_CLASS, {
				right: '0'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CONTROL_CLASS + '.' + NEXT_CLASS + ' span', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAApElEQVRIS7XV0Q2DMAwE0LvNugllhG7CBqWbsJmrSPBDIbbPTf5zz4lsmRh8ODgfLmBmD5KbWkgXMLMngDeAleSsIB6wApj2YAmJfFEJcYFWvZnJSAioIGFARVKAgqSBLCIBF8iL5HI1J/8CPiTbUP4cCTi17W1409JAJjwNZMNTgBIeBtTwEFAJd4FqeAQ4Fk63FXuLyG3ToStTWZHnO+4LqsgXYy1iGYSzNHkAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS, {
				'white-space': CSS_NOWRAP,
				position: CSS_ABSOLUTE,
				display: CSS_NONE,
				'z-index': '6'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul', {
				'list-style': CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li', {
				
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a', {
				padding: '8px 14px',
				color: '#E6E6E6',
				'line-height': '20px',
				'text-decoration': CSS_NONE,
				background: '#252525',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a:hover', {
				'text-decoration': CSS_NONE,
				background: '#303030'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li.' + FEATURED_CLASS + ' a', {
				color: '#BDBDBD',
				background: '#454545'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li.' + FEATURED_CLASS + ' a:hover', {
				'text-decoration': CSS_NONE,
				background: '#505050'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a span', {
				'margin-right': '10px',
				'padding-right': '10px',
				width: '20px',
				height: '20px',
				'border-right': '1px solid #BDBDBD',
				'vertical-align': 'middle',
				display: CSS_INLINE_BLOCK
			});
		}
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	slicease.core.components = {};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		components = core.components,
		
		PAGES_CLASS = 'sli-pages',
		CONTROL_CLASS = 'sli-control',
		SELECTED_CLASS = 'selected',
		PREV_CLASS = 'prev',
		NEXT_CLASS = 'next',
		
		BUTTON_CLASS = 'sli-button',
		
		// For all api instances
		CSS_BLOCK = 'block';
	
	components.controlbar = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.controlbar')),
			_defaults = {},
			_pages,
			_prev,
			_next;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_buildLayout();
		}
		
		function _buildLayout() {
			_pages = utils.createElement('div', PAGES_CLASS);
			
			for (var i = 0; i < config.pages; i++) {
				var element = utils.createElement('span', BUTTON_CLASS);
				element.setAttribute('index', i);
				element.innerHTML = '<a></a>';
				element.addEventListener('click', _onPageClick);
				
				_pages.appendChild(element);
			}
			
			_prev = utils.createElement('div', CONTROL_CLASS + ' ' + BUTTON_CLASS + ' ' + PREV_CLASS);
			_prev.innerHTML = '<span></span>';
			_prev.addEventListener('click', function(e) {
				_this.dispatchEvent(events.SLICEASE_VIEW_PREV);
			});
			
			_next = utils.createElement('div', CONTROL_CLASS + ' ' + BUTTON_CLASS + ' ' + NEXT_CLASS);
			_next.innerHTML = '<span></span>';
			_next.addEventListener('click', function(e) {
				_this.dispatchEvent(events.SLICEASE_VIEW_NEXT);
			});
			
			layer.appendChild(_pages);
			layer.appendChild(_prev);
			layer.appendChild(_next);
		}
		
		function _onPageClick(e) {
			var index = e.currentTarget.getAttribute('index');
			_this.dispatchEvent(events.SLICEASE_VIEW_PLAY, { index: index });
		}
		
		_this.setActive = function(index) {
			for (var i = 0; i < _pages.childNodes.length; i++) {
				var element = _pages.childNodes[i];
				if (i == index) {
					utils.addClass(element, SELECTED_CLASS);
				} else {
					utils.removeClass(element, SELECTED_CLASS);
				}
			}
		};
		
		_this.resize = function(width, height) {
			css.style(_pages, {
				left: ((width - (_pages.childNodes.length * 33 - 8)) / 2) + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		components = core.components,
		
		NAV_CLASS = 'sli-nav',
		
		// For all api instances
		CSS_NONE = 'none',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.navigation = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.navigation')),
			_container;
		
		function _init() {
			_this.config = utils.extend({}, config);
			
			_container = utils.createElement('a', NAV_CLASS);
		}
		
		_this.setActive = function(index) {
			var item = _this.config.sources[index];
			
			css.style(_container, {
				display: item.link ? CSS_INLINE_BLOCK : CSS_NONE
			});
			
			_container.setAttribute('href', item.link || '#');
			_container.setAttribute('target', item.target || '_blank');
		};
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		states = core.states,
		components = core.components,
		
		BUTTON_CLASS = 'sli-button',
		
		DISPLAY_CLASS = 'sli-display',
		DISPLAY_ICON_CLASS = 'sli-display-icon',
		DISPLAY_LABEL_CLASS = 'sli-display-label',
		
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.display = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.display')),
			_defaults = {
				id: 'sli-display'
			},
			_container,
			_icon,
			_label,
			_timer;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_container = utils.createElement('div', DISPLAY_CLASS);
			
			_icon = utils.createElement('span', BUTTON_CLASS + ' ' + DISPLAY_ICON_CLASS);
			_container.appendChild(_icon);
			
			_label = utils.createElement('span', DISPLAY_LABEL_CLASS);
			_label.id = _this.config.id;
			_container.appendChild(_label);
		}
		
		_this.show = function(state, message) {
			switch (state) {
				case states.ERROR:
					break;
					
				default:
					break;
			}
			
			css.style(_label, {
				display: message ? CSS_INLINE_BLOCK : CSS_NONE
			});
			
			_label.innerHTML = message;
		};
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			css.style(_icon, {
				top: (height - 48) / 2 + 'px',
				left: (width - 48) / 2 + 'px'
			});
			css.style(_label, {
				'margin-top': (height - 32) / 2 + 'px'
			});
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		css = utils.css,
		events = slicease.events,
		core = slicease.core,
		components = core.components,
		
		FEATURED_CLASS = 'sli-featured';
	
	components.contextmenu = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.contextmenu')),
			_defaults = {
				items: []
			},
			_info = {
				text: 'SLICEASE ' + slicease.version,
				link: 'http://studease.cn/slicease',
				target: '_blank'
			},
			_container,
			_logo,
			_img,
			_loaded = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_this.config.items = [_info].concat(_this.config.items);
			
			_container = utils.createElement('ul');
			
			for (var i = 0; i < _this.config.items.length; i++) {
				var item = _this.config.items[i];
				
				var a = utils.createElement('a');
				if (item.link) {
					a.href = item.link;
				}
				if (item.target) {
					a.target = item.target;
				}
				if (item.text) {
					a.innerText = item.text;
				}
				if (item.icon) {
					var span = utils.createElement('span');
					a.insertAdjacentElement('afterbegin', span);
					
					css.style(span, {
						background: 'url(' + item.icon + ') no-repeat center left'
					});
				}
				
				var li = utils.createElement('li', item.icon ? FEATURED_CLASS : '');
				li.appendChild(a);
				
				_container.appendChild(li);
			}
			
			layer.appendChild(_container);
		}
		
		_this.show = function(offsetX, offsetY) {
			css.style(layer, {
				left: offsetX + 'px',
				top: offsetY + 'px',
				display: 'block'
			});
		};
		
		_this.hide = function() {
			css.style(layer, {
				display: 'none'
			});
		};
		
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core;
	
	core.entity = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('core.entity')),
			_model,
			_view,
			_controller;
		
		function _init() {
			_this.id = config.id;
			
			_this.model = _model = new core.model(config);
			_this.view = _view = new core.view(_model);
			_this.controller = _controller = new core.controller(_model, _view);
			
			_controller.addGlobalListener(_forward);
			
			_initializeAPI();
		}
		
		function _initializeAPI() {
			_this.play = _controller.play;
			_this.stop = _controller.stop;
			_this.prev = _controller.prev;
			_this.next = _controller.next;
			
			_this.getState = _model.getState;
			
			_this.resize = _view.resize;
		}
		
		_this.setup = function() {
			setTimeout(function() {
				_controller.setup();
			});
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
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
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		states = core.states;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {},
		 	_state = states.STOPPED,
		 	_properties;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_properties = {
				
			};
		}
		
		_this.setState = function(state) {
			if (state == _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.SLCIEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.getProperty = function(key) {
			return _properties[key];
		};
		
		_this.getConfig = function(name) {
			return _this.config[name];
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		states = core.states,
		components = core.components,
		renders = core.renders,
		skins = core.skins,
		css = utils.css,
		
		WRAP_CLASS = 'sli-wrapper',
		SKIN_CLASS = 'sli-skin',
		RENDER_CLASS = 'sli-render',
		CONTROLS_CLASS = 'sli-controls',
		CONTEXTMENU_CLASS = 'sli-contextmenu',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_renderLayer,
			_controlsLayer,
			_contextmenuLayer,
			_controlbar,
			_navigation,
			_display,
			_contextmenu,
			_render,
			_skin,
			_autohidetimer,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.getConfig('skin').name);
			_wrapper.id = model.getConfig('id');
			//_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_controlsLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initComponents();
			_initRender();
			_initSkin();
			
			_wrapper.oncontextmenu = function(e) {
				e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			};
			
			window.addEventListener('resize', _onResize);
			_wrapper.addEventListener('keydown', _onKeyDown);
			_wrapper.addEventListener('mousedown', _onMouseDown);
			document.addEventListener('mousedown', _onMouseDown);
			
			var replace = document.getElementById(model.getConfig('id'));
			replace.parentNode.replaceChild(_wrapper, replace);
		}
		
		function _initComponents() {
			// controlbar
			var cbcfg = {
				pages: model.getConfig('sources').length
			};
			
			try {
				_controlbar = new components.controlbar(_controlsLayer, cbcfg);
				_controlbar.addGlobalListener(_forward);
			} catch (err) {
				utils.log('Failed to init "controlbar" component!');
			}
			
			// navigation
			var nvcfg = {
				width: model.getConfig('width'),
				height: model.getConfig('height'),
				sources: model.getConfig('sources')
			};
			
			try {
				_navigation = new components.navigation(nvcfg);
				_navigation.addGlobalListener(_forward);
				
				_renderLayer.appendChild(_navigation.element());
			} catch (err) {
				utils.log('Failed to init "navigation" component!');
			}
			
			// display
			var dicfg = utils.extend({}, model.getConfig('display'), {
				id: model.getConfig('id') + '-display'
			});
			
			try {
				_display = new components.display(dicfg);
				_display.addGlobalListener(_forward);
				
				_renderLayer.appendChild(_display.element());
			} catch (err) {
				utils.log('Failed to init "display" component!');
			}
			
			// contextmenu
			var ctxcfg = utils.extend({}, model.getConfig('contextmenu'));
			
			try {
				_contextmenu = new components.contextmenu(_contextmenuLayer, ctxcfg);
				_contextmenu.addGlobalListener(_forward);
			} catch (err) {
				utils.log('Failed to init "contextmenu" component!');
			}
		}
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: model.getConfig('id'),
				width: model.getConfig('width'),
				height: model.getConfig('height'),
				sources: model.getConfig('sources'),
				range: model.getConfig('range'),
				cubic: model.getConfig('cubic'),
				distance: model.getConfig('distance')
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_this, cfg);
				_render.addEventListener(events.SLICEASE_READY, _forward);
				_render.addEventListener(events.SLICEASE_RENDER_UPDATE_START, _onUpdateStart);
				_render.addEventListener(events.SLICEASE_RENDER_UPDATE_END, _forward);
				_render.addEventListener(events.SLICEASE_RENDER_ERROR, _forward);
			} catch (e) {
				utils.log('Failed to init render ' + cfg.name + '!');
			}
			
			if (_render) {
				_renderLayer.appendChild(_render.element());
			}
		}
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: model.getConfig('id'),
				width: model.getConfig('width'),
				height: model.getConfig('height')
			});
			
			try {
				_skin = new skins[cfg.name](cfg);
			} catch (e) {
				utils.log('Failed to init skin ' + cfg.name + '!');
			}
		}
		
		_this.setup = function() {
			// Ignore components & skin failure.
			if (!_render) {
				_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, { message: 'Render not available!', name: model.getConfig('render').name });
				return;
			}
			
			_render.setup();
			_this.resize();
		};
		
		_this.play = function(index, converse) {
			return _render.play(index, converse);
		};
		
		_this.stop = function() {
			_render.stop();
		};
		
		function _onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				return true;
			}
			
			switch (e.keyCode) {
				case 13: // enter
				case 32: // space
					
					break;
				default:
					break;
			}
			
			if (/13|32/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			}
		}
		
		function _onMouseDown(e) {
			if (!_contextmenu) {
				return;
			}
			
			if (e.currentTarget == undefined) {
				for (var node = e.srcElement; node; node = node.offsetParent) {
					if (node == _wrapper) {
						e.currentTarget = _wrapper;
						break;
					}
				}
			}
			
			if (e.button == (utils.isMSIE(8) ? 1 : 0) || e.currentTarget != _wrapper) {
				setTimeout(function() {
					_contextmenu.hide();
				}, 200);
			} else if (e.button == 2) {
				var offsetX = 0;
				var offsetY = 0;
				
				for (var node = e.srcElement || e.target; node && node != _wrapper; node = node.offsetParent) {
					offsetX += node.offsetLeft;
					offsetY += node.offsetTop;
				}
				
				_contextmenu.show(e.offsetX + offsetX, e.offsetY + offsetY);
				
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
				return false;
			}
		}
		
		function _onUpdateStart(e) {
			_controlbar.setActive(e.index);
			_navigation.setActive(e.index);
			_forward(e);
		}
		
		_this.display = function(state, message) {
			if (_display) {
				_display.show(state, message);
			}
		};
		
		function _onResize(e) {
			_this.resize();
		}
		
		_this.resize = function(width, height) {
			setTimeout(function() {
				if (width === undefined || height === undefined) {
					width = _renderLayer.clientWidth;
					height = _renderLayer.clientHeight;
				}
				
				var ratio = model.getConfig('aspectratio');
				if (ratio) {
					var arr = ratio.match(/(\d+)\:(\d+)/);
					if (arr && arr.length > 2) {
						var w = parseInt(arr[1]);
						var h = parseInt(arr[2]);
						height = width * h / w;
					}
				}
				
				if (_render) {
					_render.resize(width, height);
				}
				
				_this.dispatchEvent(events.RESIZE, { width: width, height: height });
				
				_controlbar.resize(width, height);
				_display.resize(width, height);
				_contextmenu.resize(width, height);
			});
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				window.removeEventListener('resize', _onResize);
				_wrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(slicease);

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

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	var embed = slicease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = {},
			_errorOccurred = false,
			_embedder = null;
		
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
		
		_this.clearScreen = function() {
			_errorOccurred = false;
			slicease.api.displayError('', _config);
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.SLICEASE_SETUP_ERROR:
				case events.SLICEASE_RENDER_ERROR:
					utils.log('[ERROR] ' + e.message);
					_this.errorScreen(e.message);
					_this.dispatchEvent(events.ERROR, e);
					break;
				default:
					_this.clearScreen();
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

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		embed = slicease.embed,
		core = slicease.core,
		renders = core.renders,
		precisions = renders.precisions,
		rendertypes = renders.types,
		skins = core.skins,
		skintypes = skins.types;
	
	embed.config = function(config) {
		var _defaults = {
			width: 640,
			height: 360,
			aspectratio: '',
			sources: [],
			range: '3-9',
			cubic: '10,4',
			distance: 12,
			interval: 5000,
			controls: true,
			debug: false,
			render: {
				name: rendertypes.DEFAULT,
				precision: precisions.HIGH_P,
				profile: [0.6, 0.6, 0.6, 1.0]
			},
			skin: {
				name: skintypes.DEFAULT
			},
			events: {
				
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		embed = slicease.embed,
		core = slicease.core;
	
	embed.embedder = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher('embed.embedder'));
		
		_this.embed = function() {
			var entity = new core.entity(config);
			entity.addGlobalListener(_onEvent);
			entity.setup();
			api.setEntity(entity);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
	};
})(slicease);
