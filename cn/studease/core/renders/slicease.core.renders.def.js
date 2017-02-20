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
			+ 'attribute vec3 aVertexNormal;'
			
			+ 'uniform mat4 uModelViewMatrix;'
			+ 'uniform mat4 uProjectionMatrix;'
			+ 'uniform mat4 uNormalMatrix;'
			
			+ 'varying [precision] vec4 vVertexColor;'
			+ 'varying [precision] vec2 vTextureCoord;'
			+ 'varying [precision] vec3 vLighting;'
			
			+ 'void main() {'
			+ ' gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);'
			+ ' vVertexColor = aVertexColor;'
			+ ' vTextureCoord = aTextureCoord;'
			+ '}';
	
	var FRAGMENT_SHADER_SOURCE = ''
			+ 'varying [precision] vec4 vVertexColor;'
			+ 'varying [precision] vec2 vTextureCoord;'
			+ 'uniform bool uUseTextures;'
			+ 'uniform sampler2D uSampler;'
			
			+ 'void main() {'
			+ ' if (uUseTextures) {'
			+ '  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));'
			+ ' } else {'
			+ '  gl_FragColor = vVertexColor;'
			+ ' }'
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
			_avertexNormal,
			_aVertexColor,
			_aTextureCoord,
			_verticesBuffer,
			_verticesColorsBuffer,
			_verticesTextureCoordBuffer,
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
		}
		
		function _initBuffers() {
			_verticesBuffer = _webgl.createBuffer();
			_verticesColorsBuffer = _webgl.createBuffer();
			_verticesTextureCoordBuffer = _webgl.createBuffer();
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
			_animationZ.config.delay = _animationR.config.delay = index * 200;
			var x = (1 - total + index * 2) * width;
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
			
			_webgl.bindTexture(_webgl.TEXTURE_2D, null);
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
