(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.canvas = function(api) {
		var _this = utils.extend(this, new embed.spare());
		_this.renderMode = renderMode.CANVAS;
		
		/*_this.embed = function() {
			utils.emptyElement(api.container);
			var options = utils.extend({}, api.config);
			var slicer = new slicease.slicer(options);
            api.setSlicer(slicer, _this.renderMode);
        };*/
		
		_this.supports = function() {
			
			return false;
		};
	};
})(slicease);
