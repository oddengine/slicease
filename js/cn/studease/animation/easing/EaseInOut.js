EaseInOut = function(){
	CubicBezier.call(this, P(0.42,0), P(0.58,1));
};

EaseInOut.extends(CubicBezier);
