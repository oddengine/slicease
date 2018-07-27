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
				position: CSS_RELATIVE,
				background: '#000000'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'text-align': CSS_CENTER,
				top: '0px',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				display: CSS_NONE,
				'z-index': '1'
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
				'background-color': '#585862'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS, {
				'z-index': '4'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + PAGES_CLASS, {
				bottom: '10px',
				'line-height': '10px',
				position: CSS_ABSOLUTE,
				display: CSS_BLOCK
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
				display: CSS_NONE
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
				'z-index': '5'
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
