class Laser extends GameObject {
	constructor(src, x, y, speed, direction) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
	}

	update() {
		this.x += (this.speed * this.direction);
		if (this.x > canvas.width + this.w || this.x < -this.w) { // Laser off screen
			for (var i = 0; i < game.objects.length; i++) {
				if (game.objects[i] === this) {
					game.objects.splice(i, 1);
					console.log("Laser deleted");
					break;
				}
			}
		}

		updateScore();
	}
}


		/*
		for (var i = 0; i < game.objects.length; i++) {
			// Laser off screen
			if (game.objects[i] === this && (this.x > canvas.width + this.w || this.x < -this.w)) {
				game.objects.splice(i, 1);
			}
//&& game.objects[i].constructor.name === "Laser"
			// Player Laser
			if (game.objects[i].img.src == "art/LaserGreen.png"/) {
				console.log("check player laser")
				if (collision(game.objects[i], enemyShip)) {
					console.log('COLLISION!');
					game.objects.splice(i, 1);
					score.value++;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);

					var ex = new explosion(this.x + this.w, this.y - enemyShip.h / 2, 96, 12, 'Explosion'); // create explosion
					navigator.vibrate([500]);//vibrate mobile device if explosion
					explosions.push(ex);
					if (!game.mute) explosionFX.play();
					enemyShip.reset();
				} else if (collision(game.objects[i], bloodcells[j])) {
					game.objects.splice(i, 1);
					var ex = new explosion(this.x + this.w, this.y - bloodcells[j].h, 128, 16, 'ExplosionBlood'); // create explosion
					explosions.push(ex);
					if (!game.mute) splashFX.play();
					bloodcells[j].reset();

					bloodcellsDestroyed++;
					console.log('Blood Cells Destroyed: ', bloodcellsDestroyed);
					navigator.vibrate([400, 100, 400]);//vibrate mobile device if bloodcell destroyed
				}
			}
			// Enemy Laser
			if (game.objects[i] === this && collision(game.objects[i], player1) && game.objects[i].img.src == "art/LaserBlue.png") {
				player1.updateHealth();
				game.objects.splice(i, 1);
			}
		}
*/