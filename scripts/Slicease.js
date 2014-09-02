Slicease = function(){
	//Necessary seetings
	this.canvId = '';
	this.images = [];
	
	//Available settings
	this.padding = [30, 45, 30, 95];
	this.pieces = [];
	this.screen_z = 700;
	this.object_z = 800;
	
	this.fps = 30;
	this.xmove = [];
	this.zmove = [];
	this.sideFillStyle = '#555555';
	
	//Runtime params
	this.canvas = null;
	this.context = null;
	this.ocan = null;
	this.octx = null;
	
	this.width = 0;
	this.height = 0;
	this.radius = 0;
	this.points = [];
	this.img_c = -1;
	this.img_p = -1;
	this.img_n = 0;
	
	this.inited = false;
	this.running = false;
	this.playing = false;
	this.timer = null;
};

Slicease.prototype.setup = function(opts){
	for(var i in opts){
		if(this.hasOwnProperty(i) == false){
			continue;
		}
		
		this[i] = opts[i];
		
		if(i == 'images'){
			this.img_p = this.images.length-1;
		}
	}
};

Slicease.prototype.init = function(){
	if(this.canvId == '' || this.images.length == 0){
		return -1;
	}
	
	if(this.canvas == null){
		this.canvas = document.getElementById(this.canvId),
		this.context = canvas.getContext('2d');
		this.context.strokeStyle = "rgb(250,0,0)";
	}
	if(this.ocan == null){
		this.ocan = document.createElement('canvas'),
		this.octx = this.ocan.getContext('2d');
		this.ocan.width = this.canvas.width;
		this.ocan.height = this.canvas.height;
	}
	
	if(this.pieces.length == 0){
		for(var i=0; i<this.images.length; i++){
			this.pieces.push(5);
		}
	}
	if(this.xmove.length == 0){
		for(var i=0; i<this.images.length; i++){
			this.xmove.push({vo:0, a:0.5, cs:90, ca1:-3, ca2:1, so:0, delay:3, state:-1});
			this.zmove.push({vo:40, a:-4, cs:0, ca1:-8, ca2:2, so:0, delay:-1, state:-1});
		}
	}
	
	if(this.width == 0){
		this.width = this.canvas.width - this.padding[0] - this.padding[2];
		this.height = this.canvas.height - this.padding[1] - this.padding[3];
		this.radius = this.height * Math.sqrt(2) / 2;
	}
	
	this.inited = true;
};

Slicease.prototype.run = function(index){
	if(this.inited == false || this.playing == true || index != null && index >= this.images.length || index != null && index < 0){
		return -1;
	}
	
	var c_img = this.img_c;
	this.img_c = index == null ? this.img_n : index;
	this.img_p = index == null ? c_img : (this.img_c == 0 ? (this.images.length-1) : (this.img_c-1));
	this.img_n = this.img_c < this.images.length-1 ? (this.img_c+1) : 0;
	
	this.points = [];
	var pieces = this.pieces[this.img_c];
	for(var i=0; i<=pieces; i++){
		var pw = Math.floor(this.width / pieces * 100) / 100;
		
		var ax = bx = cx = dx = i * pw - this.width / 2;
		var by = cy = this.height / 2;
		var ay = dy = -by;
		var az = bz = this.object_z;
		var cz = dz = az + this.height;
		
		if(this.running == false){
			az = bz = cz = dz += 200;
		}
		
		var xmv = {}, zmv = {};
		for(var attri in this.xmove[this.img_c]){
			xmv[attri] = this.xmove[this.img_c][attri];
		}
		for(var attri in this.zmove[this.img_c]){
			zmv[attri] = this.zmove[this.img_c][attri];
		}
		xmv.delay *= i;
		zmv.delay = zmv.delay < 0 ? xmv.delay : zmv.delay*i;
		
		var sideface = {a:{x:ax,y:ay,z:az}, b:{x:bx,y:by,z:bz}, c:{x:cx,y:cy,z:cz}, d:{x:dx,y:dy,z:dz}, xmv:xmv, zmv:zmv};
		this.points[i] = sideface;
	}
	
	this.startTimer();
};
Slicease.prototype.startTimer = function(){
	if(this.timer == null){
		var _delay = Math.round(1000 / this.fps);
		
		var func = new Func();
		func.setup(this.getPositions, this);
		
		this.timer = new Timer();
		this.timer.setup(func, _delay);
	}
	
	var started = this.timer.start();
	if(started >= 0){
		this.running = true;
		this.playing = true;
	}
}

Slicease.prototype.getPositions = function(){
	this.canvas.width = this.canvas.width;
	
	for(var i=0; i<this.pieces[this.img_c]; i++){
		var os = this.getOffset(i);
		if(os == null || os.length == 0){
			continue;
		}
		
		var xos = os[0];
		var zos = os[1];
		
		var aa = this.transAngle(xos + 135);
		var ba = this.transAngle(xos + 225);
		var ca = this.transAngle(xos + 315);
		var da = this.transAngle(xos + 45);
		
		var sf0 = this.points[i];
		var sf1 = this.points[i+1];
		var x0 = sf0.a.x;
		var x1 = sf1.a.x;
		
		var ay = this.getY(aa);
		var by = this.getY(ba);
		var cy = this.getY(ca);
		var dy = this.getY(da);
		
		var az = this.getZ(aa, zos);
		var bz = this.getZ(ba, zos);
		var cz = this.getZ(ca, zos);
		var dz = this.getZ(da, zos);
		
		
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
		
		this.context.beginPath();
		this.context.moveTo(atx0, aty0);
		this.context.lineTo(btx0, bty0);
		this.context.lineTo(ctx0, cty0);
		this.context.lineTo(dtx0, dty0);
		this.context.lineTo(atx0, aty0);
		this.context.fillStyle = this.sideFillStyle;
		this.context.fill();
		this.context.closePath();
		
		this.context.moveTo(btx0, bty0);
		this.context.lineTo(btx1, bty1);
		this.context.moveTo(ctx0, cty0);
		this.context.lineTo(ctx1, cty1);
		this.context.moveTo(dtx0, dty0);
		this.context.lineTo(dtx1, dty1);
		
		if(i < this.pieces[this.img_c]/2){
			this.context.moveTo(ctx1, cty1);
			this.context.lineTo(dtx0, dty0);
			this.context.moveTo(dtx1, dty1);
			this.context.lineTo(atx0, aty0);
			this.context.lineTo(btx1, bty1);
		}
		else{
			this.context.moveTo(ctx0, cty0);
			this.context.lineTo(dtx1, dty1);
			this.context.moveTo(dtx0, dty0);
			this.context.lineTo(atx1, aty1);
			this.context.lineTo(btx0, bty0);
		}
		
		//this.context.stroke();
		
		var pieces = this.pieces[this.img_c];
		var destOver = i < this.pieces[this.img_c]/2 ? 0 : 1;
		//back side
		if(cty0 < dty0){
			var img = new Image();
			img.src = this.images[this.img_n];
			var pw = Math.floor(img.width / pieces * 100) / 100;
		
			this.getTransform(img, i*pw, 0, pw, img.height, {x:ctx0,y:cty0}, {x:dtx0,y:dty0}, null, {x:ctx1,y:cty1}, destOver);
			this.getTransform(img, i*pw, 0, pw, img.height, null, {x:dtx0,y:dty0}, {x:dtx1,y:dty1}, {x:ctx1,y:cty1}, destOver);
		}
		//top side
		if(dty0 < aty0){
			var img = new Image();
			img.src = this.images[this.img_c];
			var pw = Math.floor(img.width / pieces * 100) / 100;
		
			this.getTransform(img, i*pw, 0, pw, img.height, {x:dtx0,y:dty0}, {x:atx0,y:aty0}, null, {x:dtx1,y:dty1}, destOver);
			this.getTransform(img, i*pw, 0, pw, img.height, null, {x:atx0,y:aty0}, {x:atx1,y:aty1}, {x:dtx1,y:dty1}, destOver);
		}
		//front side
		if(aty0 < bty0){
			var img = new Image();
			img.src = this.images[this.img_p];
			var pw = Math.floor(img.width / pieces * 100) / 100;
			
			this.getTransform(img, i*pw, 0, pw, img.height, {x:atx0,y:aty0}, {x:btx0,y:bty0}, {x:btx1,y:bty1}, null, destOver);
			this.getTransform(img, i*pw, 0, pw, img.height, {x:atx0,y:aty0}, null, {x:btx1,y:bty1}, {x:atx1,y:aty1}, destOver);
		}
		
		this.context.globalCompositeOperation = "destination-over";
		this.context.beginPath();
		this.context.moveTo(atx1, aty1);
		this.context.lineTo(btx1, bty1);
		this.context.lineTo(ctx1, cty1);
		this.context.lineTo(dtx1, dty1);
		this.context.lineTo(atx1, aty1);
		this.context.fillStyle = this.sideFillStyle;
		this.context.fill();
		this.context.closePath();
	}
}
Slicease.prototype.getOffset = function(indx){
	var os = [];
	
	var phy = this.points[indx];
	var xmv = phy.xmv;
	var zmv = phy.zmv;
	
	var xtime = this.timer.count - xmv.delay;
	var ztime = this.timer.count - zmv.delay;
	
	if(xmv.state == 0){
		os[0] = xmv.cs;
	}
	else if(this.timer.count < xmv.delay){
		os[0] = 0;
	}
	else{
		xmv.state = xmv.state < 0 ? 1 : xmv.state;
		var xsv = this.getSpaceAndVelocity(xmv.vo, xmv.a, xtime);
		
		switch(xmv.state){
			case 1:
				xsv.s += xmv.so;
				if(xsv.s >= xmv.cs){
					var xtv = this.getTimeAndVelocity(xmv.vo, xmv.a, xmv.cs-xmv.so);
					xmv.a = xmv.ca1;
					xmv.vo = xtv.v + xmv.a * (xtime-xtv.t);
					xmv.delay = this.timer.count;
					
					if(xtv.v < 2){// 2(°/s)
						xmv.state = 0;
						xsv.s = xmv.cs;
						break;
					}
					xmv.state++;
					xsv.s = xmv.so = xmv.cs + 0.5 * (xtv.v + xmv.vo) * (xtime-xtv.t);
				}
				break;
			case 2:
				xsv.s += xmv.so;
				if(xsv.v <= 0){
					var xst = this.getSpaceAndTime(xmv.vo, xmv.a, 0);
					xmv.a = xmv.ca2;
					xmv.vo = xmv.a * (xtime-xst.t);
					xmv.delay = this.timer.count;
					
					if(xst.t < 0.5){
						xmv.state = 0;
						xsv.s = xmv.cs;
						break;
					}
					xmv.state++;
					xsv.s = xmv.so = xmv.so + xst.s - 0.5 * xmv.vo * (xtime-xst.t);
				}
				break;
			case 3:
				xsv.s = xmv.so - xsv.s;
				if(xsv.s <= xmv.cs){
					var xtv = this.getTimeAndVelocity(xmv.vo, xmv.a, xmv.so-xmv.cs);
					xmv.a = xmv.ca1;
					xmv.vo = xtv.v + xmv.a * (xtime-xtv.t);
					xmv.delay = this.timer.count;
					
					if(xtv.v < 2){// 2(°/s)
						xmv.state = 0;
						xsv.s = xmv.cs;
						break;
					}
					xmv.state++;
					xsv.s = xmv.so = xmv.cs - 0.5 * (xtv.v + xmv.vo) * (xtime-xtv.t);
				}
				break;
			case 4:
				xsv.s = xmv.so - xsv.s;
				if(xsv.v <= 0){
					var xst = this.getSpaceAndTime(xmv.vo, xmv.a, 0);
					xmv.a = xmv.ca2;
					xmv.vo = xmv.a * (xtime-xst.t);
					xmv.delay = this.timer.count;
					
					if(xst.t < 0.5){
						xmv.state = 0;
						xsv.s = xmv.cs;
						break;
					}
					xmv.state = 1;
					xsv.s = xmv.so = xmv.so - xst.s + 0.5 * xmv.vo * (xtime-xst.t);
				}
				break;
		}
		
		os[0] = xsv.s;
	}
	
	if(zmv.state == 0){
		os[1] = zmv.cs;
	}
	else if(this.timer.count < zmv.delay){
		os[1] = 0;
	}
	else{
		zmv.state = zmv.state < 0 ? 2 : zmv.state;
		var zsv = this.getSpaceAndVelocity(zmv.vo, zmv.a, ztime);
		
		switch(zmv.state){
			case 1:
				zsv.s += zmv.so;
				if(zsv.s >= zmv.cs){
					var ztv = this.getTimeAndVelocity(zmv.vo, zmv.a, zmv.cs-zmv.so);
					zmv.a = zmv.ca1;
					zmv.vo = ztv.v + zmv.a * (ztime-ztv.t);
					zmv.delay = this.timer.count;
					
					if(ztv.v < 2){// 2(°/s)
						zmv.state = 0;
						zsv.s = zmv.cs;
						break;
					}
					zmv.state++;
					zsv.s = zmv.so = zmv.cs + 0.5 * (ztv.v + zmv.vo) * (ztime-ztv.t);
				}
				break;
			case 2:
				zsv.s += zmv.so;
				if(zsv.v <= 0){
					var zst = this.getSpaceAndTime(zmv.vo, zmv.a, 0);
					zmv.a = zmv.ca2;
					zmv.vo = zmv.a * (ztime-zst.t);
					zmv.delay = this.timer.count;
					
					if(zst.t < 0.5){
						zmv.state = 0;
						zsv.s = zmv.cs;
						break;
					}
					zmv.state++;
					zsv.s = zmv.so = zmv.so + zst.s - 0.5 * zmv.vo * (ztime-zst.t);
				}
				break;
			case 3:
				zsv.s = zmv.so - zsv.s;
				if(zsv.s <= zmv.cs){
					var ztv = this.getTimeAndVelocity(zmv.vo, zmv.a, zmv.so-zmv.cs);
					zmv.a = zmv.ca1;
					zmv.vo = ztv.v + zmv.a * (ztime-ztv.t);
					zmv.delay = this.timer.count;
					
					if(ztv.v < 2){// 2(°/s)
						zmv.state = 0;
						zsv.s = zmv.cs;
						break;
					}
					zmv.state++;
					zsv.s = zmv.so = zmv.cs - 0.5 * (ztv.v + zmv.vo) * (ztime-ztv.t);
				}
				break;
			case 4:
				zsv.s = zmv.so - zsv.s;
				if(zsv.v <= 0){
					var zst = this.getSpaceAndTime(zmv.vo, zmv.a, 0);
					zmv.a = zmv.ca2;
					zmv.vo = zmv.a * (ztime-zst.t);
					zmv.delay = this.timer.count;
					
					if(zst.t < 0.5){
						zmv.state = 0;
						zsv.s = zmv.cs;
						break;
					}
					zmv.state = 1;
					zsv.s = zmv.so = zmv.so - zst.s + 0.5 * zmv.vo * (ztime-zst.t);
				}
				break;
		}
		
		os[1] = zsv.s;
	}
	
	if(xmv.state == 0 && zmv.state == 0 && indx == this.pieces[this.img_c]-1){
		this.timer.reset();
		
		this.running = false;
		this.playing = false;
	}
	
	return os;
};
Slicease.prototype.getSpaceAndVelocity = function(vo, a, t){
	var s = vo*t + 0.5*a*t*t;
	var v = vo + a*t;
	return {s:s, v:v};
};
Slicease.prototype.getTimeAndVelocity = function(vo, a, s){
	var v = Math.sqrt(2*a*s + vo*vo);
	var t = (v - vo) / a;
	return {t:t, v:v};
};
Slicease.prototype.getSpaceAndTime = function(vo, a, v){
	var s = 0.5 * (v*v -vo*vo) / a;
	var t = (v - vo) / a;
	return {s:s, t:t};
};

Slicease.prototype.transAngle = function(angle){
	var ag = (angle % 360) * Math.PI / 180;
	return ag;
};
Slicease.prototype.getY = function(angle){
	var y = - Math.floor(this.radius * Math.sin(angle) * 100) / 100;
	return y;
};
Slicease.prototype.getZ = function(angle, zos){
	var z = Math.floor(this.radius * Math.cos(angle) * 100) / 100 + this.object_z + this.height/2 + zos;
	return z;
};
Slicease.prototype.transX = function(x, z){
	var _x = Math.floor(x / z * this.screen_z) + this.padding[0] + this.width / 2;
	return _x;
};
Slicease.prototype.transY = function(y, z){
	var _y = Math.floor(y / z * this.screen_z) + this.padding[1] + this.height / 2;
	return _y;
};


Slicease.prototype.clearRect = function(x, y, width, height){
	if(this.context == null){
		return;
	}
	
	this.context.clearRect(x, y, width, height);
};


Slicease.prototype.getTransform = function(image, imgX, imgY, rectW, rectH, p1, p2, p3, p4, destOver){
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
	if(destOver == 1){
		this.context.globalCompositeOperation = "destination-over";
	}
	else{
		this.context.globalCompositeOperation = "source-over";
	}
	this.context.drawImage(this.ocan, 0, 0, this.ocan.width, this.ocan.height, rect.x, rect.y, this.canvas.width, this.canvas.height);
	
	return 0;
};
