slicease = function() {
	if (slicease.api) {
		return slicease.api.getSlicer.apply(this, arguments);
	}
};
slicease.version = '0.0.01';
