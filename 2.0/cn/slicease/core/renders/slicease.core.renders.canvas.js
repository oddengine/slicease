(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		renders = core.renders,
		css = utils.css;
	
	renders.canvas = function(slicer, config) {
		var _this = utils.extend(this, new events.eventdispatcher()),
			_canvas,
			_defaults = {
				pieces: [7],
		 		delays: function(i, n) {
		 			return i * 200;
		 		},
		 		padding: '50px 40px 70px',
		 		sightDistance: 800,
		 		easeInAnimation: {
		 			keyframes: {
		 				'0%': { angle: 45, z: 800, alpha: 0 },
		 				'80%': { angle: 90 },
		 				'100%': { z: 0, alpha: 100 }
		 			},
		 			duration: 600,
		 			'timing-function': 'ease',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
		 		animation: {
		 			keyframes: {
		 				'from': { angle: 45, z: 800 },
		 				'to': { angle: 90, z: 0 }
		 			},
		 			duration: 1200,
		 			'timing-function': 'elastic',
		 			delay: 0,
		 			'iteration-count': 1,
		 			direction: 'normal'
		 		},
		 		fps: 24,
		 		strokeStyle: 'rgb(0,0,250)',
		 		sideColor: '#999999'
			};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			
			_canvas = utils.createElement('canvas');
			_canvas.style.width = slicer.model.width;
			_canvas.style.height = slicer.model.height;
			_canvas.innerText = 'Canvas not supported!';
		}
		
		_this.play = function(item) {
			if (item === undefined) {
				return false;
			}
			
			
		};
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
