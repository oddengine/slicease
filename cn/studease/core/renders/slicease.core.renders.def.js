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
			+ 'attribute vec2 aTextureCoord;'
			+ 'uniform mat4 uModelViewMatrix;'
			+ 'uniform mat4 uProjectionMatrix;'
			+ 'varying [precision] vec2 vTextureCoord;'
			
			+ 'void main() {'
			+ ' gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);'
			+ ' vTextureCoord = aTextureCoord;'
			+ '}';
	
	var FRAGMENT_SHADER_SOURCE = ''
			+ 'varying [precision] vec2 vTextureCoord;'
			+ 'uniform sampler2D uSampler;'
			
			+ 'void main() {'
			+ ' gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));'
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
			_animationZ,
			_animationR,
			
			_canvas,
			_webgl,
			_shaderProgram,
			_fragmentShader,
			_vertexShader,
			_aVertexPosition,
			_aTextureCoord,
			_verticesBuffer,
			_verticesTextureCoordBuffer,
			_verticesIndexBuffer;
		
		function _init() {
			_this.name = rendermodes.DEFAULT;
			
			_this.config = utils.extend({}, _defaults, config);
			
			VERTEX_SHADER_SOURCE = VERTEX_SHADER_SOURCE.replace(/\[precision\]/, _this.config.precision);
			FRAGMENT_SHADER_SOURCE = FRAGMENT_SHADER_SOURCE.replace(/\[precision\]/, _this.config.precision);
			
			_loader = new utils.imageloader();
			_loader.addEventListener(events.SLICEASE_COMPLETE, _onLoaderComplete);
			_loader.addEventListener(events.ERROR, _onLoaderError);
			
			_animationZ = new animation({
				duration: 600,
				timingfunction: animation.timingfunctions.EASE_OUT,
				iterationcount: 2,
				direction: animation.directions.ALTERNATE
			});
			
			_animationR = new animation({
				duration: 1200,
				timingfunction: animation.timingfunctions.EASE_IN_OUT
			});
			
			_canvas = utils.createElement('canvas');
			_canvas.innerHTML = '<a>Canvas not supported! </a>'
					+ '<a>Please open in a browser listed below: </a>'
					+ '<a>Chrome, Firefox, Opera, Safari, Edge, 360.</a>';
			_canvas.width = _this.config.width;
			_canvas.height = _this.config.height;
			
			_webgl = _canvas.getContext("webgl") || _canvas.getContext("experimental-webgl");
			_webgl.viewport(0, 0, _canvas.width, _canvas.height);
			_webgl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
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
			
			_aTextureCoord = _webgl.getAttribLocation(_shaderProgram, "aTextureCoord");
			_webgl.enableVertexAttribArray(_aTextureCoord);
		}
		
		function _initBuffers() {
			_verticesBuffer = _webgl.createBuffer();
			_verticesTextureCoordBuffer = _webgl.createBuffer();
			_verticesIndexBuffer = _webgl.createBuffer();
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
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesIndexBuffer);
			_webgl.bufferData(_webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), _webgl.STATIC_DRAW);
			
			var curr;
			if (_oldIndex >= 0) {
				curr = _webgl['TEXTURE' + _oldIndex];
				_webgl.activeTexture(curr);
				_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_oldIndex]);
				_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _oldIndex);
			}
			
			var next = _webgl['TEXTURE' + _newIndex];
			_webgl.activeTexture(next);
			_webgl.bindTexture(_webgl.TEXTURE_2D, _textures[_newIndex]);
			_webgl.uniform1i(_webgl.getUniformLocation(_shaderProgram, "uSampler"), _newIndex);
			
			_webgl.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, _verticesIndexBuffer);
			
			_animationZ.config.delay = _animationR.config.delay = index * 200;
			var x = (1 - total + index * 2) * wth;
			var z = _animationZ.ease(_timer.currentCount() * _timer.delay) * -10;
			var r = _animationR.ease(_timer.currentCount() * _timer.delay) * Math.PI / 2;
			
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
			
			_webgl.drawElements(_webgl.TRIANGLES, 36, _webgl.UNSIGNED_SHORT, 0);
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
			
			if (_newIndex == 2) {
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
			_pieces = _range[0] + Math.round(Math.random() * (_range[1] - _range[0]));
			
			_this.dispatchEvent(events.SLICEASE_RENDER_UPDATE_START, { pieces: _pieces });
			
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
			
			if (_timer.currentCount() * _timer.delay >= 1200 + (_pieces - 1) * 200) {
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
