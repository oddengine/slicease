Function.prototype.extends = function(__super__){
	if(typeof __super__ !== 'function'){
		throw new Error('fatal error: Function.prototype.extends expects a constructor of class.');
	}
	
	var func = function(){};
	func.prototype = __super__.prototype;
	this.prototype = new func();
	this.prototype.constructor = this;
	this.__super__ = __super__;
	
	return this;
};
