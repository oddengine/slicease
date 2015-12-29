(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		core = slicease.core;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher()),
		 	_defaults = {};
		
		function _init() {
			_this.config = utils.deepExtend({}, _defaults, config);
			utils.extend(_this, {
				id: config.id,
				state: events.state.IDLE,
				item: -1
			}, _this.config);
		}
		
		_this.setState = function(state, item, reverse) {
			if (state === _this.state || item < 0 || item >= _this.sources.length) {
				return;
			}
			_this.state = state;
			_this.item = item;
			_this.dispatchEvent(events.SLICEASE_STATE, { state: state, item: item, reverse: reverse });
		};
		
		_this.getConfig = function(name) {
			return _this.config[name] || {};
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
    };
})(slicease);
