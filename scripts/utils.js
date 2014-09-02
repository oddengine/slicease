Timer = function(){
	this.func = null;
	this.delay = 1000;
	this.repeat = -1;
	this.finalize = null;
	
	this.thisId = 0;
	this.count = 0;
	this.running = false;
};

Timer.prototype.setup = function(_func, _delay, _repeat, _finalize){
	if(_func == null || typeof _func != 'object'){
		return -1;
	}
	
	this.func = _func;
	if(_delay != null && typeof _delay == 'number'){
		this.delay = Math.abs(_delay);
	}
	this.repeat = (_repeat == null || typeof _repeat != 'number') ? -1 : _repeat; // repeat <= 0: No time limit
	if(_finalize != null && typeof _finalize == 'object'){
		this.finalize = _finalize;
	}
};

Timer.prototype.start = function(){
	if(this.running || this.thisId > 0){
		return 0;
	}
	
	if(this.repeat <= 0 || this.repeat > 0 && this.count < this.repeat){
		var _func = new Func();
		if(_func.setup(this.docheck, this) < 0){
			return -1;
		}
		
		this.thisId = setInterval(this.oncheck, this.delay, _func);
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

Timer.prototype.oncheck = function(_func){
	if(_func == null || typeof _func != 'object'){
		return;
	}
	
	_func.doit();
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
	
	if(this.finalize != null && typeof this.finalize == 'object'){
		try{
			this.finalize.doit();
		}
		catch(e){}
	}
};


Func = function(){
	this.func = null;
	this.thisArg = null;
	this.args = [];
};
	
Func.prototype.setup = function(_func, _thisArg, _args){
	if(_func == null || typeof _func != 'function'){
		return -1;
	}
	
	this.func = _func;
	this.thisArg = _thisArg;
	this.args = _args || this.args;
	
	return 0;
};

Func.prototype.doit = function(){
	if(this.func == null || typeof this.func != 'function'){
		return -1;
	}
	
	this.func.apply(this.thisArg, this.args.concat(arguments));
};
