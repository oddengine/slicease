slicease = function() {
	if (slicease.api) {
		return slicease.api.getInstance.apply(this, arguments);
	}
};

slicease.version = '3.0.06';

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
	
	utils.removeClass = function(element, c) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var removeClasses = utils.typeOf(c) === 'array' ? c : c.split(' ');
		
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
	
	utils.typeOf = function(value) {
		if (value === null || value === undefined) {
			return 'null';
		}
		var typeofString = typeof value;
		if (typeofString === 'object') {
			try {
				if (toString.call(value) === '[object Array]') {
					return 'array';
				}
			} catch (e) {}
		}
		return typeofString;
	};
	
	utils.trim = function(inputString) {
		return inputString.replace(/^\s+|\s+$/g, '');
	};
	
	utils.indexOf = function(array, item) {
		if (array == null) return -1;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	};
	
	utils.isMSIE = function(version) {
		if (version) {
			version = parseFloat(version).toFixed(1);
			return _userAgentMatch(new RegExp('msie\\s*' + version, 'i'));
		}
		return _userAgentMatch(/msie/i);
	};
	
	function _userAgentMatch(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	};
	
	/** Logger */
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
				var name = getStyleName(style);
				if (element.style[name] !== value) {
					element.style[name] = value;
				}
			});
		}
	};
	
	function getStyleName(name) {
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
		
		// API Events
		SLICEASE_READY: 'sliceaseReady',
		SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		SLICEASE_RENDER_ERROR: 'sliceaseRenderError',
		
		SLICEASE_STATE: 'sliceaseState',
		
		// View Events
		SLICEASE_VIEW_PLAY: 'sliceaseViewPlay',
		SLICEASE_VIEW_STOP: 'sliceaseViewStop',
		SLICEASE_VIEW_PREV: 'sliceaseViewPrev',
		SLICEASE_VIEW_NEXT: 'sliceaseViewNext',
		
		SLICEASE_RENDER_UPDATE_START: 'sliceaseRenderUpdateStart',
		SLICEASE_RENDER_UPDATE_END: 'sliceaseRenderUpdateEnd',
		
		SLICEASE_RESIZE: 'sliceaseResize',
		
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
				version: slicease.version,
				type: type
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
		
		_this.setEntity = function(entity, renderName) {
			_entity = entity;
			_this.renderName = renderName;
			
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
	slicease.core.renders = {};
	
	var renders = slicease.core.renders;
	renders.precisions = {
		HIGH_P: 'highp',
		MEDIUM_P: 'mediump',
		LOW_P: 'lowp'
	};
})(slicease);

(function(slicease) {
	slicease.core.renders.modes = {
		DEFAULT: 'def'
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
		rendermodes = renders.modes,
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
			_running = false,
			_oldIndex = -1,
			_newIndex = -1,
			_range,
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
			_this.name = rendermodes.DEFAULT;
			
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
			
			_textures = new Array(_this.config.sources.length);
			
			_initShaders();
			_initBuffers();
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
		
		_this.play = function(index) {
			if (_running) {
				utils.log('Render busy!');
				return;
			}
			
			if (index < 0 || index >= _this.config.sources.length) {
				utils.log('Index out of bounds!');
				return;
			}
			
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
				_loader.load(_this.config.sources[_newIndex]);
				return;
			}
			
			_startTimer();
		};
		
		function _drawCube(index, total) {
			var wth = 5 / total;
			var vertices = [
				// Front face
				-wth,  2.0,  2.0,
				-wth, -2.0,  2.0,
				 wth, -2.0,  2.0,
				 wth,  2.0,  2.0,
				// Back face
				-wth, -2.0, -2.0,
				-wth,  2.0, -2.0,
				 wth,  2.0, -2.0,
				 wth, -2.0, -2.0,
				// Top face
				-wth,  2.0, -2.0,
				-wth,  2.0,  2.0,
				 wth,  2.0,  2.0,
				 wth,  2.0, -2.0,
				// Bottom face
				-wth, -2.0,  2.0,
				-wth, -2.0, -2.0,
				 wth, -2.0, -2.0,
				 wth, -2.0,  2.0,
				// Left face
				-wth,  2.0, -2.0,
				-wth, -2.0, -2.0,
				-wth, -2.0,  2.0,
				-wth,  2.0,  2.0,
				// Right face
				 wth,  2.0,  2.0,
				 wth, -2.0,  2.0,
				 wth, -2.0, -2.0,
				 wth,  2.0, -2.0
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
			
			_setMatrixUniforms(index, total, wth);
			
			var curr;
			if (_oldIndex >= 0) {
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), true);
				
				curr = _webgl['TEXTURE' + _oldIndex];
				_webgl.activeTexture(curr);
				_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_oldIndex]);
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _oldIndex);
				_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesFrontIndexBuffer);
				_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			} else {
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), false);
				
				_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesFrontIndexBuffer);
				_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			}
			
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), true);
			
			var next = _webgl['TEXTURE' + _newIndex];
			_webgl.activeTexture(next);
			_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_newIndex]);
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _newIndex);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesTopIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, 'uUseTextures'), false);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesBackIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesBottomIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesLeftIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesRightIndexBuffer);
			_webgl.drawElements(_webgl.TRIANGLES, 6, _webgl.UNSIGNED_SHORT, 0);
		}
		
		function _setMatrixUniforms(index, total, width) {
			_animation.z.config.delay = _animation.r.config.delay = index * 100;
			
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
			
			var modelViewMatrix = mat4.create();
			mat4.lookAt(modelViewMatrix, [0, 0, 12], [0, 0, 0], [0, 1, 0]);
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
			_this.dispatchEvent(events.SLICEASE_RENDER_UPDATE_START);
			
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
			if (_loader) 
				_loader.stop();
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
	slicease.core.skins = {};
})(slicease);

(function(slicease) {
	slicease.core.skins.modes = {
		DEFAULT: 'def'
	};
})(slicease);

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		skins = slicease.core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'sli-wrapper',
		SKIN_CLASS = 'sli-skin',
		RENDER_CLASS = 'sli-render',
		POSTER_CLASS = 'sli-poster',
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
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: _width + 'px',
				height: _height + 'px'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': '微软雅黑,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_RELATIVE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' canvas', {
				'background-color': '#585862'
			});
		}
		
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
			_this.view = _view = new core.view(_this, _model);
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
				_view.setup();
			}, 0);
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
		 	_state = states.STOPPED;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
		}
		
		_this.setState = function(state) {
			if (state === _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.SLCIEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.getConfig = function(name) {
			return _this.config[name] || {};
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
		renders = core.renders,
		rendermodes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'sli-wrapper',
		SKIN_CLASS = 'sli-skin',
		RENDER_CLASS = 'sli-render',
		POSTER_CLASS = 'sli-poster',
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
	
	core.view = function(entity, model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_renderLayer,
			_posterLayer,
			_controlsLayer,
			_contextmenuLayer,
			_render,
			_skin,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.config.skin.name);
			_wrapper.id = entity.id;
			//_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_posterLayer = utils.createElement('div', POSTER_CLASS);
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_posterLayer);
			_wrapper.appendChild(_controlsLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initRender();
			_initSkin();
			
			var replace = document.getElementById(entity.id);
			replace.parentNode.replaceChild(_wrapper, replace);
			
			window.onresize = function() {
				if (utils.typeOf(model.config.onresize) === 'function') 
					model.config.onresize.call(null);
			};
		}
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: entity.id,
				width: model.config.width,
				height: model.config.height,
				sources: model.config.sources,
				range: model.config.range
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_this, cfg);
				_render.addEventListener(events.SLICEASE_RENDER_UPDATE_START, _onRenderUpdateStart);
				_render.addEventListener(events.SLICEASE_RENDER_UPDATE_END, _onRenderUpdateEnd);
				_render.addEventListener(events.SLICEASE_RENDER_ERROR, _onRenderError);
			} catch (e) {
				utils.log('Failed to init render ' + cfg.name + '!');
			}
			
			if (_render) {
				_renderLayer.appendChild(_render.element());
			}
		}
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: entity.id,
				width: model.config.width,
				height: model.config.height
			});
			
			try {
				_skin = new skins[cfg.name](cfg);
			} catch (e) {
				utils.log('Failed to init skin ' + cfg.name + '!');
			}
		}
		
		_this.setup = function() {
			if (!_render) {
				_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, { message: 'Render not available!', name: model.config.render.name });
				return;
			}
			_render.setup();
			
			// Ignore skin failure.
			
			try {
				_wrapper.addEventListener('keydown', _onKeyDown);
			} catch (e) {
				_wrapper.attachEvent('onkeydown', _onKeyDown);
			}
			
			_this.dispatchEvent(events.SLICEASE_READY);
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
		
		_this.resize = function(width, height) {
			if (_render) 
				_render.resize(width, height);
			if (_skin) 
				_skin.resize(width, height);
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				try {
					_wrapper.removeEventListener('keydown', _onKeyDown);
				} catch (e) {
					_wrapper.detachEvent('onkeydown', _onKeyDown);
				}
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		function _onRenderUpdateStart(e) {
			_forward(e);
		}
		
		function _onRenderUpdateEnd(e) {
			_forward(e);
		}
		
		function _onRenderError(e) {
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

(function(slicease) {
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

(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		embed = slicease.embed,
		core = slicease.core,
		renders = core.renders,
		precisions = renders.precisions,
		rendermodes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			width: 640,
			height: 360,
			sources: [],
			range: '3-10',
			controls: true,
			interval: 5000,
			render: {
				name: rendermodes.DEFAULT,
				precision: precisions.HIGH_P,
				profile: [0.6, 0.6, 0.6, 1.0]
			},
			skin: {
				name: skinmodes.DEFAULT
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
			api.setEntity(entity, config.render.name);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
	};
})(slicease);
