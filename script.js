const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const GRID_ROWS = 5;
let GRID_COLUMNS = 12;

const BALL_RADIUS = 30;
const COLORS = ["red", "aqua", "blue", "yellow", "pink", "purple"];

const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

let TotalWidth = GRID_COLUMNS * BALL_RADIUS * 2;
let GapWidth = (CANVAS_WIDTH - TotalWidth) / 2;

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
    c.shadowColor = this.color;
    c.shadowBlur = 6;
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

    this.position.x += this.velocity.x * 15;
    this.position.y += this.velocity.y * 15;
    if (
      this.position.x <= BALL_RADIUS ||
      this.position.x >= canvas.width - BALL_RADIUS
    ) {
      this.velocity.x = -this.velocity.x;
    }
    if (
      (this.position.x < GapWidth && this.position.y <= BALL_RADIUS + 7) ||
      (this.position.x > GapWidth + TotalWidth &&
        this.position.y < BALL_RADIUS + 3)
    ) {
      projectiles.splice(projectiles.length - 1, 1);
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
    c.shadowColor = this.color;
    c.shadowBlur = 6;
    c.fill();
    // c.closePath();
    c.beginPath();
    c.fillStyle = "black";
    c.fillText(`x${this.x},${this.y}`, this.position.x - 10, this.position.y);
    c.fill();
  }
  // isCherries(obj) {
  //   return this.index === obj.index;
  // }
  remove(color = null) {
    if (!color) {
      color = this.color;
    }

    if (this.neighbours.length) {
      for (let i = 0; i < this.neighbours.length; i++) {
        if (color == this.neighbours[i].color) {
          var current = this;
          var current_index;
          this.neighbours[i].neighbours.map((obj, index) => {
            if (obj.index === current.index) {
              current_index = index;
            }
          });
          if (current_index) {
            this.neighbours[i].neighbours.splice(current_index, 1);
          }
          this.neighbours[i].remove();
        }
      }
    }
    grid.invaders.splice(this.index, 1);
    grid.invaders.map((inv) => {
      if (inv.index > this.index) {
        inv.index = inv.index - 1;
      }
    });
  }
}

class Grid {
  constructor() {
    this.invaders = [];
    let rows = GRID_ROWS;
    let width = (CANVAS_WIDTH - GRID_COLUMNS * BALL_RADIUS * 2) / 2;
    let minuss = 30;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < GRID_COLUMNS; x++) {
        let minus = 0;
        if (y % 2 == 0) {
          // minus = 0;
          minus = BALL_RADIUS;
        }

        const new_invader = new Invader({
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          position: {
            x: BALL_RADIUS * 2 * x + width + minuss,
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
            (new_invader.x == this.invaders[i].x - 1 &&  new_invader.y == this.invaders[i].y) ||
            (new_invader.x == this.invaders[i].x + 1 && new_invader.y == this.invaders[i].y) ||
            (new_invader.y == this.invaders[i].y - 1 && new_invader.x == this.invaders[i].x) ||
            (new_invader.y == this.invaders[i].y + 1 &&
              new_invader.x == this.invaders[i].x) ||
            (new_invader.x == this.invaders[i].x - 1 &&
              new_invader.y == this.invaders[i].y - 1) ||
            (new_invader.x == this.invaders[i].x + 1 &&
              new_invader.y == this.invaders[i].y - 1)
            // (new_invader.x == this.invaders[i].x - 1 && new_invader.y == this.invaders[i].y+1) ||
            // (new_invader.x == this.invaders[i].x + 1 && new_invader.y == this.invaders[i].y+1)
          ) {
            new_invader.neighbours.push(this.invaders[i]);
            this.invaders[i].neighbours.push(new_invader);
          }
        }
      }
      GRID_COLUMNS -= 1;
      minuss += 30;
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
  c.fillStyle = "black";
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
      // for (let i = 0; i < projectiles.length - 1; i++) {
      //   const dist = Math.hypot(
      //     projectiles[proIndex].position.y - projectiles[i].position.y,
      //     projectiles[proIndex].position.x - projectiles[i].position.x
      //   );
      //   if (dist <= BALL_RADIUS * 2) {
      //     projectile.velocity.x = 0;
      //     projectile.velocity.y = 0;
      //   }
      // }
    }
  });

  // _______________invaders

  grid.invaders.map((invader, invIndex) => {
    invader.draw();
    // console.log(invader.index,invader.neighbours.length);
    // console.log(invader.neighbours.length);
    if (invader.neighbours.length == 0) {
      console.log('amir')
    }
    projectiles.map((projectile, proIndex) => {
      const dist = Math.hypot(
        projectile.position.y - invader.position.y,
        projectile.position.x - invader.position.x
      );

      if (dist < BALL_RADIUS * 2 - 2) {
        projectile.velocity.x = 0;
        projectile.velocity.y = 0;

        if (invader.color == projectile.color) {
          projectiles.splice(proIndex, 1);
          invader.remove();
        } else {
          let x1;
          let y1;
          if (projectile.position.y - invader.position.y < BALL_RADIUS) {
            x1 = invader.x + 1;
            y1 = invader.y;
          } else if (projectile.position.y - invader.position.y > BALL_RADIUS) {
            x1 = invader.x;
            y1 = invader.y + 1;
          }
          var new_invader = new Invader({
            color: projectile.color,
            position: {
              x: projectile.position.x,
              y: projectile.position.y,
            },
            radius: BALL_RADIUS,
            index: grid.invaders.length,
            y: y1,
            x: x1,
          });
          new_invader.neighbours.push(invader)
          invader.neighbours.push(new_invader)
          grid.invaders.push(
            new_invader
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
