const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const score = select("#score");
const startScreen = select(".startScreen");
const gameArea = select(".gameArea");
const gameAreaDimension = gameArea.getBoundingClientRect();
const car1 = select("#car1");
const car2 = select("#car2");
const iconMusic = select(".icon-music");
const iconPlayPause = select(".icon-play");

const player = {
  play: false,
  firstGame: true,
  gameOver: false,
  score: 0,
  speed: 5,
  soundOn: true,
};

const Sound = new Audio("rock-it-21275.mp3");

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  w: false,
  s: false,
  d: false,
  a: false,
};

const randomColor = () => {
  const c = () => Math.floor(Math.random() * 256).toString(16);
  return `#${c()}${c()}${c()}`;
};

const handleKeyDown = (e) => {
  e.preventDefault();
  keys[e.key] = true;
};

const handleKeyUp = (e) => {
  e.preventDefault();
  keys[e.key] = false;
};

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

const handleMusic = () => {
  iconMusic.classList.toggle("fa-volume-high", !player.soundOn);
  iconMusic.classList.toggle("fa-volume-mute", player.soundOn);
  player.soundOn = !player.soundOn;
  player.soundOn ? Sound.play() : Sound.pause();
};

const handleGame = () => {
  if (player.firstGame) {
    console.log("pehla game hai bhai khelne de");
    player.firstGame = false;
    player.play = true;
    startGame();
  } else if (player.gameOver) {
    console.log("game khatam ho gya tha");
    restartGame();
  } else {
    togglePlayPause();
  }
};

const togglePlayPause = () => {
  if(player.gameOver) restartGame();
  iconPlayPause.classList.toggle("fa-play", player.play);
  iconPlayPause.classList.toggle("fa-pause", !player.play);
  player.play = !player.play;
  player.play ? resumeGame() : pauseGame();
};

const moveLines = () => {
  const lines = selectAll(".lines");
  lines.forEach((item) => {
    if (item.y >= 2800) {
      item.y = -200;
    }

    item.y += player.speed;
    item.style.top = `${item.y}px`;
  });
};

const controlPlayer = (car, keyUp, keyDown, keyLeft, keyRight) => {
  const carRect = car.getBoundingClientRect();

  if (keys[keyUp] && carRect.top > gameAreaDimension.top) {
    car.top = Math.max(car.top - player.speed, 0);
  }
  if (keys[keyDown] && carRect.bottom < gameAreaDimension.bottom) {
    car.top = Math.min(
      car.top + player.speed,
      gameAreaDimension.bottom - carRect.height
    );
  }
  if (keys[keyLeft] && carRect.left > gameAreaDimension.left) {
    car.left = Math.max(car.left - player.speed, 0);
  }
  if (keys[keyRight] && carRect.right < gameAreaDimension.right) {
    car.left = Math.min(
      car.left + player.speed,
      gameAreaDimension.width - carRect.width
    );
  }

  car.style.top = `${car.top}px`;
  car.style.left = `${car.left}px`;
};

const isCollide = (enemy) => {
  const A1 = car1.getBoundingClientRect();
  const A2 = car2.getBoundingClientRect();
  const E = enemy.getBoundingClientRect();

  return !(
    (A1.bottom <= E.top ||
      A1.top >= E.bottom ||
      A1.right <= E.left ||
      A1.left >= E.right) &&
    (A2.bottom <= E.top ||
      A2.top >= E.bottom ||
      A2.right <= E.left ||
      A2.left >= E.right) &&
    (A2.bottom <= A1.top ||
      A2.top >= A1.bottom ||
      A2.right <= A1.left ||
      A2.left >= A1.right)
  );
};

const moveEnemy = () => {
  const enemy = selectAll(".enemy-car");
  enemy.speed = () => {
    const score = player.score;
    switch (true) {
      case score <= 500:
        return player.speed - 2;
      case score <= 1000:
        return player.speed;
      case score <= 2000:
        return player.speed + 1;
      case score <= 3500:
        return player.speed + 2;
      case score <= 5500:
        return player.speed + 4;
      case score <= 8000:
        return player.speed + 6;
      case score <= 10000:
        return player.speed + 9;
      default:
        return player.speed + 12;
    }
  };

  enemy.forEach((item) => {
    {
      isCollide(item) && gameOver();
    }

    if (item.y >= 2800) {
      item.y = -200;
      item.style.left = `${Math.floor(
        Math.min(0.95, Math.max(0.05, Math.random())) * gameArea.offsetWidth
      )}px`;
    }

    item.y += enemy.speed();
    item.style.top = `${item.y}px`;
  });
};

const gameOver = () => {
  player.play = false;
  player.gameOver = true;

  startScreen.classList.remove("hide");
  startScreen.innerHTML = `GAME OVER <br>
  YOUR FINAL SCORE IS ${player.score + 1} <br>
  PRESS 'ENTER' OR 'SPACE' TO RESTART THE GAME`;
};

const gamePlay = () => {
  if (player.play) {
    moveLines();
    controlPlayer(car1, "w", "s", "a", "d");
    controlPlayer(car2, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
    moveEnemy();

    player.score++;
    score.innerText = player.score;
    window.requestAnimationFrame(gamePlay);
  }
};

const startGame = () => {
  startScreen.classList.add("hide");
  Sound.play();

  window.requestAnimationFrame(gamePlay);

  for (let x = 0; x < 15; x++) {
    let roadLine = document.createElement("div");
    roadLine.setAttribute("class", "lines");
    roadLine.y = x * 200;
    roadLine.style.top = `${roadLine.y}px`;
    gameArea.appendChild(roadLine);
  }

  car1.top = car1.getBoundingClientRect().top;
  car1.left = car1.getBoundingClientRect().left - gameAreaDimension.left;
  car2.top = car2.getBoundingClientRect().top;
  car2.left = car2.getBoundingClientRect().left - gameAreaDimension.left;
  car1.initialTop = car1.top;
  car1.initialLeft = car1.left;
  car2.initialTop = car2.top;
  car2.initialLeft = car2.left;

  for (let x = 1; x <= 12; x++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy-car");
    enemyCar.y = x * 250 * -1;
    enemyCar.style.top = `${enemyCar.y}px`;
    enemyCar.style.backgroundColor = randomColor();
    enemyCar.style.left = `${Math.floor(
      Math.min(0.95, Math.max(0.05, Math.random())) * gameAreaDimension.width
    )}px`;
    gameArea.appendChild(enemyCar);
  }
};

const restartGame = () => {
  selectAll(".lines, .enemy-car").forEach((e) => e.remove());
  player.score = 0;
  car1.style.top = `${car1.initialTop}px`;
  car1.style.left = `${car1.initialLeft}px`;
  car2.style.top = `${car2.initialTop}px`;
  car2.style.left = `${car2.initialLeft}px`;
  player.play = true;
  player.gameOver = false;
  startGame();
};

const resumeGame = () => {
  player.play = true;
  Sound.play();
  window.requestAnimationFrame(gamePlay);
};

const pauseGame = () => {
  player.play = false;
};

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    handleGame();
  } else if (e.key === "m") handleMusic();
});
