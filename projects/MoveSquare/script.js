let flagW = false;
let flagA = false;
let flagS = false;
let flagD = false;

var x = 100;
var y = 100;

document.onkeydown = function(event){
	var key_press = String.fromCharCode(event.keyCode);
	var key_code = event.keyCode;
	
	if(key_press == 'W'){
		flagW = true;
		document.getElementById('fW').innerHTML = flagW;
	} else if(key_press == 'S'){
		flagS = true;
		document.getElementById('fS').innerHTML = flagS;
	} else if(key_press == 'A'){
		flagA = true;
		document.getElementById('fA').innerHTML = flagA;
	} else if(key_press == 'D'){
		flagD = true;
		document.getElementById('fD').innerHTML = flagD;
	}
	
	//alert("keydown " + key_press);
}

document.onkeyup = function(event){
	var key_press = String.fromCharCode(event.keyCode);
	var key_code = event.keyCode;
	
	if(key_press == 'W'){
		flagW = false;
		document.getElementById('fW').innerHTML = flagW;
	} else if(key_press == 'S'){
		flagS = false;
		document.getElementById('fS').innerHTML = flagS;
	} else if(key_press == 'A'){
		flagA = false;
		document.getElementById('fA').innerHTML = flagA;
	} else if(key_press == 'D'){
		flagD = false;
		document.getElementById('fD').innerHTML = flagD;
	}
	
	//alert("keyup " + key_press);
}

function update(){
	if(flagW == true)
		y--;
	if(flagS == true)
		y++;
	if(flagA == true)
		x--;
	if(flagD == true)
		x++;
}

function render(){
	document.getElementById('sqr').style.left = x + 'px';
	document.getElementById('sqr').style.top = y + 'px';
	document.getElementById('dx').innerHTML = x;
	document.getElementById('dy').innerHTML = y;
}

function mainLoop(){
	update();
	render();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);