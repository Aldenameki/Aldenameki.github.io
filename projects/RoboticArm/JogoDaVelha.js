function Matrix(row, col, value) {  //Cria uma array bidimensional e preenche com o que estiver no value
    var arr = [];

    for(var i=0; i<row; i++){
        var column = [];

        for(var j=0; j<col; j++){
            column[j] = new value.constructor();
        }
        arr[i] = column;
    }

    return arr;
}

class Flag {
	constructor() {
		this.flags = [256];
	}
	
	get(char) {
		return this.flags[char.charCodeAt()];
	}
	
	set(char, state) {
		this.flags[char.charCodeAt()] = state;
	}
}

function rad(grau) {
	return grau*Math.PI/180;
}

function grau(rad) {
	return rad*180/Math.PI;
}

function fAngle(pos1, pos2) {
	var dy = pos2.y - pos1.y;
	var dx = pos2.x - pos1.x;
	
	if(dx<0)
		return Math.atan(dy/dx)+Math.PI;
	
	if(dy<0)
		return 2*Math.PI+Math.atan(dy/dx);
	
	if(dy==0)
		return Math.atan(0);
	
	return Math.atan(dy/dx);
}

class Vector2 {
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
}

class Bone {
	constructor(size=10, angle=0) {
		this.size = size;
		this.angle = angle;
	}
}

class Arm {
	constructor(posX=10, posY=10) {
		this.bone = [];
		this.position = new Vector2;
		this.position.x = posX;
		this.position.y = posY;
	}
	
	addBone(size=10, angle=0) {
		this.bone.push(new Bone(size, angle));
	}
	
	size() {
		return this.bone.length;
	}
	
	armEnd(pos, b, angle=0) {
		var newPos = new Vector2;
		angle += b.angle
		
		newPos.x = pos.x + b.size*Math.cos(angle);
		newPos.y = pos.y + b.size*Math.sin(angle);
		
		return newPos;
	}
	
	handPos() {
		var pos = new Vector2;
		var angle = 0;
		
		for(var i=0; i<this.size(); i++) {
			pos = this.armEnd(pos, this.bone[i], angle);
			angle += this.bone[i].angle;
		}
		
		return pos;
	}
	
	getBonesPos() {
		var pos = []
		var angle = 0;
		
		pos.push(this.position);
		
		for(var i=0; i<this.size(); i++) {
			pos.push(this.armEnd(pos[i], this.bone[i], angle));
			angle += this.bone[i].angle;
		}
		
		return pos;
	}
	
	reach(pos) {
		var bonesPos = this.getBonesPos();
		var size = this.size();
		
		for(var i=0; i<size; i++){
			var angle = fAngle(bonesPos[i], bonesPos[size]);
			var angle2 = fAngle(bonesPos[i], pos);
			var dA = angle2 - angle;
			
			if(dA>Math.PI){
				dA = -2*Math.PI+dA;
			} else if(dA<-Math.PI){
				dA = 2*Math.PI+dA;
			}
			
			this.bone[i].angle += dA*0.3;
		}
	}
}

class Drawing {
	
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
        this.c = this.canvas.getContext('2d');
	}
	
    drawLine(x1, y1, x2, y2, color='#000000'){ //desenha retângulos no canvas
        this.c.fillStyle = color;
		
		this.c.beginPath();
		this.c.moveTo(x1,y1);
        this.c.lineTo(x2, y2);
		this.c.closePath();
		this.c.stroke();
    }

    drawText(x=0, y=0, text='', size='10', font='Arial', color='#000000') {  //desenha textos no canvas
        y += this.ySSize;
        this.c.font = size + "px " + font;
        this.c.fillStyle = color;
        this.c.fillText(text, x, y);
    }
	
	drawCircle(x, y, r=10, color='#000000') {
		this.c.beginPath();
		this.c.arc(x,y,r,0, 2*Math.PI, false);
		this.c.fillStyle = color;
		this.c.fill();
		this.c.closePath();
	}

    clearScreen() { //Limpa a tela (canvas)
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function draw() {
	var pos = arm.getBonesPos();
	
	canv.clearScreen();
	canv.drawCircle(pos[0].x, pos[0].y, 3);
	for(var i=0; i<arm.size(); i++){
		canv.drawLine(pos[i].x, pos[i].y, pos[i+1].x, pos[i+1].y);
	}
}

function updateFlag(key, state=false) {
	flag.set(key, state);
}

document.onkeydown = function(event){
	var key_press = String.fromCharCode(event.keyCode);
	updateFlag(key_press, true);
}

document.onkeyup = function(event){
	var key_press = String.fromCharCode(event.keyCode);
	updateFlag(key_press, false);
}

function updateButtom() {
	var input = document.getElementById('it_bones');
	arm = new Arm(50,50);
	
	for(var i=0; i<input.value; i++)
		arm.addBone(30);
}

function canvasClick() {
	const cv = canv.canvas.getBoundingClientRect();
	const x = event.clientX - cv.left;
	const y = event.clientY - cv.top;
	
	goal.x = x;
	goal.y = y;
}

function update() {
	if(flag.get('D'))
		arm.position.x++;
	if(flag.get('A'))
		arm.position.x--;
	if(flag.get('W'))
		arm.position.y--;
	if(flag.get('S'))
		arm.position.y++;
	
	/*if(flag.get('V'))
		arm.bone[0].angle -= 0.1;
	if(flag.get('B'))
		arm.bone[0].angle += 0.1;
	if(flag.get('F'))
		arm.bone[1].angle -= 0.1;
	if(flag.get('G'))
		arm.bone[1].angle += 0.1;
	if(flag.get('R'))
		arm.bone[2].angle -= 0.1;
	if(flag.get('T'))
		arm.bone[2].angle += 0.1;*/
	
	arm.reach(goal);
	//console.log(grau(fAngle(arm.position, new Vector2(100,100))));
}

function render() {
	draw();
	canv.drawCircle(goal.x, goal.y, 2);
}

function mainLoop() {
	update();
	render();
	requestAnimationFrame(mainLoop);
}

function main() {
	goal = new Vector2(100,100);
	flag = new Flag;
	canv = new Drawing('canvas1');
	arm = new Arm(50,50);
	arm.addBone(50, rad(45));
	arm.addBone(30, rad(-45));
	arm.addBone(30, rad(-45));
	
	document.addEventListener("click", canvasClick);
	
    mainLoop();
}



//window.onload = main();