const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let prevtime_ms = null; // previous timestamp gameloop
let starttime_ms = null;
let abstime_s = 0;     // abs time in s


window.onload = function () {
	// Init canvas size
	const dpr = window.devicePixelRatio || 1;
	//const dpr = 1;
	canvas.width = window.innerWidth * dpr;
	canvas.height = window.innerHeight * dpr;
	
	requestAnimationFrame(gameloop);
}


function gameloop() {
	let w = canvas.width;
	let h = canvas.height;

	if (starttime_ms) {
		dt = (timestamp_ms - prevtime_ms) * 1e-3; // dt in ms
		abstime_s = (timestamp_ms - starttime_ms) * 1e-3;

		//updateFireworks(dt);
		//renderFireworks();
		
		//if (fireworks.length == 0) {
			ctx.font = Math.round(canvas.height/30) + "px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			//ctx.fillText(Math.floor(time_till_next_explosion).toString(), canvas.width/2, canvas.height/2);
			ctx.fillText(Math.floor(abstime_s).toString(), canvas.width/2, canvas.height/2);
		//}
	} else {
		starttime_ms = timestamp_ms;
	}

	prevtime_ms = timestamp_ms;

	requestAnimationFrame(gameloop);
}


