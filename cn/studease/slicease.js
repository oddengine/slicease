slicease = function() {
	if (slicease.api) {
		return slicease.api.getInstance.apply(this, arguments);
	}
};

slicease.version = '3.0.03';
