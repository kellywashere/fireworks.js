let canvas;
let ctx;

let prevtime_ms = null; // previous timestamp gameloop
let starttime_ms = null;
let abstime_s = 0;     // abs time in s

let gravity; // g

let fireworks = []; // all fireworks
// firework: { particles, color, intensity }
// particles: { posx, posy, vx, vy }

const duration = 2.0;   // duration of particles
const nrParticles = 80; // per explosion
const time_between = 0.2; // average, is randomized a bit
let time_till_next_explosion;


window.onload = function () {
	// Init canvas size
	//const dpr = window.devicePixelRatio || 1;
	
	const dpr = 2.5;
	const w = window.innerWidth * dpr;
	const h = window.innerHeight * dpr;
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	canvas.width  = w;
	canvas.height = h;
		
	// Init physics, particles
	gravity = h * 0.2;
	time_till_next_explosion = 11; // countdown
	
	requestAnimationFrame(gameloop);
}

function initParticles(n, x, y, scalev) {
	// velocity is randomized point on sphere, see: https://mathworld.wolfram.com/SpherePointPicking.html
	let particles = [];
	while (n--) {
		let x1, x2, d;
		do {
			x1 = 2 * Math.random() - 1;
			x2 = 2 * Math.random() - 1;
			d = 1 - x1*x1 - x2*x2;
		} while (d <= 0);
		let sqrtd = Math.sqrt(d);
		let p = { posx: x, posy: y, vx: scalev * 2*x1*sqrtd, vy: scalev * 2*x2*sqrtd };
		particles.push(p);
	}
	return particles;
}

function updateParticles(particles, dt) {
	for (let ii = 0; ii < particles.length; ii++) {
		let p = particles[ii];
		p.posx += p.vx * dt;
		p.posy += p.vy * dt;
		p.vy += gravity * dt;
	}
}

function updateFireworks(dt) {
	
	// see: https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
	let ii = fireworks.length;
	while (ii--) {
		// firework: { particles, color, intensity }
		fw = fireworks[ii];
		updateParticles(fw.particles, dt);
		fw.intensity -= dt/duration;
		if (fw.intensity <= 0) {
			fireworks.splice(ii, 1);
		}
	}

	time_till_next_explosion -= dt;
	if (time_till_next_explosion <= 0) {
		let w = canvas.width;
		let h = canvas.height;
		let x = Math.random() * w;
		let y = Math.random() * h;
		scalev = h * (0.15 + 0.15*Math.random());
		color = randomColor();
		fw = { particles: initParticles(nrParticles, x, y, scalev), color: color, intensity: 1 };
		fireworks.push(fw);
		time_till_next_explosion = time_between * (0.7 + 0.6 * Math.random());
	}
}

function renderFireworks() {
	let w = canvas.width;
	let h = canvas.height;
	let radius = h / 300;
	
	ctx.clearRect(0,0, w, h);
	
	for (fw of fireworks) {
		let intens = fw.intensity;
		let rr = radius * intens;
		// firework: { particles, color, intensity }
		let r = Math.round(fw.color.r * intens * 255);
		let g = Math.round(fw.color.g * intens * 255);
		let b = Math.round(fw.color.b * intens * 255);
		ctx.fillStyle = "rgb("+r+","+g+","+b+")";
		for (p of fw.particles) {
			ctx.beginPath();
			ctx.arc(p.posx, p.posy, rr, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
}

function gameloop(timestamp_ms) {
	if (starttime_ms) {
		dt = (timestamp_ms - prevtime_ms) * 1e-3; // dt in ms
		abstime_s = (timestamp_ms - starttime_ms) * 1e-3;

		updateFireworks(dt);
		renderFireworks();
		
		if (fireworks.length == 0) {
			ctx.font = Math.round(canvas.height/30) + "px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(Math.floor(time_till_next_explosion).toString(), canvas.width/2, canvas.height/2);
		}
	} else {
		starttime_ms = timestamp_ms;
	}

	prevtime_ms = timestamp_ms;

	requestAnimationFrame(gameloop);
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
