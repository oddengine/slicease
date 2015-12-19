(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.canvas = function(api, config) {
		var _this = utils.extend(this, new embed.spare(api, config));
		_this.renderMode = renderMode.CANVAS;
		
		_this.supports = function() {
			if (utils.isMSIE() && utils.isAndroidNative()) {
				return false;
			}
			return true;
		};
	};
})(slicease);
