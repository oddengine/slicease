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
