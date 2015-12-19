(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed,
		core = slicease.core;
	
	embed.spare = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher());
		_this.renderMode = renderMode.SPARE;
		
		_this.embed = function() {
			utils.emptyElement(api.container);
			var slicer = new core.slicer(config);
			slicer.addEventListener(events.SLICEASE_SETUP_ERROR, _onSetupError);
			slicer.setup();
            api.setSlicer(slicer, _this.renderMode);
        };
        
        function _onSetupError(e) {
        	_this.dispatchEvent(events.SLICEASE_SETUP_ERROR, e);
        }
        
		_this.supports = function() {
            return true;
        };
	};
})(slicease);
