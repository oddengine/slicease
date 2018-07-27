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
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_renderLayer,
			_controlsLayer,
			_contextmenuLayer,
			_controlbar,
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
