EaseIn = function(){
	CubicBezier.call(this, P(0.42,0), P(1,1));
};

EaseIn.extends(CubicBezier);
