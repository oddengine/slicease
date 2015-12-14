(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.spare = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher());
		_this.renderMode = renderMode.SPARE;
		
		_this.embed = function() {
			utils.emptyElement(api.container);
			var options = utils.extend({}, api.config);
			var slicer = new slicease.slicer(options);
            api.setSlicer(slicer, _this.renderMode);
        };
		
		_this.supports = function() {
            return true;
        };
	};
})(slicease);
