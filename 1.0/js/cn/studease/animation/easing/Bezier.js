Bezier = function(points){
	this.points = points || [];
};

Bezier.prototype.ease = function(fraction){
	if(this.points.length == 0){
		return 0;
	}
	if(fraction <= 0){
		return this.points[0];
	}
	else if(fraction >= 1){
		return this.points[this.points.length-1];
	}
	
	var shrinked = this.points;
	while(shrinked.length > 1){
		shrinked = this.shrink(shrinked, fraction);
	}
	
	return shrinked[0];
};
Bezier.prototype.shrink = function(points, fraction){
	var shrinked = [];
	for(var i=1; i<points.length; i++){
		var p0 = points[i-1];
		var p1 = points[i];
		var p = P(p0.x+(p1.x-p0.x)*fraction, p0.y+(p1.y-p0.y)*fraction);
		shrinked.push(p);
	}
	
	return shrinked;
};

