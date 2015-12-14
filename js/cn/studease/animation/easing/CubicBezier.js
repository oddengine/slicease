CubicBezier = function(p1, p2){
	Bezier.call(this, [P(0,0), p1, p2, P(1,1)]);
};

CubicBezier.extends(Bezier);
