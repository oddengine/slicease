slicease = function() {
	if (slicease.api) {
		return slicease.api.getSlicer.apply(this, arguments);
	}
};
slicease.version = '0.0.01';
(function(slicease) {
	var utils = slicease.utils = {};
    
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
	
	utils.deepExtend = function() {
		var args = Array.prototype.slice.call(arguments, 0),
			obj = args[0];
		if (args.length > 1) {
			for (var i = 1; i < args.length; i++) {
				switch (utils.typeOf(args[i])) {
					case 'object':
						if (obj === undefined || obj === null || utils.typeOf(obj) !== 'object') {
							obj = {};
						}
						utils.foreach(args[i], function(k, v) {
							obj[k] = utils.deepExtend(obj[k], args[i][k]);
						});
						break;
					case 'array':
						obj = utils.clone(args[i]);
						break;
					default:
						obj = args[i];
				}
			}
		}
		return obj;
	};
	
	utils.clone = function(val) {
		var obj;
		switch (utils.typeOf(val)) {
			case 'object':
				obj = {};
				utils.foreach(val, function(k, v) {
					obj[k] = utils.clone(v);
				});
				break;
			case 'array':
				obj = [];
				for (var i = 0; i < val.length; i++) {
					obj.push(utils.clone(val[i]));
				}
				break;
			default:
				obj = val;
		}
		return obj;
	};
	
	utils.foreach = function(data, fn) {
		for (var key in data) {
			if (data.hasOwnProperty && typeof data.hasOwnProperty === 'function') {
				if (data.hasOwnProperty(key)) {
					fn(key, data[key]);
				}
			} else {
				// IE8 has a problem looping through XML nodes
				fn(key, data[key]);
			}
		}
	};
	
	
	utils.createElement = function(elem, className) {
		var newElement = document.createElement(elem);
		if (className) {
			newElement.className = className;
		}
		return newElement;
	}
	
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
		if (value === null) {
			return 'null';
		}
		var typeofString = typeof value;
		if (typeofString === 'object') {
			if (toString.call(value) === '[object Array]') {
				return 'array';
			}
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
	
	
	/** Logger */
	var console = window.console = window.console || {
		log: function() {}
	};
	utils.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (typeof console.log === 'object') {
			console.log(args);
		} else {
			console.log.apply(console, args);
		}
	};
	
	
	utils.memoize = function(func, hasher) {
		var memo = {};
		hasher || (hasher = utils.identity);
		return function() {
			var key = hasher.apply(this, arguments);
			return memo.hasOwnProperty(key) ? memo[key] : (memo[key] = func.apply(this, arguments));
		};
	};
	
	utils.identity = function(value) {
		return value;
	};
	
	var _userAgentMatch = utils.memoize(function(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	});
	
	function _browserCheck(regex) {
		return function() {
			return _userAgentMatch(regex);
		};
	}
	
	utils.isFF = _browserCheck(/firefox/i);
	utils.isChrome = _browserCheck(/chrome/i);
	utils.isIPod = _browserCheck(/iP(hone|od)/i);
	utils.isIPad = _browserCheck(/iPad/i);
	utils.isSafari602 = _browserCheck(/Macintosh.*Mac OS X 10_8.*6\.0\.\d* Safari/i);
	
    utils.isIETrident = function(version) {
        if (version) {
            version = parseFloat(version).toFixed(1);
            return _userAgentMatch(new RegExp('trident/.+rv:\\s*' + version, 'i'));
        }
        return _userAgentMatch(/trident/i);
    };
    utils.isMSIE = function(version) {
        if (version) {
            version = parseFloat(version).toFixed(1);
            return _userAgentMatch(new RegExp('msie\\s*' + version, 'i'));
        }
        return _userAgentMatch(/msie/i);
    };
    utils.isIE = function(version) {
        if (version) {
            version = parseFloat(version).toFixed(1);
            if (version >= 11) {
                return utils.isIETrident(version);
            } else {
                return utils.isMSIE(version);
            }
        }
        return utils.isMSIE() || utils.isIETrident();
    };
	
    utils.isSafari = function() {
        return (_userAgentMatch(/safari/i) && !_userAgentMatch(/chrome/i) &&
            !_userAgentMatch(/chromium/i) && !_userAgentMatch(/android/i));
    };
	
    /** Matches iOS devices **/
    utils.isIOS = function(version) {
        if (version) {
            return _userAgentMatch(new RegExp('iP(hone|ad|od).+\\sOS\\s' + version, 'i'));
        }
        return _userAgentMatch(/iP(hone|ad|od)/i);
    };
	
    /** Matches Android devices **/
    utils.isAndroidNative = function(version) {
        return utils.isAndroid(version, true);
    };
	
    utils.isAndroid = function(version, excludeChrome) {
        //Android Browser appears to include a user-agent string for Chrome/18
        if (excludeChrome && _userAgentMatch(/chrome\/[123456789]/i) && !_userAgentMatch(/chrome\/18/)) {
            return false;
        }
        if (version) {
            // make sure whole number version check ends with point '.'
            if (utils.isInt(version) && !/\./.test(version)) {
                version = '' + version + '.';
            }
            return _userAgentMatch(new RegExp('Android\\s*' + version, 'i'));
        }
        return _userAgentMatch(/Android/i);
    };
	
    /** Matches iOS and Android devices **/
    utils.isMobile = function() {
        return utils.isIOS() || utils.isAndroid();
    };
	
    utils.isIframe = function() {
        return (window.frameElement && (window.frameElement.nodeName === 'IFRAME'));
    };
	
    utils.isInt = function(value) {
        return parseFloat(value) % 1 === 0;
    };
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		sheet;
	
	function createStylesheet() {
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
		return styleSheet;
	}
	
	function insertRule(sheet, text, index) {
		try {
			sheet.insertRule(text, index);
		} catch (e) {
			//console.log(e.message, text);
		}
	}
	
	var css = utils.css = function(selector, styles) {
		if (!sheet) {
			sheet = createStylesheet().sheet;
		}
		
		var _styles = '';
		utils.foreach(styles, function(style, value) {
			_styles += style + ': ' + value + '; ';
		});
		insertRule(sheet, selector + ' { ' + _styles + '}', sheet.cssRules.length);
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
		ERROR: 'ERROR',
		
		// API Events
		SLICEASE_READY: 'sliceaseReady',
		SLICEASE_RESIZE: 'sliceaseResize',
		SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		SLICEASE_RENDER_ERROR: 'sliceaseRenderError',
		
		// Render Mode Event
		SLICEASE_RENDER_MODE: 'sliceaseRenderMode',
		renderMode: {
			CANVAS: 'canvas',
			SPARE: 'spare'
		},
		
		// State Events
		SLICEASE_STATE: 'sliceaseState',
		state: {
			IDLE: 'IDLE',
			PLAYING: 'PLAYING'
		},
		
		// Item Events
		SLICEASE_ITEM_CLICK: 'sliceaseItemClick',
		
		// Timer Events
		SLICEASE_TIMER: 'sliceaseTimer',
		SLICEASE_TIMER_COMPLETE: 'sliceaseTimerComplete'
	};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	events.eventdispatcher = function(id, debug) {
		var _id = id,
			_debug = debug,
			_listeners = {},
			_globallisteners = [];
		
		this.addEventListener = function(type, listener, count) {
			try {
				if (!_listeners.hasOwnProperty(type)) {
					_listeners[type] = [];
				}
				
				if (typeof(listener) === 'string') {
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
 				if (typeof(listener) === 'string') {
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
			if (_debug) {
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
})(window.slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events;
	
	utils.timer = function(delay, repeatCount) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_intervalId,
			_currentCount = 0,
			_running = false;
		
		function _init() {
			utils.extend(_this, {
				delay: delay || 50,
				repeatCount: repeatCount || 0
			});
		}
		
		_this.start = function() {
			if (_running === false) {
				_intervalId = setInterval(_ontimer, _this.delay);
				_running = true;
			}
		};
		
		function _ontimer() {
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
(function(slicease, undefined) {
	var utils = slicease.utils,
		events = slicease.events;
	
	var _apis = [];
	var _eventMapping = {
		onError: events.ERROR,
		onReady: events.SLICEASE_READY,
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
			_this.embedder.addGlobalListener(_onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.setSlicer = function(slicer, renderMode) {
			_slicer = slicer;
			_this.renderMode = renderMode;
			
			_this.play = _slicer.play;
			_this.prev = _slicer.prev;
			_this.next = _slicer.next;
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
(function(slicease) {
	var utils = slicease.utils,
		
		timingfunction = {
		LINEAR: 'linear',
		EASE: 'ease',
		EASE_IN: 'ease-in',
		EASE_OUT: 'ease-out',
		EASE_IN_OUT: 'ease-in-out',
		ELASTIC: 'elastic',
		WAVES_IN: 'waves-in'
	};
	
	var p = function(a, b, c) {
		return { x: a || 0, y: b || 0, z: c || 0 };
	};
	
	slicease.animation = function(config) {
		var _this = this,
			_defaults = {
				properties: {},
	 			duration: 0,
	 			'timing-function': timingfunction.EASE,
	 			delay: 0,
	 			'iteration-count': 1,
	 			direction: 'normal'// alternate
			},
			_points;
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.extend(_this, _this.config);
			utils.foreach(_this.properties, function(name, property) {
				var keyframes = [];
				utils.foreach(property.keyframes, function(key, val) {
					keyframes.push({
						ratio: (key === 'from' ? 0 : (key === 'to' ? 100 : parseInt(key))) / 100,
						value: val
					});
				});
				keyframes.sort(function(a, b) {
					return a.ratio - b.ratio;
				});
				property.keyframes = keyframes;
			});
		}
		
		_this.ease = function(time, oneach) {
			var timeratio = _getTimeRatio(time);
			utils.foreach(_this.properties, function(name, property) {
				var prop = {};
				for (var i = 0; i < property.keyframes.length; i++) {
					var keyframe = property.keyframes[i];
					if (keyframe.ratio < timeratio || prop.from === undefined) {
						prop.from = keyframe.value;
						prop.to = undefined;
						prop.fr = keyframe.ratio;
					} else if (prop.to === undefined) {
						prop.to = keyframe.value;
						prop.tr = keyframe.ratio;
					}
				}
				
				if (typeof oneach === 'function') {
					if (prop.to === undefined) {
						oneach(name, prop.from);
					} else {
						var exacttimeratio = (timeratio - prop.fr) / (prop.tr - prop.fr),
							points = _getPoints(property['timing-function']),
							shrinked = _bezierShrink(points, exacttimeratio),
							valueratio = shrinked[0].y,
							finalvalue = prop.from + (prop.to - prop.from) * valueratio;
						oneach(name, finalvalue);
					}
				}
			});
		};
		
		function _getTimeRatio(time) {
			if (_this.duration === 0) {
				return 1;
			}
			if (time <= _this.delay) {
				return 0;
			}
			
			var actualtime = time - _this.delay;
			if (actualtime >= _this['iteration-count'] * _this.duration) {
				return (_this.direction === 'alternate' ? (Math.ceil(actualtime / _this.duration) % 2) : 1);
			}
			
			var ratio = (actualtime % _this.duration) / _this.duration;
			return _this.direction === 'alternate' && !(Math.ceil(actualtime / _this.duration) % 2) ? 1 - ratio : ratio;
		}
		
		function _bezierShrink(points, ratio) {
			if (!points || points.length < 2) {
				return 1;
			}
			
			var shrinked = [];
			for (var i = 1; i < points.length; i++) {
				var m = points[i - 1];
				var n = points[i];
				shrinked.push(p(m.x + (n.x - m.x) * ratio, m.y + (n.y - m.y) * ratio));
			}
			if (shrinked.length > 1) {
				shrinked = _bezierShrink(shrinked, ratio);
			}
			return shrinked;
		}
		
		function _getPoints(timingfn) {
			if (!timingfn) {
				timingfn = _this['timing-function'];
			}
			var points;
			switch (timingfn) {
				case timingfunction.LINEAR:
					points = [p(0, 0), p(1, 1)];
					break;
				case timingfunction.EASE:
					points = [p(0, 0), p(0.25, 0.1), p(0.25, 1), p(1, 1)];
					break;
				case timingfunction.EASE_IN:
					points = [p(0, 0), p(0.42, 0), p(1, 1)];
					break;
				case timingfunction.EASE_OUT:
					points = [p(0, 0), p(0.58, 1), p(1, 1)];
					break;
				case timingfunction.EASE_IN_OUT:
					points = [p(0, 0), p(0.42, 0), p(0.58, 1), p(1, 1)];
					break;
				case timingfunction.ELASTIC:
					points = [p(0, 0), p(0.5, 0.5), p(0.75, 1), p(0.85, 2), p(0.95, 1), p(0.97, 0.7), p(1, 1)];
					break;
				case timingfunction.WAVES_IN:
					points = [p(0, 0), p(0.2, -0.5), p(0.4, 0.5), p(0.6, -0.5), p(1, 1)];
					break;
				default:
					points = _points;
					break;
			}
			return points;
		}
		
		_this.setPoints = function(points) {
			_points = points;
		};
		
		_init();
	};
})(slicease);
(function(slicease) {
	slicease.core = {};
	
	var css = slicease.utils.css;
	var SE_CLASS = '.seslicer';
	
})(slicease);
(function(slicease) {
	slicease.core.renders = {};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		core = slicease.core,
		renders = core.renders;
	
	renders.imageloader = function(url, onload, onerror) {
		var _this = this,
			_img,
			_loading = false,
			_error = false;
		
		function _init() {
			_img = new Image();
			_img.onload = function() {
				_loading = false;
				if (onload  && typeof onload === 'function') {
					onload();
				}
			};
			_img.onerror = function() {
				_loading = false;
				_error = true;
				if (onerror  && typeof onerror === 'function') {
					onerror();
				}
			};
			
			_loading = true;
			_img.src = url;
		}
		
		_this.loading = function() {
			return _loading;
		};
		
		_this.error = function() {
			return _error;
		};
		
		_this.element = function() {
			return _img;
		};
		
		_init();
	};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	renders.spare = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_spare,
			_defaults = {
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			
		}
		
		_this.element = function() {
			return _spare;
		};
		
		_init();
	};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		renders = core.renders,
		css = utils.css,
		
		VIEW_CONTROLS_CONTAINER_CLASS = 'secontrols',
		PAGER_CONTAINER_CLASS = 'sepager';
	
	function p(a, b, c) {
		return { x: a || 0, y: b || 0, z: c || 0 };
	}
	
	function cuboid(width, height, origin) {
		var _this = this,
			_names,
			_points,
			_properties,
			_changed;
		
		function _init() {
			_this.width = Math.abs(width || 400);
			_this.height = Math.abs(height || 150);
			_this.origin = utils.clone(origin) || p(0, 0, 0);
			
			_names = ['a0', 'b0', 'c0', 'd0', 'a1', 'b1', 'c1', 'd1'];
			_points = {};
			
			_properties = {
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				scaleX: 1,
				scaleY: 1,
				scaleZ: 1
			};
			_changed = true;
		}
		
		_this.getPoint = function(name) {
			return _points[name];
		};
		_this.getPoints = function() {
			return _points;
		};
		
		_this.setProperty = function(name, value) {
			if (_properties[name] !== value) {
				_properties[name] = value;
				_changed = true;
			}
		};
		_this.getProperty = function(name) {
			return _properties[name];
		};
		
		_this.flush = function() {
			if (_changed) {
				for (var i = 0; i < _names.length; i++) {
					var name = _names[i];
					_points[name] = _getPoint(name);
				}
				_changed = false;
			}
		};
		
		function _getPoint(name) {
			if (!name || typeof name !== 'string') {
				return null;
			}
			
			var point = p(_this.width / 2, _this.height / 2, _this.height / 2);
			if (name.substr(1, 1) === '0') {
				point.x *= -1;
			}
			switch (name.substr(0, 1)) {
				case 'a':
					point.y *= -1;
					break;
				case 'd':
					point.y *= -1;//do not use 'break' here
				case 'c':
					point.z *= -1;
					break;
			}
			
			var rotateX = _this.getProperty('rotateX'),
				rotateY = _this.getProperty('rotateY'),
				rotateZ = _this.getProperty('rotateZ');
			if (rotateX) {
				var y = point.y * Math.cos(rotateX) - point.z * Math.sin(rotateX);
				var z = point.y * Math.sin(rotateX) + point.z * Math.cos(rotateX);
				point.y = y;
				point.z = z;
			}
			if (rotateY) {
				var x = point.z * Math.sin(rotateY) + point.x * Math.cos(rotateY);
				var z = point.z * Math.cos(rotateY) - point.x * Math.sin(rotateY);
				point.x = x;
				point.z = z;
			}
			if (rotateZ) {
				var x = point.x * Math.cos(rotateZ) - point.y * Math.sin(rotateZ);
				var y = point.x * Math.sin(rotateZ) + point.y * Math.cos(rotateZ);
				point.y = y;
				point.z = z;
			}
			
			point.x *= _this.getProperty('scaleX');
			point.y *= _this.getProperty('scaleY');
			point.z *= _this.getProperty('scaleZ');
			
			return point;
		}
		
		_init();
	}
	
	
	renders.canvas = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_defaults = {
				pieces: [7],
		 		delays: function(index, pieces, item, reverse) {
		 			return (reverse ? pieces - index - 1 : index) * (pieces > 5 ? 100 : 200);
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 1200,
		 		objectDistance: 100,
		 		startAnimation: {
		 			properties: {
		 				rotateX: { keyframes: { from: 45, to: 90 } },
		 				scaleX: { keyframes: { from: 0.9, to: 1 } },
		 				z: { keyframes: { from: -1000, to: 0 } },
		 				alpha: { keyframes: { from: 0, to: 100 } }
		 			},
		 			duration: 600,
		 			'timing-function': 'ease-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
		 		animation: [{
		 			properties: {
		 				rotateX: { keyframes: { from: 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '40%': 0.9, to: 1 }, 'timing-function': 'linear' },
		 				z: { keyframes: { from: 0, '40%': -800, '80%': 0 }, 'timing-function': 'ease-out' }
		 			},
		 			duration: 1200,
		 			'timing-function': 'elastic',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}, {
		 			properties: {
		 				rotateX: { keyframes: { from: 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '25%': 0.9, '75%': 0.9, to: 1 }, 'timing-function': 'linear' },
		 				z: { keyframes: { from: 0, '25%': -1000, '60%': -1000, to: 0 }, 'timing-function': 'ease-out' }
		 			},
		 			duration: 1200,
		 			'timing-function': 'waves-in',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}, {
		 			properties: {
		 				rotateX: { keyframes: { from: 0, '60%': 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '60%': 0.8, to: 1 }, 'timing-function': 'linear' },
		 				scaleY: { keyframes: { from: 1, '60%': 0.8, to: 1 }, 'timing-function': 'linear' },
		 				z: { keyframes: { from: 0, '80%': -400, to: 0 }, 'timing-function': 'ease-out' }
		 			},
		 			duration: 1200,
		 			'timing-function': 'ease-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}, {
		 			properties: {
		 				rotateX: { keyframes: { from: 0, to: 90 } },
		 				scaleX: { keyframes: { from: 1, '50%': 0.9, to: 1 } },
		 				z: { keyframes: { from: 0, '50%': -800, to: 0 } }
		 			},
		 			duration: 1200,
		 			'timing-function': 'ease-in-out',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		}],
		 		fps: 24,
		 		strokeStyle: 'rgb(0,0,250)',
		 		tbStyle: '#aaa',
		 		lrStyle: '#ccc'
			},
			
			_canvas, _context,
			_cvs, _ctx,
			_startanimation,
			_animations = [],
			_images = [],
			_cuboids,
			_camera,
			_previtem = -1,
			_item = -1,
			_pieceIndex = -1,
			_animationIndex = -1,
			_interval,
			_timer,
			_loaded = false,
			_reverse = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			_parseConfig();
			
			_canvas = utils.createElement('canvas');
			_canvas.style.width = slicer.model.width + 'px';
			_canvas.style.height = slicer.model.height + 'px';
			_canvas.innerHTML = '<a>Canvas not supported!</a>'
				+ '<a>Please open in a browser listed below:</a>'
				+ '<a>chrome, firefox, opera, safari</a>';
			_canvas.width = slicer.model.width;
			_canvas.height = slicer.model.height;
			_context = _canvas.getContext('2d');
			_context.strokeStyle = _this.config.strokeStyle;
			
			_cvs = utils.createElement('canvas');
			_cvs.width = _canvas.width;
			_cvs.height = _canvas.height;
			_ctx = _cvs.getContext('2d');
			
			css('.' + VIEW_CONTROLS_CONTAINER_CLASS, {
				height: _this.height + 'px',
				top: _this.config.padding.top + 'px'
			});
			
			css('.' + PAGER_CONTAINER_CLASS, {
				bottom: Math.min(- 24 - (_this.config.padding.bottom - 24) / 2, -24) + 'px'
			});
		}
		
		function _parseConfig() {
			for (var i = 0; i < slicer.model.sources.length; i++) {
				var imgloader = new renders.imageloader(slicer.model.sources[i]);
				_images.push(imgloader.element());
			}
			
			if (typeof _this.config.padding === 'string') {
				var padding = _this.config.padding.split(' ');
				if (padding.length < 2) padding.push(padding[0]);
				if (padding.length < 3) padding.push(padding[0]);
				if (padding.length < 4) padding.push(padding[1]);
				_this.config.padding = {
					top: parseInt(padding[0]),
					right: parseInt(padding[1]),
					bottom: parseInt(padding[2]),
					left: parseInt(padding[3])
				};
				_this.width = slicer.model.width - _this.config.padding.left - _this.config.padding.right;
				_this.height = slicer.model.height - _this.config.padding.top - _this.config.padding.bottom;
			}
			
			if (!config.hasOwnProperty('startAnimation') || config.startAnimation !== null) {
				_startanimation = new slicease.animation(_this.config.startAnimation);
			}
			for (var a = 0; a < _this.config.animation.length; a++) {
				_animations.push(new slicease.animation(_this.config.animation[a]));
			}
			
			_camera = p(0, 0, _this.config.objectDistance + _this.height / 2);
			_interval = Math.floor(1000 / _this.config.fps);
		}
		
		_this.play = function(item, reverse) {
			_previtem = _item < 0 ? slicer.model.sources.length - 1 : _item;
			_item = item || 0;
			
			_resetCuboids();
			_reverse = reverse || (_previtem > _item && (_previtem !== slicer.model.sources.length - 1 || _item !== 0));
			
			_animationIndex = _next(_animations, _animationIndex);
			
			if (!_timer) {
				_timer = new utils.timer(_interval);
				_timer.addEventListener(events.SLICEASE_TIMER, _draw);
			}
			_timer.reset();// in case it is drawing, & reset timer.currentCount
			_timer.start();
		};
		
		function _draw() {
			_cvs.width = _cvs.width;// clear
			
			var animation = _startanimation;
			if (_loaded || animation === undefined) {
				animation = _animations[_animationIndex];
			}
			
			var currenttime = _timer.currentCount() * _interval,
				maxdelay = 0;
			for (var i = 0; i < _cuboids.length; i++) {
				var cub = _cuboids[i],
					cubdelay = _getCuboidDelay(i),
					time = currenttime - cubdelay;
				maxdelay = Math.max(maxdelay, cubdelay);
				
				animation.ease(time, function(k, v) {
					switch (k) {
						case 'alpha':
							_ctx.globalAlpha = v / 100;
							break;
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
							cub.setProperty(k, (_reverse ? v : 360 - v) * Math.PI / 180);
							break;
						case 'scaleX':
						case 'scaleY':
						case 'scaleZ':
							cub.setProperty(k, v);
							break;
						case 'x':
						case 'y':
						case 'z':
							cub.origin[k] = v;
							break;
						default:
							utils.log('Unknown property ' + k + ', ignored.');
					}
				});
				
				cub.flush();
				var points = cub.getPoints(),
					picPoints = {};
				utils.foreach(points, function(name, point) {
					var camPoint = _object2Camera(point, cub.origin, _camera),
						picPoint;
					picPoints[name] = picPoint = _picturePoint(camPoint);
				});
				
				//_drawLines(picPoints);
				_drawTexture(picPoints, i, _cuboids.length);
			}
			
			_canvas.width = _canvas.width;
			_context.drawImage(_cvs, 0, 0, _cvs.width, _cvs.height, 0, 0, _canvas.width, _canvas.height);
			
			if (currenttime >= maxdelay + animation.delay + animation.duration) {
				_loaded = true;
				_timer.stop();
				_this.dispatchEvent(events.SLICEASE_STATE, { state: states.IDLE, item: _item });
			}
		}
		
		function _getCuboidDelay(index) {
			if (typeof _this.config.delays === 'function') {
				return _this.config.delays(index, _cuboids.length, _item, _reverse);
			} else {
				return parseInt(_this.config.delays);
			}
		}
		
		function _object2Camera(objPoint, objOrigin, camOrigin) {
			// camPoint = objPoint - vector
			// = objPoint - (camOrigin - objOrigin)
			return p(
				objPoint.x + objOrigin.x - camOrigin.x,
				objPoint.y + objOrigin.y - camOrigin.y,
				objPoint.z + objOrigin.z - camOrigin.z
			);
		}
		
		function _picturePoint(point, sightDistance) {
			if (point.z > 0) {
				return null;
			}
			
			// (x - eye.x) / (point.x - eye.x) = (y - eye.y) / (point.y - eye.y) = (z - eye.z) / (point.z - eye.z)
			var eye = p(0, 0, sightDistance || _this.config.sightDistance),
				vector = p(point.x - eye.x, point.y - eye.y, point.z - eye.z),
				delta = (0 - eye.z) / vector.z,
				point = p(vector.x * delta + eye.x, vector.y * delta + eye.y, 0);
			point.x += _this.config.padding.left + _this.width / 2;
			point.y += _this.config.padding.top + _this.height / 2;
			return point;
		}
		
		function _drawTexture(points, index, pieces) {
			var img = _images[_item],
				swidth = img.width / pieces,
				sheight = img.height,
				sx = swidth * index,
				rightSide = index >= pieces / 2;
			if (index === pieces - 1) {
				//swidth = img.width - swidth * index;
			}
			
			if (index < pieces / 2) {
				// right side
				if (pieces / 2 - index !== 0.5) {
					_fill(points.a1, points.b1, points.c1, points.d1, _this.config.lrStyle, true);
				}
				if (_reverse) {
					// top side
					if (points.a0.y > points.d0.y) {
						_fill(points.a0, points.a1, points.d1, points.d0, _this.config.tbStyle, true);
					}
				} else {
					// bottom side
					if (points.c0.y > points.b0.y) {
						_fill(points.b0, points.b1, points.c1, points.c0, _this.config.tbStyle, true);
					}
				}
				// back side
				if (points.d0.y > points.c0.y) {
					_fill(points.c0, points.c1, points.d1, points.d0, _this.config.tbStyle, true);
				}
			}
			
			if (_reverse) {
				// bottom side
				if (points.c0.y > points.b0.y) {
					_drawTriangle(img, sx, 0, swidth, sheight, points.b0, points.c0, rightSide ? points.b1 : null, rightSide ? null : points.c1, !rightSide);
					_drawTriangle(img, sx, 0, swidth, sheight, rightSide ? null : points.b0, rightSide ? points.c0 : null, points.b1, points.c1, !rightSide);
				}
				
				// front side
				if (points.b0.y > points.a0.y) {
					var imgnext = _images[_previtem];
					imgnext.width = img.width;
					imgnext.height = img.height;
					_drawTriangle(imgnext, sx, 0, swidth, sheight, points.a0, points.b0, rightSide ? null : points.a1, rightSide ? points.b1 : null, !rightSide);
					_drawTriangle(imgnext, sx, 0, swidth, sheight, rightSide ? points.a0 : null, rightSide ? null : points.b0, points.a1, points.b1, !rightSide);
				}
			} else {
				// top side
				if (points.a0.y > points.d0.y) {
					_drawTriangle(img, sx, 0, swidth, sheight, points.d0, points.a0, rightSide ? null : points.d1, rightSide ? points.a1 : null, !rightSide);
					_drawTriangle(img, sx, 0, swidth, sheight, rightSide ? points.d0 : null, rightSide ? null : points.a0, points.d1, points.a1, !rightSide);
				}
				
				// front side
				if (points.b0.y > points.a0.y) {
					var imgprev = _images[_previtem];
					imgprev.width = img.width;
					imgprev.height = img.height;
					_drawTriangle(imgprev, sx, 0, swidth, sheight, points.a0, points.b0, rightSide ? points.a1 : null, rightSide ? null : points.b1, !rightSide);
					_drawTriangle(imgprev, sx, 0, swidth, sheight, rightSide ? null : points.a0, rightSide ? points.b0 : null, points.a1, points.b1, !rightSide);
				}
			}
			
			if (index >= pieces / 2) {
				// left side
				_fill(points.a0, points.b0, points.c0, points.d0, _this.config.lrStyle, false);
				if (_reverse) {
					// top side
					if (points.a0.y > points.d0.y) {
						_fill(points.a0, points.a1, points.d1, points.d0, _this.config.tbStyle, false);
					}
				} else {
					// bottom side
					if (points.c0.y > points.b0.y) {
						_fill(points.b0, points.b1, points.c1, points.c0, _this.config.tbStyle, false);
					}
				}
				// back side
				if (points.d0.y > points.c0.y) {
					_fill(points.c0, points.c1, points.d1, points.d0, _this.config.tbStyle, false);
				}
			}
		}
		
		function _drawTriangle(img, sx, sy, swidth, sheight, a0, b0, a1, b1, sourceOver) {
			var cvs, ctx;
			cvs = utils.createElement('canvas');
			cvs.width = _canvas.width;
			cvs.height = _canvas.height;
			ctx = cvs.getContext('2d');
			
			var a, b = 0, c, d,
				e = a0 ? a0.x : b0.x + a1.x - b1.x,
				f = a0 ? a0.y : a1.y;
			
			ctx.beginPath();
			ctx.strokeStyle = _this.config.strokeStyle;
			if (a0 === null) {
				ctx.moveTo(b0.x, b0.y);
				ctx.lineTo(a1.x, a1.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (b1.x - b0.x) / swidth;
				c = (b1.x - a1.x) / sheight;
				d = (b1.y - a1.y) / sheight;
			} else if (b0 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(a1.x, a1.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (a1.x - a0.x) / swidth;
				c = (b1.x - a1.x) / sheight;
				d = (b1.y - a1.y) / sheight;
			} else if (a1 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(b0.x, b0.y);
				ctx.lineTo(b1.x, b1.y);
				
				a = (b1.x - b0.x) / swidth;
				c = (b0.x - a0.x) / sheight;
				d = (b0.y - a0.y) / sheight;
			} else if (b1 === null) {
				ctx.moveTo(a0.x, a0.y);
				ctx.lineTo(b0.x, b0.y);
				ctx.lineTo(a1.x, a1.y);
				
				a = (a1.x - a0.x) / swidth;
				c = (b0.x - a0.x) / sheight;
				d = (b0.y - a0.y) / sheight;
			}
			ctx.closePath();
			//ctx.stroke();
			ctx.clip();
			
			ctx.setTransform(a, b, c, d, e, f);
			ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
			
			_ctx.globalCompositeOperation = sourceOver ? 'source-over' : 'destination-over';
			_ctx.drawImage(cvs, 0, 0, cvs.width, cvs.height, 0, 0, _cvs.width, _cvs.height);
		}
		
		function _fill(a, b, c, d, fillStyle, sourceOver) {
			_ctx.globalCompositeOperation = sourceOver ? 'source-over' : 'destination-over';
			_ctx.beginPath();
			_ctx.moveTo(a.x, a.y);
			_ctx.lineTo(b.x, b.y);
			_ctx.lineTo(c.x, c.y);
			_ctx.lineTo(d.x, d.y);
			_ctx.lineTo(a.x, a.y);
			_ctx.fillStyle = fillStyle || '#ccc';
			_ctx.fill();
			_ctx.closePath();
		}
		
		function _drawLines(points) {
			_ctx.beginPath();
			_ctx.strokeStyle = _this.config.strokeStyle;
			_ctx.moveTo(points.a0.x, points.a0.y);
			_ctx.lineTo(points.b0.x, points.b0.y);
			_ctx.lineTo(points.c0.x, points.c0.y);
			_ctx.lineTo(points.d0.x, points.d0.y);
			_ctx.lineTo(points.a0.x, points.a0.y);
			
			_ctx.lineTo(points.a1.x, points.a1.y);
			_ctx.lineTo(points.b1.x, points.b1.y);
			_ctx.lineTo(points.c1.x, points.c1.y);
			_ctx.lineTo(points.d1.x, points.d1.y);
			_ctx.lineTo(points.a1.x, points.a1.y);
			_ctx.closePath();
			
			_ctx.moveTo(points.b0.x, points.b0.y);
			_ctx.lineTo(points.b1.x, points.b1.y);
			_ctx.moveTo(points.c0.x, points.c0.y);
			_ctx.lineTo(points.c1.x, points.c1.y);
			_ctx.moveTo(points.d0.x, points.d0.y);
			_ctx.lineTo(points.d1.x, points.d1.y);
			
			_ctx.stroke();
		}
		
		
		function _resetCuboids() {
			_pieceIndex = _next(_this.config.pieces, _pieceIndex);
			var pieces = parseInt(_this.config.pieces[_pieceIndex]);
			
			_cuboids = [];
			var wth = _this.width / pieces;
			for (var i = 0; i < pieces; i++) {
				if (i === pieces - 1) {
					//wth = _this.width - wth * i;
				}
				_cuboids.push(new cuboid(wth, _this.height, p(wth * (i + 1) - wth / 2 - _this.width / 2, 0, 0)));
			}
		}
		
		function _prev(arr, cur) {
			cur--;
			return cur < 0 ? arr.length - 1 : cur;
		}
		function _next(arr, cur) {
			cur++;
			return cur >= arr.length ? 0 : cur;
		}
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
(function(slicease) {
	slicease.core.components = {};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
	events = slicease.events,
		core = slicease.core,
		components = core.components,
		css = utils.css,
		
		DISPLAY_CONTAINER_CLASS = 'sedisplay',
		DISPLAY_PREV_CLASS = 'seprev',
		DISPLAY_NEXT_CLASS = 'senext',
		
		DISPLAY_HIDE_DELAY = 2000,
		
		HIDDEN = {
			display: 'none'
		},
		SHOWING = {
			display: 'block'
		},
		NOT_HIDDEN = {
			display: ''
		};
	
	components.display = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_display,
			_prev,
			_next,
			_defaults = {
				btnStyle: {
					width: '40px',
				 	height: '100%'
				},
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_display = utils.createElement('div', DISPLAY_CONTAINER_CLASS);
			_display.id = slicer.id + '_display';
			
			_prev = utils.createElement('div', DISPLAY_PREV_CLASS);
			_next = utils.createElement('div', DISPLAY_NEXT_CLASS);
			
			_prev.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_prev"></svg>';
			_next.innerHTML = '<svg viewBox="0 0 1024 1024"><use xlink:href="#seskin_next"></svg>';
			
			_prev.addEventListener('click', slicer.prev);
			_next.addEventListener('click', slicer.next);
			
			_display.appendChild(_prev);
			_display.appendChild(_next);
			
			_display.addEventListener('onmouseover', _onMouseOver);
			_display.addEventListener('onmouseout', _onMouseOut);
			
			css('.' + DISPLAY_PREV_CLASS + ', .' + DISPLAY_NEXT_CLASS, {
				width: _this.config.btnStyle.width,
				height: _this.config.btnStyle.height
			});
			
			css('.' + DISPLAY_PREV_CLASS + ' svg, .' + DISPLAY_NEXT_CLASS + ' svg', {
				width: '100%',
				height: _this.config.btnStyle.width
			});
		}
		
		function _onMouseOver(e) {
			slicer.runnable(false);
		}
		
		function _onMouseOut(e) {
			slicer.runnable(true);
		}
		
		_this.hide = function(immediate) {
			setTimeout(_hide, immediate ? 0 : DISPLAY_HIDE_DELAY);
		};
		function _hide() {
			css.style(_this.element(), HIDDEN);
		}
		
		_this.show = function() {
			css.style(_this.element(), SHOWING);
		};
		
		_this.element = function() {
			return _display;
		};
		
		_this.destroy = function() {
			if (_display) {
				_display.removeEventListener('onmouseover', _onMouseOver);
				_display.removeEventListener('onmouseout', _onMouseOut);
			}
		};
		
        _init();
	};
	
	css('.' + DISPLAY_CONTAINER_CLASS, {
		width: '100%',
		height: '100%',
		filter: 'Alpha(opacity=0)',
		opacity: 0
	});
	
	css('.' + DISPLAY_CONTAINER_CLASS + ':hover', {
		filter: 'Alpha(opacity=100)',
		opacity: 1
	});
	
	css('.' + DISPLAY_PREV_CLASS + ', .' + DISPLAY_NEXT_CLASS, {
		width: '40px',
		height: '100%',
		position: 'relative',
		cursor: 'pointer',
		filter: 'Alpha(opacity=30)',
		opacity: 0.3
	});
	
	css('.' + DISPLAY_PREV_CLASS, {
		'float': 'left'
	});
	css('.' + DISPLAY_NEXT_CLASS, {
		'float': 'right'
	});
	
	css('.' + DISPLAY_PREV_CLASS + ':hover, .' + DISPLAY_NEXT_CLASS + ':hover', {
		filter: 'Alpha(opacity=60)',
		opacity: 0.6
	});
	
	css('.' + DISPLAY_PREV_CLASS + ' svg, .' + DISPLAY_NEXT_CLASS + ' svg', {
		'margin-top': '-20px',
		width: '100%',
		height: '40px',
		position: 'absolute',
		top: '50%'
	});
	
	css('.' + DISPLAY_PREV_CLASS + ':hover svg, .' + DISPLAY_NEXT_CLASS + ':hover svg', {
		fill: '#0f0'
	});
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		states = events.state,
		core = slicease.core,
		components = core.components,
		css = utils.css,
		
		PAGER_CONTAINER_CLASS = 'sepager',
		
		PAGER_HIDE_DELAY = 2000,
		
		HIDDEN = {
			display: 'none'
		},
		SHOWING = {
			display: 'block'
		},
		NOT_HIDDEN = {
			display: ''
		};
	
	components.pager = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_pager,
			_span,
			_defaults = {
				btnStyle: {
					width: '24px',
				 	height: '24px',
					'font-size': '14px',
					'font-weight': 'bold',
					color: '#25292c',
					background: '#999'
				},
				visible: true
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_pager = utils.createElement('div', PAGER_CONTAINER_CLASS);
			_pager.id = slicer.id + '_pager';
			
			_span = utils.createElement('span');
			var pages = slicer.model.sources.length;
			for (var i = 0; i < pages; i++) {
				var a = utils.createElement('a');
				a.innerHTML = i + 1;
				a.addEventListener('click', (function(n) {
					return function(e) {
						_this.dispatchEvent(events.SLICEASE_STATE, { state: states.PLAYING, item: n });
					};
				})(i));
				_span.appendChild(a);
			}
			_pager.appendChild(_span);
			
			css('.' + PAGER_CONTAINER_CLASS, {
				height: _this.config.btnStyle.height
			});
			
			css('.' + PAGER_CONTAINER_CLASS + ' a', {
				width: _this.config.btnStyle.width,
				height: _this.config.btnStyle.height,
				'border-radius': _this.config.btnStyle.width / 2 + 'px',
				'line-height': _this.config.btnStyle.height,
				'font-size': _this.config.btnStyle['font-size'],
				'font-weight': _this.config.btnStyle['font-weight'],
				color: _this.config.btnStyle.color,
				background: _this.config.btnStyle.background
			});
		}
		
		_this.setActive = function(item) {
			if (_span === undefined || _span === null) {
				return;
			}
			if (item < 0 || item >= _span.childNodes.length) {
				return;
			}
			
			for (var i = 0; i < _span.childNodes.length; i++) {
				_span.childNodes[i].className = (i === item ? 'active' : '');
			}
		};
		
		_this.hide = function(immediate) {
			setTimeout(_hide, immediate ? 0 : PAGER_HIDE_DELAY);
		};
		function _hide() {
			css.style(_this.element(), HIDDEN);
		}
		
		_this.show = function() {
			css.style(_this.element(), SHOWING);
		};
		
		_this.element = function() {
			return _pager;
		};
		
		_this.destroy = function() {
			
		};
		
        _init();
	};
	
	css('.' + PAGER_CONTAINER_CLASS, {
		width: '100%',
		height: '24px',
		position: 'absolute',
		bottom: '-47px'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' span', {
		height: '100%',
		'text-align': 'center'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' a', {
		'margin-left': '10px',
		width: '24px',
		height: '24px',
		'border-radius': '12px',
		display: 'inline-block',
		'line-height': '24px',
		'font-size': '14px',
		'font-weight': 'bold',
		color: '#25292c',
		cursor: 'pointer',
		overflow: 'hidden',
		background: '#999'
	});
	
	css('.' + PAGER_CONTAINER_CLASS + ' a:hover, .' + PAGER_CONTAINER_CLASS + ' a.active', {
		background: '#ccc'
	});
})(slicease);
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
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher()),
		 	_defaults = {};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.extend(_this, {
				id: config.id,
				state: events.state.IDLE,
				item: -1
			}, _this.config);
		}
		
		_this.setState = function(state, item, reverse) {
			if (state === _this.state || item < 0 || item >= _this.sources.length) {
				return;
			}
			_this.state = state;
			_this.item = item;
			_this.dispatchEvent(events.SLICEASE_STATE, { state: state, item: item, reverse: reverse });
		};
		
		_this.getConfig = function(name) {
			return _this.config[name] || {};
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
    };
})(slicease);
(function(window) {
	var slicease = window.slicease,
		utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		states = events.state,
		embed = slicease.embed,
		core = slicease.core,
		renders = core.renders,
		components = core.components,
		skins = slicease.skins,
		css = utils.css,
		
		SLICER_CLASS = 'sewrap',
		MENU_CONTAINER_CLASS = 'semenu',
		VIEW_CONTAINER_CLASS = 'semain',
		VIEW_IMAGES_CONTAINER_CLASS = 'seimages',
		VIEW_CONTROLS_CONTAINER_CLASS = 'secontrols',
		
		// For all api instances
		SE_CSS_SMOOTH_EASE = 'opacity .25s ease',
		SE_CSS_100PCT = '100%',
		SE_CSS_ABSOLUTE = 'absolute',
		SE_CSS_IMPORTANT = ' !important',
		SE_CSS_HIDDEN = 'hidden',
		SE_CSS_NONE = 'none',
		SE_CSS_BLOCK = 'block';
	
	core.view = function(slicer, model) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_slicerWrapper,
			_menuLayer,
			_rightClickMenu,
			_container,
			_imagesLayer,
			_render,
			_controlsLayer,
			_display,
			_pager,
			_errorState = false,
			_skin;
		
		function _init() {
			_slicerWrapper = utils.createElement('div', SLICER_CLASS);
			_slicerWrapper.id = slicer.id;
			_slicerWrapper.tabIndex = 0;
			
			_this.resize(model.width, model.height);
			
			var replace = document.getElementById(slicer.id);
			replace.parentNode.replaceChild(_slicerWrapper, replace);
		}
		
		_this.setup = function() {
			_menuLayer = utils.createElement('div', MENU_CONTAINER_CLASS);
			_menuLayer.id = slicer.id + '_menu';
			_container = utils.createElement('span', VIEW_CONTAINER_CLASS);
			_container.id = slicer.id + '_view';
			
			_imagesLayer = utils.createElement('span', VIEW_IMAGES_CONTAINER_CLASS);
			_imagesLayer.id = slicer.id + '_images';
			_setupRender();
			
			_controlsLayer = utils.createElement('span', VIEW_CONTROLS_CONTAINER_CLASS);
			_controlsLayer.id = slicer.id + '_controls';
			_setupControls();
			
			_container.appendChild(_imagesLayer);
			_container.appendChild(_controlsLayer);
			
			_slicerWrapper.appendChild(_menuLayer);
			_slicerWrapper.appendChild(_container);
			
			css('.' + SLICER_CLASS, {
				width: model.width + 'px',
				height: model.height + 'px'
			});
			
			setTimeout(function() {
				_this.resize(model.width, model.height);
				_this.dispatchEvent(events.SLICEASE_READY);
			}, 0);
		};
		
		function _setupRender() {
			switch (model.renderMode) {
				case renderMode.CANVAS:
					var canvasSettings = model.getConfig('canvas');
					_this.render = _render = new renders.canvas(slicer, canvasSettings);
					break;
				case renderMode.SPARE:
					
					break;
				default:
					_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, { message: 'Unknown render mode.' });
					break;
			}
			
			if (_render) {
				_render.addEventListener(events.SLICEASE_STATE, _onState);
				_render.addEventListener(events.SLICEASE_ITEM_CLICK, _onItemClick);
				_render.addEventListener(events.SLICEASE_RENDER_ERROR, _onRenderError);
				_imagesLayer.appendChild(_render.element());
			}
		}
		
		function _onState(e) {
			_forward(e);
		}
		
		function _onItemClick(e) {
			_forward(e);
		}
		
		function _onRenderError(e) {
			_hideControls(true);
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		function _setupControls() {
			var displaySettings = model.getConfig('display'),
				pagerSettings = model.getConfig('pager');
			
			_this.display = _display = new components.display(slicer, displaySettings);
			_controlsLayer.appendChild(_display.element());
			
			_this.pager = _pager = new components.pager(slicer, pagerSettings);
			_pager.addEventListener(events.SLICEASE_STATE, _onPagerClick);
			_controlsLayer.appendChild(_pager.element());
			
			_slicerWrapper.addEventListener('keydown', _onKeyDown);
		}
		
		function _onPagerClick(e) {
			_forward(e);
		}
		
		function _onKeyDown(e) {
			if (!model.controls || e.ctrlKey || e.metaKey) {
				return true;
			}
			
			var se = slicease(slicer.id);
			switch (e.keyCode) {
				case 13: // enter
				case 32: // space
					se.play();
					break;
				case 37: // left-arrow
				case 38: // up-arrow
					se.prev();
					break;
				case 39: // right-arrow
				case 40: // down-arrow
					se.next();
					break;
				default:
					break;
			}
			
			if (/13|32|37|38|39|40/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault();
				return false;
			}
		}
		
		function _hideControls(immediate) {
			if (_display) _display.hide(immediate);
			if (_pager) _pager.hide(immediate);
		}
		
		_this.resize = function(width, height) {
			
		};
		
		_this.destroy = function() {
			if (_slicerWrapper) {
				_slicerWrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_display) {
				_display.destroy();
			}
			if (_pager) {
				_pager.destroy();
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		_init();
	};
	
	css('.' + SLICER_CLASS + ', .' + SLICER_CLASS + ' *', {
		margin: 0,
		padding: 0,
		display: 'block'
	});
	
	css('.' + SLICER_CLASS, {
		position: 'relative',
		background: '#585862'
	});
	
	css('.' + MENU_CONTAINER_CLASS + ', .' + VIEW_CONTAINER_CLASS + ', .' + VIEW_IMAGES_CONTAINER_CLASS, {
		width: '100%',
		height: '100%'
	});
	
	css('.' + MENU_CONTAINER_CLASS, {
		display: 'none'
	});
	
	css('.' + VIEW_CONTROLS_CONTAINER_CLASS, {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0
	});
})(window);
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
						view.render.play(e.item, e.reverse);
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
			_this.interrupt();
			model.setState(e.state, e.item);
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.play = function(item, reverse) {
			if (item === undefined) {
				return _this.next();
			}
			if (item < 0 || item >= model.sources.length) {
				return false;
			}
			
			_this.interrupt();
			model.setState(states.PLAYING, item, reverse);
			return true;
		};
		
		_this.prev = function() {
			var item = model.item - 1;
			return _this.play(item < 0 ? model.sources.length - 1 : item, true);
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
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.config = function(config) {
		var _defaults = {
			sources: [],
			width: 480,
			height: 270,
	 		controls: true,
	 		canvas: {},
	 		display: {},
	 		pager: {},
	 		interval: 3500,
	 		renderMode: renderMode.CANVAS,
			fallback: true
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
		renderMode = events.renderMode,
		embed = slicease.embed,
		core = slicease.core;
	
	embed.spare = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher());
		_this.renderMode = renderMode.SPARE;
		
		_this.embed = function() {
			utils.emptyElement(api.container);
			var slicer = new core.slicer(config);
			slicer.addGlobalListener(_onEvent);
			slicer.setup();
			api.setSlicer(slicer, _this.renderMode);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
        
		_this.supports = function() {
            return true;
        };
	};
})(slicease);
(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.canvas = function(api, config) {
		var _this = utils.extend(this, new embed.spare(api, config));
		_this.renderMode = renderMode.CANVAS;
		
		_this.supports = function() {
			if (utils.isMSIE() && utils.isAndroidNative()) {
				return false;
			}
			return true;
		};
	};
})(slicease);
