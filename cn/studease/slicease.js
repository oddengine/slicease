slicease = function() {
	if (slicease.api) {
		return slicease.api.getSlicer.apply(this, arguments);
	}
};
slicease.version = '2.0.06';
