const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const BALL_RADIUS = 30;
const COLORS = ["red", "aqua", "blue", "yellow", "pink"];

const GRID_ROWS = 4;
const GRID_COLUMNS = 10;

// _______________---___classes
class Player {
  constructor({ color, position = { x: null, y: null }, radius }) {
    this.color = color;
    this.position = position;
    this.radius = radius;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}

class Projectile {
  constructor({
    color,
    radius,
    position = { x: null, y: null },
    velocity = { x: 0, y: 0 },
  }) {
    this.color = color;
    this.radius = radius;
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x * 10;
    this.position.y += this.velocity.y * 10;
    if (
      this.position.x <= BALL_RADIUS ||
      this.position.x >= canvas.width - BALL_RADIUS
    ) {
      this.velocity.x = -this.velocity.x;
    }
  }
}

class Invader {
  constructor({ color, position = { x: null, y: null }, x, y, index, radius }) {
    this.color = color;
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.x = x;
    this.y = y;
    this.index = index;
    this.radius = radius;
    this.neighbours = [];
  }
  
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    // c.closePath();
    c.beginPath();
    c.fillStyle = "black";
    c.fillText(`${this.x},${this.y}`, this.position.x - 10, this.position.y);
    c.fill();
    // console.log(this.neighbours, this.index, [this.x], [this.y])
  }

  remove() {
    for (let i = 0; this.neighbours.length; i++){
      
    }
  }
}

class Grid {
  constructor() {
    this.invaders = [];
    let columns = GRID_COLUMNS;
    let rows = GRID_ROWS;
    let width = (canvas.width - columns * BALL_RADIUS * 2) / 2;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let minus = 0;
        if (y % 2 == 0) {
          minus = BALL_RADIUS;
        }
        const new_invader = new Invader({
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          position: {
            x: BALL_RADIUS * 2 * x + width + minus,
            y: BALL_RADIUS * 1.77 * y + BALL_RADIUS,
          },
          radius: BALL_RADIUS,
          index: this.invaders.length,
          x: x,
          y: y,
        });
        this.invaders.push(new_invader);
        for (let i = 0; i < this.invaders.length; i++) {
          
          if (
            (new_invader.x == this.invaders[i].x - 1 && new_invader.y == this.invaders[i].y) ||
            (new_invader.x == this.invaders[i].x + 1 && new_invader.y == this.invaders[i].y) ||
            (new_invader.y == this.invaders[i].y - 1 && new_invader.x == this.invaders[i].x) ||
            (new_invader.y == this.invaders[i].y + 1 && new_invader.x == this.invaders[i].x)
          ) {
            new_invader.neighbours.push(this.invaders[i]);
            this.invaders[i].neighbours.push(new_invader);
          }
        }
      }
    }
  }
}

// ______________---___constants
let color = COLORS[Math.floor(Math.random() * COLORS.length)];

let player = new Player({
  color: color,
  position: { x: canvas.width / 2, y: canvas.height - BALL_RADIUS },
  radius: BALL_RADIUS,
});

const projectiles = [];

const grid = new Grid();

// ______________---___functions

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0,0, .4)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // _______________Player
  player.draw();
  // _______________projectilse
  projectiles.map((projectile, proIndex) => {
    projectile.update();

    // pause projectile
    if (projectile.position.y <= BALL_RADIUS + 5) {
      projectile.velocity.x = 0;
      projectile.velocity.y = 0;
    }

    // projectile collosion detection
    if (proIndex > 0) {
      for (let i = 0; i < projectiles.length - 1; i++) {
        const dist = Math.hypot(
          projectiles[proIndex].position.y - projectiles[i].position.y,
          projectiles[proIndex].position.x - projectiles[i].position.x
        );

        if (dist <= BALL_RADIUS * 2) {
          projectile.velocity.x = 0;
          projectile.velocity.y = 0;
        }
      }
    }
  });

  // _______________invaders
  grid.invaders.map((invader, invIndex) => {
    invader.draw();

    projectiles.map((projectile, proIndex) => {
      const dist = Math.hypot(
        projectile.position.y - invader.position.y,
        projectile.position.x - invader.position.x
      );

      if (dist < BALL_RADIUS * 2) {
        projectile.velocity.x = 0;
        projectile.velocity.y = 0;

        if (invader.color == projectile.color) {
          projectiles.splice(proIndex, 1);
          grid.invaders.splice(invIndex, 1);
        } else {
          grid.invaders.push(
            new Invader({
              color: projectile.color,
              position: {
                x: projectile.position.x,
                y: projectile.position.y,
              },
              radius: BALL_RADIUS,
              index: grid.invaders.length,
              y: grid.invaders.length / GRID_COLUMNS,
              x: grid.invaders.length / GRID_ROWS,
            })
          );
        }
      }
    });
  });
}

// ____________---___EventListener
addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height + BALL_RADIUS,
    e.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  projectiles.push(
    new Projectile({
      color: color,
      position: { x: canvas.width / 2, y: canvas.height - BALL_RADIUS },
      radius: BALL_RADIUS,
      velocity: velocity,
    })
  );

  // _______________________
  color = COLORS[Math.floor(Math.random() * COLORS.length)];
  player = new Player({
    color: color,
    position: { x: canvas.width / 2, y: canvas.height - BALL_RADIUS },
    radius: BALL_RADIUS,
  });
});

animate();
