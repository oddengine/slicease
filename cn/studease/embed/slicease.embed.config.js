(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		embed = slicease.embed,
		core = slicease.core,
		renders = core.renders,
		precisions = renders.precisions,
		rendermodes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			width: 640,
			height: 360,
			sources: [],
			range: '3-9',
			controls: true,
			interval: 5000,
			render: {
				name: rendermodes.DEFAULT,
				precision: precisions.HIGH_P,
				profile: [0.6, 0.6, 0.6, 1.0]
			},
			skin: {
				name: skinmodes.DEFAULT
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(slicease);
