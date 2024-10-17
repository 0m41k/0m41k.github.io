const endGameDialog = document.querySelector(".end-game");
const score = document.querySelector(".score");
const btn_restart = document.querySelector(".restart");
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const gameover = document.querySelector(".game-over");
const bestscor = document.querySelector(".bestScore");
const chetchik = document.querySelector(".chetchik");

class Bird {
  constructor() {
    this.start_x = 50;
    this.start_y = 50;
    this.x = this.start_x;
    this.y = this.start_y;
    this.width = 50;
    this.height = 50;
    this.speed = 0;
    this.acceleration = 0.4;
    this.image = new Image();
    this.image.src = "/FlappyBird/free-icon-bird-10132640.png";
    this.jump_forse = -9;
    this.point = 0;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  gravity() {
    this.speed += this.acceleration;
    this.y += this.speed;
  }
  jump() {
    document.addEventListener("keydown", (event) => {
      if (event.code == "Space") {
        this.speed = this.jump_forse;
      }
    });
  }
}

class Pipe {
  constructor(x) {
    let interval = 200;
    let min_h = 50;
    let max_random_h = canvas.height - min_h - min_h - interval;

    let speed = -1.5;
    let width = 50;
    this.fly = false;

    this.top_pipe = {
      start_x: x,
      x: x,
      y: 0,
      width: width,
      height: (min_h = Math.round(Math.random() * max_random_h)),
      speed: speed,
    };

    this.bottom_pipe = {
      start_x: x,
      x: x,
      y: this.top_pipe.height + interval,
      width: width,
      height: canvas.height - this.top_pipe.height - interval,
      speed: speed,
    };
  }
  draw() {
    ctx.fillStyle = "#333";
    ctx.fillRect(
      this.top_pipe.x,
      this.top_pipe.y,
      this.top_pipe.width,
      this.top_pipe.height
    );

    ctx.fillRect(
      this.bottom_pipe.x,
      this.bottom_pipe.y,
      this.bottom_pipe.width,
      this.bottom_pipe.height
    );
  }
  move() {
    this.top_pipe.x += this.top_pipe.speed;
    this.bottom_pipe.x += this.bottom_pipe.speed;
    if (this.top_pipe.x < -this.top_pipe.width) {
      this.top_pipe.x = canvas.width;
      this.bottom_pipe.x = canvas.width;
      let interval = 200;
      let min_h = 50;
      let max_random_h = canvas.height - min_h - min_h - interval;

      this.top_pipe.height = min_h + Math.round(Math.random() * max_random_h);
      this.bottom_pipe.y = this.top_pipe.height + interval;
      this.bottom_pipe.height = canvas.height - this.top_pipe.height - interval;
      this.fly = false;
    }
  }
}

let first_x = canvas.width / 2;
let pipe_one = new Pipe(first_x);
let pipe_two = new Pipe(first_x + (canvas.width + pipe_one.top_pipe.width) / 2);

const bird = new Bird();

function istCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function isRightOf(rectA, rectB) {
  return rectA.x > rectB.x + rectB.width;
}

function endGame() {
  gameover.innerHTML = "Game Over";
  btn_restart.innerHTML = "Restart";
  endGameDialog.classList.add("end-game__open");
  score.innerHTML = "Your score: " + bird.point;
  if (bird.point > chetchik.innerHTML) {
    bestscor.innerHTML = "Your best score: " + bird.point;
    chetchik.innerHTML = bird.point;
  }
}

btn_restart.addEventListener("click", function () {
  endGameDialog.classList.remove("end-game__open"); // Исправленная строка
  bird.x = bird.start_x;
  bird.y = bird.start_y;
  bird.speed = 0;
  bird.point = 0;

  pipe_one.top_pipe.x = first_x;
  pipe_one.bottom_pipe.x = first_x;

  pipe_two.top_pipe.x = first_x + (canvas.width + pipe_one.top_pipe.width) / 2;
  pipe_two.bottom_pipe.x =
    first_x + (canvas.width + pipe_one.top_pipe.width) / 2;

  loop();
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.draw();
  bird.gravity();
  bird.jump();
  pipe_one.draw();
  pipe_two.draw();
  pipe_one.move();
  pipe_two.move();

  if (isRightOf(bird, pipe_one.top_pipe) && pipe_one.fly == false) {
    pipe_one.fly = true;
    bird.point++;
    console.log(bird.point);
  }
  if (isRightOf(bird, pipe_two.top_pipe) && pipe_two.fly == false) {
    pipe_two.fly = true;
    bird.point++;
    console.log(bird.point);
  }

  if (istCollision(bird, pipe_one.top_pipe)) {
    endGame();
    return;
  }
  if (istCollision(bird, pipe_one.bottom_pipe)) {
    endGame();
    return;
  }
  if (istCollision(bird, pipe_two.top_pipe)) {
    endGame();
    return;
  }
  if (istCollision(bird, pipe_two.bottom_pipe)) {
    endGame();
    return;
  }

  if (bird.y < 0 || bird.y + bird.width > canvas.height) {
    endGame();
    return;
  }

  requestAnimationFrame(loop);
}

endGameDialog.classList.add("end-game__open");
