const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let prevtime_ms = null; // previous timestamp gameloop
let starttime_ms = null;
let abstime_s = 0;     // abs time in s

let gravity; // g

const nrParticles = 80; // per explosion
let particles = null;
// particles: { posx, posy, vx, vy }

let time_till_next_explosion;

window.onload = function () {
	// Init canvas size
	const dpr = window.devicePixelRatio || 1;
	//const dpr = 1;
	canvas.width = window.innerWidth * dpr;
	canvas.height = window.innerHeight * dpr;

	gravity = canvas.height * 0.2;
	time_till_next_explosion = 11; // countdown

	particles = initParticles(nrParticles, canvas.width/2, canvas.height/2, canvas.height * 0.15);
	
	requestAnimationFrame(gameloop);
}


function gameloop(timestamp_ms) {
	let w = canvas.width;
	let h = canvas.height;

	ctx.clearRect(0,0, w, h);

	if (starttime_ms) {
		dt = (timestamp_ms - prevtime_ms) * 1e-3; // dt in ms
		abstime_s = (timestamp_ms - starttime_ms) * 1e-3;

		//updateFireworks(dt);
		//renderFireworks();

		update(dt);
		render();



		
		color = randomColor();
		let r = Math.round(color.r * 255);
		let g = Math.round(color.g * 255);
		let b = Math.round(color.b * 255);
		ctx.fillStyle = "rgb("+r+","+g+","+b+")";
		
		//if (fireworks.length == 0) {
			ctx.font = Math.round(canvas.height/30) + "px Arial";
			//ctx.fillStyle = "white";
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

function update(dt) {
	ps = particles || [];
	updateParticles(ps, dt);
}

function render() {
	let w = canvas.width;
	let h = canvas.height;
	let radius = h / 300;

	ctx.fillStyle = "red";
	for (p of particles) {
		ctx.beginPath();
		ctx.arc(p.posx, p.posy, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function initParticles(n, x, y, scalev) {
	// velocity is randomized point on sphere, see: https://mathworld.wolfram.com/SpherePointPicking.html
	let ps = [];
	while (n--) {
		let x1, x2, d;
		do {
			x1 = 2 * Math.random() - 1;
			x2 = 2 * Math.random() - 1;
			d = 1 - x1*x1 - x2*x2;
		} while (d <= 0);
		let sqrtd = Math.sqrt(d);
		ps.push({ posx: x, posy: y, vx: scalev * 2*x1*sqrtd, vy: scalev * 2*x2*sqrtd });
	}
	return ps;
}

function updateParticles(ps, dt) {
	for (let ii = 0; ii < ps.length; ii++) {
		let p = ps[ii];
		p.posx += p.vx * dt;
		p.posy += p.vy * dt;
		p.vy += gravity * dt;
	}
}




function randomColor() {
	// hsl: h is random, s = 1, l=0.5;
	h = Math.random();
	r = hueToRgb_helper(h + 1/3);
	g = hueToRgb_helper(h);
	b = hueToRgb_helper(h - 1/3);
	return { r: r, g: g, b: b };
}

function hueToRgb_helper(t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1/6) return 6 * t;
	if (t < 1/2) return 1;
	if (t < 2/3) return (2/3 - t) * 6;
	return 0;
}

