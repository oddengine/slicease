(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core,
		states = core.states;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {},
		 	_state = states.STOPPED;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
		}
		
		_this.setState = function(state) {
			if (state === _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.SLCIEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.getConfig = function(name) {
			return _this.config[name] || {};
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(slicease);
