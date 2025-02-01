import { Car } from "./Car.js";
import { KeyHandler } from "./KeyHandler.js";
import { SoundManager } from "./SoundManager.js";
import { cars, audioFilePath } from "./properties.js";

const highScore = document.querySelector("#high-score");
const scores = document.querySelectorAll(".score");
const instructionPanel = document.querySelector("#instruction-panel");
const resultBox = document.querySelector("#result-box");
const road = document.querySelector("#road");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseIcon = document.querySelector("#icon-play-pause");

export class Game {
  constructor() {
    this.isOn = false;
    this.isOver = false;
    this.highScore = 0;
    this.score = 0;
    this.cars = [];
    this.reverseCars = [];

    this.instructionPanel = instructionPanel;
    this.resultBox = resultBox;
    this.playPauseBtn = playPauseBtn;
    this.playPauseIcon = playPauseIcon;
    this.road = road;
    this.road.boundary = this.road.getBoundingClientRect();
  }

  initialize() {
    // this will reset all HTMLChild inside road div
    this.reset();

    // it deals with sound/ music-player
    this.soundManager = new SoundManager(audioFilePath);
    this.soundManager.initialize();

    // key handler for moving objects (car)
    this.keyHandler = new KeyHandler();
    this.keyHandler.initialize();

    // Game Play/ Pause eventlisteneer
    this.playPauseBtn.addEventListener("click", () => this.handlePlayPause());
    this.instructionPanel.addEventListener("click", () =>
      this.handlePlayPause()
    );
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      (e.code === "Space" || e.code === "Enter") && this.handlePlayPause();
    });
  }

  reset() {
    // clear all html child if any present already
    while (this.road.firstChild) {
      this.road.removeChild(this.road.firstChild);
    }
    // reset properties
    this.score = 0;
    this.cars = [];
    this.reverseCars = [];

    scores.forEach((score) => (score.innerText = this.score));
    // create cars for player
    this.cars = cars.map((car) => {
      const _car = document.createElement("div");
      _car.setAttribute("class", "car");
      this.road.appendChild(_car);
      return new Car(_car, car.color, car.offset, car.keys);
    });

    // create road-line
    for (let i = 0; i < 15; i++) {
      const roadLine = document.createElement("div");
      roadLine.setAttribute("class", "road-line");
      this.road.appendChild(roadLine);
      roadLine.style.top = `${i * 200}px`;
    }

    // create car in opposite direction
    for (let i = 1; i <= 12; i++) {
      const reverseCar = document.createElement("div");
      reverseCar.setAttribute("class", "reverse-car");
      this.road.appendChild(reverseCar);
      reverseCar.style.top = `${i * 250 * -1}px`;

      const offset = Math.floor(Math.min(95, Math.max(5, Math.random() * 100)));
      const color = (() => {
        const decimalToHex = (num) => num.toString(16).padStart(2, "0");
        let hexCode = "#";
        for (let i = 0; i < 3; i++) {
          hexCode += decimalToHex(Math.floor(Math.random() * 256));
        }
        return hexCode;
      })();
      this.reverseCars.push(new Car(reverseCar, color, offset));
    }
  }

  handlePlayPause() {
    this.isOn ? this.pause() : this.play();
  }

  updateIcon() {
    // console.log(`Updating icon. Is Game ON? ${this.isOn}`);
    // Toggle the icons for volume high/mute based on the `isSoundOn` state
    this.playPauseIcon.classList.toggle("fa-play", this.isSoundOn);
    this.playPauseIcon.classList.toggle("fa-pause", !this.isSoundOn);
  }

  play() {
    if (this.isOver) {
      this.reset();
      this.isOver = false;
    }
    this.isOn = true;
    this.updateIcon();
    if(this.soundManager.userPreferences.isSoundOn) this.soundManager.play();
    this.instructionPanel.style.display = "none";
    this.resultBox.style.display = "none";
    this.animation();
    // console.log("playing");
  }

  pause() {
    this.isOn = false;
    this.updateIcon();
    this.instructionPanel.style.display = "block";
    if (this.isOver) this.resultBox.style.display = "block";
    // console.log("pause");
  }

  end() {
    this.isOver = true;
    this.pause();
  }

  move() {
    // move road-lines
    const roadLines = document.querySelectorAll(".road-line");
    roadLines.forEach((roadLine) => {
      const boundary = roadLine.getBoundingClientRect();
      if (boundary.top > 2800) {
        roadLine.style.top = "-200px";
      } else roadLine.style.top = `${boundary.top + this.cars[0].speed}px`;
    });

    this.reverseCars.forEach((reverseCar) => {
      const speedIncrements = [
        { limit: 250, speed: 3 },
        { limit: 500, speed: 5 },
        { limit: 750, speed: 6 },
        { limit: 1000, speed: 7 },
        { limit: 1500, speed: 8 },
        { limit: 2000, speed: 9 },
        { limit: 3000, speed: 10 },
        { limit: Infinity, speed: 12 },
      ];

      reverseCar.speed = speedIncrements.find(
        (item) => this.score <= item.limit
      ).speed;
      const boundary = reverseCar.htmlElement.getBoundingClientRect();
      if (boundary.top > 2800) {
        reverseCar.htmlElement.style.top = "-200px";
        reverseCar.htmlElement.style.left = `${Math.floor(
          Math.min(95, Math.max(5, Math.random() * 100))
        )}%`;
      } else
        reverseCar.htmlElement.style.top = `${
          boundary.top + reverseCar.speed
        }px`;
    });
  }

  isCollision() {
    const [car1, car2] = this.cars;
    car1.boundary = car1.htmlElement.getBoundingClientRect();
    car2.boundary = car2.htmlElement.getBoundingClientRect();
    let isCollide = !(
      car1.boundary.right < car2.boundary.left ||
      car1.boundary.left > car2.boundary.right ||
      car1.boundary.top > car2.boundary.bottom ||
      car1.boundary.bottom < car2.boundary.top
    );
    // console.log(car1.boundary, car2.boundary);
    if (isCollide) return true;

    for (let reverseCar of this.reverseCars) {
      reverseCar.boundary = reverseCar.htmlElement.getBoundingClientRect();
      for (let car of this.cars) {
        car.boundary = car.htmlElement.getBoundingClientRect();
        isCollide = !(
          car.boundary.right < reverseCar.boundary.left ||
          car.boundary.left > reverseCar.boundary.right ||
          car.boundary.top > reverseCar.boundary.bottom ||
          car.boundary.bottom < reverseCar.boundary.top
        );
        if (isCollide) return true;
      }
    }

    return false;
  }

  animation() {
    if (this.isOn) {
      if (this.isCollision()) this.end();

      // moving NPA objects (roadLines, car moving in opposite direction)
      this.move();

      // moving playing objects (cars)
      this.cars.forEach((car) =>
        car.move(this.keyHandler.keys, this.road.boundary)
      );

      this.score++;
      this.highScore = Math.max(this.highScore, this.score);
      scores.forEach((score) => (score.innerText = this.score));
      highScore.innerText = this.highScore;
      window.requestAnimationFrame(() => this.animation());
    }
  }
}
