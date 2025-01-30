const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.onload = function () {
	// Init canvas size
	//const dpr = window.devicePixelRatio || 1;
	var dpr = 1;
	canvas.width = window.innerWidth * dpr;
	canvas.height = window.innerHeight * dpr;
	
	requestAnimationFrame(gameloop);
}


function gameloop() {
	let w = canvas.width;
	let h = canvas.height;

	ctx.clearRect(0,0, w, h);
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, canvas.height/4, 0, 2 * Math.PI);
	ctx.fill();
	requestAnimationFrame(gameloop);
}

