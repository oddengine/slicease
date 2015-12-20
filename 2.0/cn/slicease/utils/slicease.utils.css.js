(function(slicease) {
	var utils = slicease.utils,
		sheet = createStylesheet().sheet;
	
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
