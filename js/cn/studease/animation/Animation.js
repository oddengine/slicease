Animation = function(duration, startValue, endValue, params){
	//Params
	this.duration = duration || 1200;
	this.startValue = startValue || 0;
	this.endValue = endValue || 1;
	
	//Available settings
	this.timingFunction = TimingFunction.EASE;
	
	this.repeatCount = 0; //repeat < 0: No time limit
	this.repeatBehavior = RepeatBehavior.LOOP;
	this.complete = null;
	
	this.repeatDelay = 0;
	this.startDelay = 0;
	
	this.unitValue = this.endValue - this.startValue;
	this.easing = null;
	
	//Runtime args
	this.currentCount = 0;
	
	//Init
	this.setup(params);
};

Animation.prototype.setup = function(params){
	if(params == null || typeof params != 'object'){
		return -1;
	}
	
	for(var k in params){
		if(this.hasOwnProperty(k) == false){
			continue;
		}
		
		this[k] = params[k];
	}
	
	return 0;
};

Animation.prototype.ease = function(time){
	if(this.easing == null){
		switch(this.timingFunction){
			case TimingFunction.LINEAR:
				this.easing = new Linear();
			break;
			case TimingFunction.EASE:
				this.easing = new Ease();
			break;
			case TimingFunction.EASE_IN:
				this.easing = new EaseIn();
			break;
			case TimingFunction.EASE_OUT:
				this.easing = new EaseOut();
			break;
			case TimingFunction.EASE_IN_OUT:
				this.easing = new EaseInOut();
			break;
			default:
				
		}
	}
	
	if(this.easing == null){
		return 0;
	}
	
	var eased = this.easing.ease(time/this.duration).y;
	
	if(time >= this.duration && this.complete != null){
		this.complete.doit();
	}
	
	return this.startValue + this.unitValue * eased;
};


