// Vars & Consts
let frames = 0;
var hud1;
var bloodcellsDestroyed = 0;

var player1;
var enemyShip;
var powerupNewLife;

// GAME STATE
const state = {
	current: 0,
	getReady: 0,
	game: 1,
	over: 2
}

class Game {
	constructor() {
		this.objects = [];
		this.paused;
		this.mute = false;
	}

	init() {
		let bg = new Background();
		player1 = new Player("Player1", canvas.width / 2, canvas.height / 2);
		enemyShip = new Enemy("EnemyShip");
		this.objects.push(bg);
		this.objects.push(player1);
		this.objects.push(enemyShip);

		for (let i = 0; i < NUM_BLOODCELLS; i++) {
			let bc = new Bloodcell("BloodCell");
			this.objects.push(bc);
			console.log("Blood Cell Created: ", i + 1);
		}

		hud1 = new hud();
		powerupNewLife = new PowerUp('PowerUpLife');
	}

	update() {
		if (!this.paused) {
			this.objects.forEach(obj => obj.update());
			this.collisions();

			powerupNewLife.update();

			if (bloodcellsDestroyed >= MAX_BLOODCELLS) {
				state.current = state.over; // Game over
				console.log("Game Over! You destroyed all the blood cells!");
			}
		}
	}

	draw() {
		ctx.fillStyle = "#70c5ce";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.objects.forEach(obj => obj.draw());

		hud1.draw();
		powerupNewLife.draw();
	}

	spawnLife() {
		powerupNewLife.active = true;
	}

	collisions() {
		for (let i = 0; i < this.objects.length; i++) {
			for (let j = 0; j < game.objects.length; j++) {
				if (typeof game.objects[i] != "undefined") {
					if (game.objects[i].type == "LaserGreen") {
						if (game.objects[j].type == "EnemyShip" && collision(game.objects[i], game.objects[j])) {
							console.log('COLLISION! Enemy');
							score.value++;
							score.high = Math.max(score.value, score.high);
							localStorage.setItem("highscore", score.high);

							let ex = new Explosion("Explosion", game.objects[j].x, game.objects[j].y - game.objects[j].h / 2, 96, 12); // create explosion at Enemy Ship location
							game.objects.push(ex);
							// console.log("explosion created")
							navigator.vibrate([500]);//vibrate mobile device if explosion
							if (!game.mute) explosionFX.play();
							game.objects[j].reset();
							game.objects.splice(i, 1);
						} else if (game.objects[j].type == "BloodCell" && collision(game.objects[i], game.objects[j])) {
							let ex = new Explosion("ExplosionBlood", game.objects[j].x, game.objects[j].y - game.objects[j].h, 128, 16); // create explosion
							game.objects.push(ex);
							if (!game.mute) splashFX.play();

							bloodcellsDestroyed++;
							console.log('Blood Cells Destroyed: ', bloodcellsDestroyed);
							navigator.vibrate([400, 100, 400]);//vibrate mobile device if bloodcell destroyed
							game.objects[j].reset();
							game.objects.splice(i, 1);
						}
					} else if (game.objects[i].type == "LaserBlue") {
						// console.log("laser blue check")
						if (game.objects[j].type == "Player1" && collision(game.objects[i], game.objects[j])) {
							game.objects[j].updateHealth(); // update player health
							console.log("before splice" + game.objects.length)
							game.objects.splice(i, 1); // delete laser
							console.log("after splice" + game.objects.length)
						}
					}
				} else {
					console.log("undefined");
					game.objects.splice(i, 1);
				}
			}
		}
	}
}

// AABB Collisions between 2 objects
function collision(o1, o2) {
	return (o2.x < o1.x + o1.w &&
		o2.x + o2.w > o1.x &&
		o2.y < o1.y + o1.h &&
		o2.y + o2.h > o1.y);
}

window.onload = function () {
	updateScore();
	if ("vibrate" in navigator) {
		console.log('can vibrate');
	} else {
		console.log('can not vibrate');
	}
}

function updateScore() {
	document.getElementById("scoreID").innerHTML = parseInt(localStorage.getItem("highscore")) || 0;
}

var game = new Game();
game.init();

let msPrev = window.performance.now();
const fps = 60; // Frames per second
const msPerFrame = 1000 / fps; // Milliseconds per frame

// Game loop
function loop() {
	requestAnimationFrame(loop);

	const msNow = window.performance.now();
	const msPassed = msNow - msPrev;

	if (msPassed < msPerFrame) return; // Skip frame if not enough time has passed

	const excessTime = msPassed % msPerFrame;
	msPrev = msNow - excessTime; // Adjust previous time to maintain consistent frame rate

	// Should run at 60 FPS
	game.update(); // Update objects
	game.draw(); // Draw objects

	frames++;
}

setInterval(() => {
	console.log("Total Elapsed Frames: ", frames)
}, 1000); // Log frames per second every second

loop();
