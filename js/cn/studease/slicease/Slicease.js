Slicease = function(params){
	//Necessary seetings
	this.canvas_id = '';
	this.images = [];
	
	//Available settings
	this.padding = [50, 0, 70, 0];
	this.pieces = [];
	this.delays = [];
	
	this.duration = 1200;
	this.easing_load_r = null;
	this.easing_load_z = null;
	this.easing_load_a = null;
	this.easing_r = null;
	this.easing_z = null
	
	this.interval = 5000;
	this.fps = 30;
	this.screen_z = 700;
	this.object_z = 800;
	
	this.mark_func = null;
	this.strokeStyle = 'rgb(0,0,250)';
	this.sideColor = '#999999';
	
	//Runtime params
	this.canvas = null;
	this.context = null;
	this.ocan = null;
	this.octx = null;
	this.tcan = null;
	this.tctx = null;
	
	this.width = 0;
	this.height = 0;
	this.radius = 0;
	
	this.points = [];
	this.img_c = -1;
	this.img_p = -1;
	this.img_n = 0;
	
	this.interval_draw = 50;
	this.ready = false;
	this.running = false;
	this.playing = false;
	this.direction = -1;// scroll down: 0, scroll up: -1
	this.timer = null;
	this.timer_draw = null;
	
	this.setup(params);
};

Slicease.prototype.setup = function(params){
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

Slicease.prototype.init = function(){
	if(this.ready == true || this.canvas_id == '' || this.images.length == 0){
		return -1;
	}
	
	this.canvas = document.getElementById(this.canvas_id);
	if(this.canvas == null){
		return -1;
	}
	this.context = canvas.getContext('2d');
	this.context.strokeStyle = this.strokeStyle;
	
	this.ocan = document.createElement('canvas');
	this.ocan.width = this.canvas.width;
	this.ocan.height = this.canvas.height;
	this.octx = this.ocan.getContext('2d');
	
	this.tcan = document.createElement('canvas');
	this.tcan.width = this.canvas.width;
	this.tcan.height = this.canvas.height;
	this.tctx = this.tcan.getContext('2d');
	
	if(this.padding.length < 4){
		var padding = [50, 0, 70, 0];
		for(var i=this.padding.length-1; i<4; i++){
			this.padding[i] = padding[i];
		}
	}
	this.width = this.canvas.width - this.padding[1] - this.padding[3];
	this.height = this.canvas.height - this.padding[0] - this.padding[2];
	this.radius = this.height * Math.SQRT1_2;
	
	if(this.pieces.length == 0){
		this.pieces[0] = 5;
	}
	var last_p = this.pieces[this.pieces.length-1];
	for(var p=this.pieces.length; p<this.images.length; p++){
		this.pieces.push(last_p);
	}
	
	for(var d=this.delays.length; d<this.images.length; d++){
		if(this.pieces[d] == 1){
			this.delays.push(0);
			continue;
		}
		var delay = Math.ceil(this.fps * 0.6 / (this.pieces[d]-1));
		this.delays.push(delay);
	}
	
	if(this.easing_load_r == null){
		this.easing_load_r = new Animation(this.duration/2, 45, 90);
	}
	if(this.easing_load_z == null){
		this.easing_load_z = new Animation(this.duration/2, this.object_z+500, this.object_z);
	}
	if(this.easing_load_a == null){
		this.easing_load_a = new Animation(this.duration/2, 0, 100);
	}
	if(this.easing_r == null){
		this.easing_r = new Animation(this.duration, 0, 90);
	}
	if(this.easing_z == null){
		var es_z = new Bezier([P(0,0), P(0.45,0.8), P(0.55,0.8), P(0,0)]);
		var ani_z = new Animation(this.duration, this.object_z, this.object_z);
		ani_z.setup({unitValue:500/(2/3), easing:es_z});
		this.easing_z = ani_z;
	}
	
	this.ready = true;
	return 0;
};

Slicease.prototype.startWaiting = function(){
	if(this.ready == false){
		return -1;
	}
	
	if(this.timer == null){
		var func = new Func();
		func.setup(this.play, this);
		
		this.timer = new Timer();
		this.timer.setup(func, this.interval);
	}
	
	this.timer.reset();
	var started = this.timer.start();
	if(started >= 0){
		this.running = true;
	}
	
	return started;
};

Slicease.prototype.play = function(index, direction){
	if(this.ready == false || this.playing == true || index != null && (index >= this.images.length || index < 0)){
		return -1;
	}
	
	if(this.timer != null){
		this.timer.reset();
	}
	
	if(index != null && (index < this.img_c 
		|| this.img_c == 0 && index == this.images.length-1 && direction != null && direction < 0)){
		this.direction = -1;
	}
	else{
		this.direction = 0;
	}
	
	this.img_p = this.img_c<0 ? this.images.length-1 : this.img_c;
	this.img_c = index==null ? (this.img_c==this.images.length-1 ? 0: this.img_c+1) : index;
	this.img_n = this.direction>=0 ? (this.img_c==this.images.length-1 ? 0: this.img_c+1) : (this.img_c==0 ? this.images.length-1: this.img_c-1);
	
	this.points = [];
	var pieces = this.pieces[this.img_c];
	for(var i=0; i<=pieces; i++){
		var pw = Math.floor(this.width / pieces);
		
		var ax = bx = cx = dx = i==pieces ? this.width/2 : (i*pw-this.width/2);
		var by = cy = this.height / 2;
		var ay = dy = -by;
		var az = bz = this.object_z;
		var cz = dz = az + this.height;
		
		var sideface = {a:P(ax,ay,az), b:P(bx,by,bz), c:P(cx,cy,cz), d:P(dx,dy,dz)};
		this.points[i] = sideface;
	}
	
	this.startDrawing();
	
	if(this.mark_func != null){
		this.mark_func.doit(this.img_c);
	}
	
	return this.img_c;
};
Slicease.prototype.prev = function(){
	var indx = this.img_c==0 ? this.images.length-1 : this.img_c-1;
	return this.play(indx, -1);
};

Slicease.prototype.startDrawing = function(){
	if(this.ready == false){
		return -1;
	}
	
	if(this.timer_draw == null){
		this.interval_draw = Math.round(1000 / this.fps);
		
		var func = new Func();
		func.setup(this.draw, this);
		
		this.timer_draw = new Timer();
		this.timer_draw.setup(func, this.interval_draw);
	}
	
	var started = this.timer_draw.start();
	if(started >= 0){
		this.playing = true;
	}
	
	return started;
}

Slicease.prototype.onDrew = function(){
	if(this.timer_draw != null){
		this.timer_draw.reset();
	}
	this.playing = false;
	
	this.startWaiting();
};

Slicease.prototype.draw = function(){
	this.tcan.width = this.tcan.width;
	
	for(var i=0; i<this.pieces[this.img_c]; i++){
		var time = (this.timer_draw.count - this.delays[this.img_c] * i) * this.interval_draw;
		var eased_r, eased_z, eased_a;
		if(this.running == true){
			eased_r = this.easing_r.ease(time);
			eased_z = this.easing_z.ease(time);
			
			if(i == this.pieces[this.img_c]-1 && time >= this.easing_r.duration && time >= this.easing_z.duration){
				this.onDrew();
			}
		}
		else{
			eased_r = this.easing_load_r.ease(time);
			eased_z = this.easing_load_z.ease(time);
			eased_a = this.easing_load_a.ease(time);
			
			if(i == this.pieces[this.img_c]-1 && time >= this.easing_load_r.duration
				&& time >= this.easing_load_z.duration && time >= this.easing_load_a.duration){
				this.onDrew();
			}
			
			this.tctx.globalAlpha = eased_a / 100;
		}
		
		if(this.direction < 0){
			eased_r *= -1;
		}
		
		var ar = this.toRadian(eased_r + 135);
		var br = this.toRadian(eased_r + 225);
		var cr = this.toRadian(eased_r + 315);
		var dr = this.toRadian(eased_r + 45);
		
		var s0 = this.points[i];
		var s1 = this.points[i+1];
		var x0 = s0.a.x;
		var x1 = s1.a.x;
		
		var ay = this.getY(ar);
		var by = this.getY(br);
		var cy = this.getY(cr);
		var dy = this.getY(dr);
		
		var az = this.getZ(ar, eased_z);
		var bz = this.getZ(br, eased_z);
		var cz = this.getZ(cr, eased_z);
		var dz = this.getZ(dr, eased_z);
		
		
		var atx0 = this.transX(x0, az);
		var btx0 = this.transX(x0, bz);
		var ctx0 = this.transX(x0, cz);
		var dtx0 = this.transX(x0, dz);
		
		var atx1 = this.transX(x1, az);
		var btx1 = this.transX(x1, bz);
		var ctx1 = this.transX(x1, cz);
		var dtx1 = this.transX(x1, dz);
		
		var aty0 = this.transY(ay, az);
		var bty0 = this.transY(by, bz);
		var cty0 = this.transY(cy, cz);
		var dty0 = this.transY(dy, dz);
		
		var aty1 = this.transY(ay, az);
		var bty1 = this.transY(by, bz);
		var cty1 = this.transY(cy, cz);
		var dty1 = this.transY(dy, dz);
		
		
		this.tctx.beginPath();
		this.tctx.strokeStyle = this.strokeStyle;
		this.tctx.moveTo(atx0, aty0);
		this.tctx.lineTo(btx0, bty0);
		this.tctx.lineTo(ctx0, cty0);
		this.tctx.lineTo(dtx0, dty0);
		this.tctx.lineTo(atx0, aty0);
		this.tctx.fillStyle = this.sideColor;
		this.tctx.fill();
		this.tctx.closePath();
		
		this.tctx.moveTo(atx0, aty0);
		this.tctx.lineTo(atx1, aty1);
		this.tctx.moveTo(btx0, bty0);
		this.tctx.lineTo(btx1, bty1);
		this.tctx.moveTo(ctx0, cty0);
		this.tctx.lineTo(ctx1, cty1);
		this.tctx.moveTo(dtx0, dty0);
		this.tctx.lineTo(dtx1, dty1);
		
		this.tctx.moveTo(ctx1, cty1);
		this.tctx.lineTo(dtx0, dty0);
		this.tctx.moveTo(dtx1, dty1);
		this.tctx.lineTo(atx0, aty0);
		this.tctx.lineTo(btx1, bty1);
		this.tctx.moveTo(btx0, bty0);
		this.tctx.lineTo(ctx1, cty1);
		
		var pieces = this.pieces[this.img_c];
		var below = i < this.pieces[this.img_c]/2 ? 0 : 1;
		
		//back side
		if(cty0 < dty0){
			var img = new Image();
			img.src = this.images[this.img_n];
			var pw = Math.floor(img.width / pieces);
			
			this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, P(ctx0,cty0), P(dtx0,dty0), null, P(ctx1,cty1), below);
			this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, null, P(dtx0,dty0), P(dtx1,dty1), P(ctx1,cty1), below);
		}
		if(this.direction >= 0){
			//top side
			if(dty0 < aty0){
				var img = new Image();
				img.src = this.images[this.img_c];
				var pw = Math.floor(img.width / pieces);
				
				this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, P(dtx0,dty0), P(atx0,aty0), null, P(dtx1,dty1), below);
				this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, null, P(atx0,aty0), P(atx1,aty1), P(dtx1,dty1), below);
			}
		}
		else{
			//bottom side
			if(bty0 < cty0){
				var img = new Image();
				img.src = this.images[this.img_c];
				var pw = Math.floor(img.width / pieces);
				
				this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, P(btx0,bty0), P(ctx0,cty0), P(ctx1,cty1), null, below);
				this.transform(img, i*pw, 0, i==pieces?img.width-i*pw:pw, img.height, P(btx0,bty0), null, P(ctx1,cty1), P(btx1,bty1), below);
			}
		}
		//front side
		if(aty0 < bty0){
			var img = new Image();
			img.src = this.images[this.img_p];
			var pw = Math.floor(img.width / pieces);
			
			this.transform(img, i*pw, 0, pw, i==pieces?img.width-i*pw:img.height, P(atx0,aty0), P(btx0,bty0), P(btx1,bty1), null, below);
			this.transform(img, i*pw, 0, pw, i==pieces?img.width-i*pw:img.height, P(atx0,aty0), null, P(btx1,bty1), P(atx1,aty1), below);
		}
		
		this.tctx.globalCompositeOperation = "destination-over";
		this.tctx.beginPath();
		this.tctx.moveTo(atx1, aty1);
		this.tctx.lineTo(btx1, bty1);
		this.tctx.lineTo(ctx1, cty1);
		this.tctx.lineTo(dtx1, dty1);
		this.tctx.lineTo(atx1, aty1);
		this.tctx.fillStyle = this.sideColor;
		this.tctx.fill();
		this.tctx.closePath();
		
		//this.tctx.stroke();
	}
	
	this.canvas.width = this.canvas.width;
	this.context.drawImage(this.tcan, 0, 0, this.tcan.width, this.tcan.height, 0, 0, this.canvas.width, this.canvas.height);
};
Slicease.prototype.toRadian = function(angle){
	var ag = (angle % 360) * Math.PI / 180;
	return ag;
};
Slicease.prototype.getY = function(radian){
	var y = - Math.floor(this.radius * Math.sin(radian));
	return y;
};
Slicease.prototype.getZ = function(radian, z){
	var z = Math.floor(this.radius * Math.cos(radian)) + this.height/2 + z;
	return z;
};
Slicease.prototype.transX = function(x, z){
	var _x = x / z * this.screen_z + this.width/2;
	var sw = this.width * this.screen_z / this.object_z;
	_x = Math.floor((_x - (this.width-sw)/2) / sw * this.width + this.padding[3]);
	return _x;
};
Slicease.prototype.transY = function(y, z){
	var _y = Math.floor(y / z * this.screen_z) + this.height/2;
	var sh = this.height * this.screen_z / this.object_z;
	_y = Math.floor((_y - (this.height-sh)/2) / sh * this.height + this.padding[0]);
	return _y;
};

Slicease.prototype.transform = function(image, imgX, imgY, rectW, rectH, p1, p2, p3, p4, below){
	if(this.ocan == null || this.octx == null){
		return -1;
	}
	
	var rect = {};
	var a, c, d;
	
	this.ocan.width = this.ocan.width;
	this.octx.beginPath();
	if(p1 == null){
		a = (p3.x - p2.x) / rectW;
		c = (p3.x - p4.x) / rectH;
		d = (p3.y - p4.y) / rectH;
		
		rect.x = Math.abs(p3.x - p4.x);
		rect.y = p4.y;
		
		this.octx.moveTo(p4.x-(p4.x-(p3.x-p2.x))+rect.x, 0);
		this.octx.lineTo(p2.x-(p4.x-(p3.x-p2.x))+rect.x, p2.y-p4.y);
		this.octx.lineTo(p3.x-(p4.x-(p3.x-p2.x))+rect.x, p3.y-p4.y);
		
		rect.x = p4.x - (p3.x-p2.x) - rect.x;
	}
	else if(p2 == null){
		a = (p4.x - p1.x) / rectW;
		c = (p3.x - p4.x) / rectH;
		d = (p3.y - p4.y) / rectH;
		
		rect.x = Math.abs(p3.x - p4.x);
		rect.y = p1.y;
		
		this.octx.moveTo(rect.x, 0);
		this.octx.lineTo((p3.x-p1.x)+rect.x, p3.y-p1.y);
		this.octx.lineTo((p4.x-p1.x)+rect.x, p4.y-p1.y);
		
		rect.x = p1.x - rect.x;
	}
	else if(p3 == null){
		a = (p4.x - p1.x) / rectW;
		c = (p2.x - p1.x) / rectH;
		d = (p2.y - p1.y) / rectH;
		
		rect.x = Math.abs(p2.x - p1.x);
		rect.y = p1.y;
		
		this.octx.moveTo(rect.x, 0);
		this.octx.lineTo((p2.x-p1.x)+rect.x, p2.y-p1.y);
		this.octx.lineTo((p4.x-p1.x)+rect.x, p4.y-p1.y);
		
		rect.x = p1.x - rect.x;
	}
	else if(p4 == null){
		a = (p3.x - p2.x) / rectW;
		c = (p2.x - p1.x) / rectH;
		d = (p2.y - p1.y) / rectH;
		
		rect.x = Math.abs(p2.x - p1.x);
		rect.y = p1.y;
		
		this.octx.moveTo(rect.x, 0);
		this.octx.lineTo((p2.x-p1.x)+rect.x, p2.y-p1.y);
		this.octx.lineTo((p3.x-p1.x)+rect.x, p3.y-p1.y);
		
		rect.x = p1.x - rect.x;
	}
	this.octx.closePath();
	this.octx.clip();
	
	this.octx.setTransform(a, 0, c, d, 0, 0);
	this.octx.drawImage(image, imgX, imgY, rectW, rectH, rectH*Math.abs(c)/Math.abs(a), 0, rectW, rectH);
	if(below == 1){
		this.tctx.globalCompositeOperation = "destination-over";
	}
	else{
		this.tctx.globalCompositeOperation = "source-over";
	}
	this.tctx.drawImage(this.ocan, 0, 0, this.ocan.width, this.ocan.height, rect.x, rect.y, this.tcan.width, this.tcan.height);
	
	return 0;
};
