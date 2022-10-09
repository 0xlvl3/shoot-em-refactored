//imports
import Enemy from "./classes/Enemy.js";
import Player from "./classes/Player.js";
import Particle from "./classes/Particle.js";
import Projectile from "./classes/Projectile.js";
import PowerUp from "./classes/PowerUp.js";
import BackgroundParticle from "./classes/BackgroundParticle.js";
import audio from "./audio.js";

//elements
const scoreEl = document.getElementById("scoreEl");
const modalEl = document.getElementById("modalEl");
const endScoreEl = document.getElementById("endScoreEl");
const buttonEl = document.getElementById("buttonEl");
const startButton = document.getElementById("startButton");
const startModalEl = document.getElementById("startModalEl");
const volumeOnEl = document.getElementById("volumeOn");
const volumeOffEl = document.getElementById("volumeOff");
const body = document.getElementById("body");

//canvas selector and settings
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

//game dimensions
canvas.width = innerWidth;
canvas.height = innerHeight;

//arrays we will use to store our class objects
export let player; //used within Enemy.js
let projectiles = [];
let enemies = [];
let particles = [];
let powerUps = [];
let backgroundParticles = [];
let intervalId;
let spawnPowerUpsId;
let score = 0;
let frames = 0;
let game = {
  active: false,
};

//global variables
const spacing = 30; //used in our backgroundParticles
const mouse = {
  position: {
    x: 0,
    y: 0,
  },
};

//init will start and reset our game
function init() {
  //coords for middle of canvas
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  player = new Player(x, y, 30, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  powerUps = [];
  score = 0;
  scoreEl.innerHTML = 0;
  frames = 0;
  game = {
    active: true,
  };

  //this is our background effect
  backgroundParticles = [];
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing)
      backgroundParticles.push(
        new BackgroundParticle({
          position: {
            x,
            y,
          },
          radius: 2.5,
        })
      );
  }
}

/**
 * spawn enemies will constantly spawn enemies
 */
function spawnEnemies() {
  intervalId = setInterval(() => {
    const radius = Math.random() * (30 - 8) + 8;

    //x, y used in if statement
    let x;
    let y;

    //spawn enemies from borders of width and height of canvas
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    //randomly color enemies
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    //returns radians we use within velocity
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    //using raidans from above, angle of enemy to player
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    //how we spawn enemies
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

/**
 * spawn powerups
 */
function spawnPowerUps() {
  spawnPowerUpsId = setInterval(() => {
    powerUps.push(
      new PowerUp({
        position: { x: -30, y: Math.random() * canvas.height },
        velocity: { x: Math.random() + 2, y: 0 },
        imageSrc: "/img/lightningBolt.png",
      })
    );
  }, 45000);
}

/**
 *
 * @param {object} position = x and y coords of projectile collision with enemy
 * @param {object} score =  player score
 */
function createScoreLabel({ position, score }) {
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = score;
  scoreLabel.style.color = "white";
  scoreLabel.style.position = "absolute";
  scoreLabel.style.left = position.x + "px";
  scoreLabel.style.top = position.y + "px";
  scoreLabel.style.userSelect = "none"; //makes user not able to select labels
  scoreLabel.style.left = document.body.appendChild(scoreLabel);
  scoreLabel.style.pointerEvents = "none";

  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      scoreLabel.parentNode.removeChild(scoreLabel);
    },
  });
}

let animationId; //will be used to end game

function animate() {
  animationId = requestAnimationFrame(animate);

  //where we draw our background particles to canvas
  backgroundParticles.forEach((bgParticle) => {
    bgParticle.draw();

    const dist = Math.hypot(
      player.x - bgParticle.position.x,
      player.y - bgParticle.position.y
    );

    //logic creates effects with background particles
    if (dist < 150) {
      bgParticle.alpha = 0;
      if (dist > 100) {
        bgParticle.alpha = 0.5;
      }
    } else if (dist > 100 && bgParticle.alpha < 0.1) {
      bgParticle.alpha += 0.01;
    } else if (dist > 100 && bgParticle.alpha > 0.1) {
      bgParticle.alpha -= 0.01;
    }
  });
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  frames++;

  player.update(); //player animation

  //where we create powerups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];

    //logic for if powerup goes off screen
    if (powerUp.position.x > canvas.width) {
      powerUps.splice(i, 1);
    } else {
      powerUp.update();
    }

    //distance between player and powerup
    const dist = Math.hypot(
      player.x - powerUp.position.x,
      player.y - powerUp.position.y
    );

    //gain power up, collision player and powerup
    if (dist < powerUp.image.height / 2 + player.radius) {
      audio.powerUp.play();
      powerUps.splice(i, 1);
      player.powerUp = "MachineGun";
      player.color = "yellow";
      setTimeout(() => {
        player.powerUp = null;
        player.color = "white";
      }, 5000);
    }
  }

  //machine gun animation / implementation
  if (player.powerUp === "MachineGun") {
    const angle = Math.atan2(
      mouse.position.y - player.y,
      mouse.position.x - player.x
    );

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    //slow down rate of fire for power up
    if (frames % 2 === 0) {
      projectiles.push(
        new Projectile(player.x, player.y, 5, "yellow", velocity)
      );
    }
    if (frames % 5 === 0) {
      audio.shoot.play();
    }
  }

  //where we create particles
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];

    //logic will remove particles from game
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  }

  //where we create projectiles
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];

    projectile.update();

    //logic will remove projectiles from game that exceed canvas width and height
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  }

  //where we create enemies
  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    //enemy hits player & ends game
    if (dist - enemy.radius - player.radius < 1) {
      audio.death.play();
      game.active = false;
      cancelAnimationFrame(animationId); //stops game
      clearInterval(intervalId); //stops enemies from spawning
      clearInterval(spawnPowerUpsId); //stops powerups from spawning
      modalEl.style.display = "block";
      gsap.fromTo(
        modalEl,
        {
          scale: 0.8,
          opacity: 0,
        },
        { scale: 1, opacity: 1, ease: "expo" }
      );
      endScoreEl.innerHTML = score;
    }

    //collision of projectile and enemy
    for (
      let projectileIndex = projectiles.length - 1;
      projectileIndex >= 0;
      projectileIndex--
    ) {
      const projectile = projectiles[projectileIndex];

      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //remove enemy and projectile
      if (dist - enemy.radius - projectile.radius < 1) {
        //creating our particle explosion
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * Math.random() * 4,
                y: (Math.random() - 0.5) * Math.random() * 4,
              }
            )
          );
        }

        //logic will reduce enemy size
        if (enemy.radius - 10 > 5) {
          audio.damageTaken.play();
          scoreEl.innerHTML = score += 50;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 50,
          });
          projectiles.splice(projectileIndex, 1);
          //remove enemy if they are too small
        } else {
          scoreEl.innerHTML = score += 150;
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 150,
          });

          //logic here will fade background particles
          backgroundParticles.forEach((bgParticle) => {
            gsap.set(bgParticle, {
              color: "white",
              alpha: 1,
            });
            gsap.to(bgParticle, {
              color: enemy.color,
              alpha: 0.1,
            });
            bgParticle.color = enemy.color; //changes background to enemy color when kill
          });
          audio.explode.play();
          enemies.splice(enemyIndex, 1);
          projectiles.splice(projectileIndex, 1);
        }
      }
    }
  }
}

let audioInitialized = false;
addEventListener("click", (e) => {
  if (!audio.background.playing() && !audioInitialized) {
    audio.background.play();
    audioInitialized = true;
  }

  shoot({ x: e.clientX, y: e.clientY });
});

//how player shoots
function shoot({ x, y }) {
  //logic creates projectiles
  if (game.active) {
    //getting radians
    const angle = Math.atan2(y - player.y, x - player.x);

    const velocity = {
      x: Math.cos(angle) * 4.5,
      y: Math.sin(angle) * 4.5,
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
    audio.shoot.play();
  }
}

//reset game
buttonEl.addEventListener("click", () => {
  init();
  audio.select.play();
  animate();
  spawnEnemies();
  spawnPowerUps();
  gsap.to(modalEl, {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: "expo.in",
    onComplete: () => {
      modalEl.style.display = "none";
    },
  });
});

//setting mouse coords
addEventListener("mousemove", (e) => {
  mouse.position.x = e.clientX;
  mouse.position.y = e.clientY;
});

//iphone movement
addEventListener("touchmove", (event) => {
  mouse.position.x = event.touches[0].clientX;
  mouse.position.y = event.touches[0].clientY;
});

//start game
startButton.addEventListener("click", () => {
  init();
  audio.select.play();
  animate();
  spawnEnemies();
  spawnPowerUps();
  body.style.backgroundColor = "white";
  gsap.to(startModalEl, {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: "expo.in",
    onComplete: () => {
      startModalEl.style.display = "none";
    },
  });
});

//iphone
addEventListener("touchstart", (event) => {
  const x = event.touches[0].clientX;
  const y = event.touches[0].clientY;

  mouse.position.x = event.touches[0].clientX;
  mouse.position.y = event.touches[0].clientY;

  shoot({ x, y });
});

//will reset game on resize of any sort
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

//Player movement
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "d":
      player.velocity.x += 1;
      break;
    case "a":
      player.velocity.x -= 1;
      break;
    case "w":
      player.velocity.y -= 1;
      break;
    case "s":
      player.velocity.y += 1;
      break;
  }
});

//mute everything
volumeOnEl.addEventListener("click", (e) => {
  audio.background.pause();
  volumeOffEl.style.display = "block";
  volumeOnEl.style.display = "none";

  for (let key in audio) {
    audio[key].mute(true);
  }
});

//unmute all
volumeOffEl.addEventListener("click", (e) => {
  if (audioInitialized) audio.background.play();
  volumeOnEl.style.display = "block";
  volumeOffEl.style.display = "none";

  for (let key in audio) {
    audio[key].mute(false);
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    //inactive
    //clearIntervals
    clearInterval(intervalId);
    clearInterval(spawnPowerUpsId);
  } else {
    //spawnEnemies
    spawnEnemies();
    spawnPowerUps();
  }
});
