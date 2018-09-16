function mostra(){
	document.formxml.ans.value="yaay";
	alert("Olá");
}

function show(){
	alert(document.formxml.ans.value);
	document.formxml.ans.value="Ready =)"
}

//ANIMATING
var tID; //we will use this variable to clear the setInterval()

function animateSprite() {
	var    position = 256; //start position for the image slicer
	const  interval = 100; //100 ms of interval for the setInterval()
	tID = setInterval ( () => {
		document.getElementById("image1").style.backgroundPosition = 
		`-${position}px 0px`; 
		//we use the ES6 template literal to insert the variable "position"
		if (position < 1536){
			position = position + 256;
		}
		//we increment the position by 256 each time
		else{
			position = 256;
		}
		//reset the position to 256px, once position exceeds 1536px
	}, interval ); //end of setInterval
} //end of animateScript()

function stopSprite() {
	clearInterval(tID);
} //end of stopAnimate(



/*
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
} 
*/
