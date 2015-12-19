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
		ASPECT_MODE = 'aspect',
		MENU_CONTAINER_CLASS = 'semenu',
		VIEW_CONTAINER_CLASS = 'semain',
		VIEW_IMAGES_CONTAINER_CLASS = 'seimages',
		VIEW_CONTROLS_CONTAINER_CLASS = 'secontrols',
		
		VIEW_CONTROLS_PAGER_CONTAINER_CLASS = 'sepager',
		
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
			
			if (model.aspectratio) {
				css.style(_slicerWrapper, {
					display: 'inline-block'
				});
				_slicerWrapper.className = _slicerWrapper.className.replace(SLICER_CLASS, SLICER_CLASS + ' ' + ASPECT_MODE);
			}
			
			_this.resize(model.width, model.height);
			
			var replace = document.getElementById(slicer.id);
			replace.parentNode.replaceChild(_slicerWrapper, replace);
		}
		
		_this.setup = function() {
			slicer.skin = _skin = new skins[model.skin]();
			switch (_skin.type) {
				case 'svg':
					var tag = _skin.element();
					tag.style.display = SE_CSS_NONE;
					_slicerWrapper.appendChild(tag);
					break;
				default:
					_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, { message: 'Unknown skin type.' });
					break;
			}
			
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
	
	css(SLICER_CLASS, {
		
	});
})(window);
