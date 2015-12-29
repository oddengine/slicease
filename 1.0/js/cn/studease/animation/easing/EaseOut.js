EaseOut = function(){
	CubicBezier.call(this, P(0,0), P(0.58,1));
};

EaseOut.extends(CubicBezier);
