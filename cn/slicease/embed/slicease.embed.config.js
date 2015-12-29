(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		renderMode = events.renderMode,
		embed = slicease.embed;
	
	embed.config = function(config) {
		var _defaults = {
			sources: [],
			width: 480,
			height: 270,
	 		controls: true,
	 		canvas: {},
	 		display: {},
	 		pager: {},
	 		interval: 3500,
	 		renderMode: renderMode.CANVAS,
			fallback: true
		},
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(slicease);
