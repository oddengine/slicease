Elastic = function(){
	Bezier.call(this, [P(0,0), P(0.5,0.5), P(0.75,1), P(0.85,2), P(0.95,1), P(0.97,0.5), P(1,1)]);
};

Elastic.extends(Bezier);
