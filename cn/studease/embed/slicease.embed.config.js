(function(slicease) {
	var utils = slicease.utils,
		events = slicease.events,
		embed = slicease.embed,
		core = slicease.core,
		renders = core.renders,
		precisions = renders.precisions,
		rendertypes = renders.types,
		skins = core.skins,
		skintypes = skins.types;
	
	embed.config = function(config) {
		var _defaults = {
			width: 640,
			height: 360,
			aspectratio: '',
			sources: [],
			range: '3-9',
			cubic: '10,4',
			distance: 12,
			interval: 5000,
			controls: true,
			debug: false,
			render: {
				name: rendertypes.DEFAULT,
				precision: precisions.HIGH_P,
				profile: [0.6, 0.6, 0.6, 1.0]
			},
			skin: {
				name: skintypes.DEFAULT
			},
			events: {
				
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(slicease);
