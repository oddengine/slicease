//load('Func.js');

Timer = function(){
	this.func = null;
	this.delay = 1000;
	this.repeat = -1;
	this.complete = null;
	
	this.thisId = 0;
	this.count = 0;
	this.running = false;
};

Timer.prototype.setup = function(func, delay, repeat, complete){
	if(func == null || typeof func != 'object'){
		return -1;
	}
	
	this.func = func;
	if(delay != null && typeof delay == 'number'){
		this.delay = Math.abs(delay);
	}
	this.repeat = (repeat == null || typeof repeat != 'number') ? -1 : repeat; // repeat <= 0: No time limit
	if(complete != null && typeof complete == 'object'){
		this.complete = complete;
	}
	
	return 0;
};

Timer.prototype.start = function(){
	if(this.running || this.thisId > 0){
		return this.thisId;
	}
	
	if(this.repeat <= 0 || this.repeat > 0 && this.count < this.repeat){
		var func = new Func();
		if(func.setup(this.docheck, this) < 0){
			return -1;
		}
		
		this.thisId = setInterval(this.oncheck, this.delay, func);
		this.running = true;
		
		return this.thisId;
	}
	
	return -1;
};

Timer.prototype.stop = function(){
	if(this.thisId <= 0){
		return;
	}
	
	clearInterval(this.thisId);
	this.thisId = 0;
	this.running = false;
};

Timer.prototype.reset = function(){
	this.stop();
	this.count = 0;
};

Timer.prototype.oncheck = function(func){
	if(func == null || typeof func != 'object'){
		return;
	}
	
	func.doit();
};
Timer.prototype.docheck = function(){
	if(this.repeat > 0 && this.count >= this.repeat){
		this.stop();
		return;
	}
	
	this.count++;
	
	try{
		this.func.doit();
	}
	catch(e){
		this.stop();
	}
	
	if(this.repeat > 0 && this.count >= this.repeat){
		this.stop();
	}
	
	if(this.complete != null && typeof this.complete == 'object'){
		try{
			this.complete.doit();
		}
		catch(e){}
	}
};
