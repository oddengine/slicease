(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.config = function(config) {
		var _defaults = {
			renderMode: renderMode.CANVAS,
			fallback: true,
			width: 480,
			height: 270,
			aspectratio: ''
		},
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(slicease);
