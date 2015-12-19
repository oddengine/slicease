(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher()),
		 	_defaults = {
		 		sources: [],
		 		pieces: [7],
		 		delays: function(n, i) {
		 			return i * 200;
		 		},
		 		
		 		planeDistance: 800,
		 		objectDistance: 1200,
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
		 		
		 		controls: true,
		 		skin: 'default',
		 		display: {},
		 		pager: {},
		 		interval: 3500,
		 		fps: 24,
		 		strokeStyle: 'rgb(0,0,250)',
		 		sideColor: '#999999'
		 	};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.extend(_this, {
				id: config.id,
				item: 0,
				state: events.state.IDLE
			}, _this.config);
		}
		
		_this.setState = function(state) {
			_this.state = state;
			_this.dispatchEvent(events.SLICEASE_STATE, { state: state });
		};
		
		_this.setItem = function(index) {
			_this.item = index;
			_this.dispatchEvent(events.SLICEASE_ITEM, { index: index });
		};
		
		_this.getConfig = function(name) {
			return _this.config[name];
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
    };
})(slicease);
