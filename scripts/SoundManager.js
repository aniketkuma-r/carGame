const audioBtn = document.querySelector("#audio-btn");
const audioIcon = document.querySelector("#icon-audio");

export class SoundManager {
  constructor(filePath) {
    this.audio = new Audio(filePath);
    this.isSoundOn = false;
    this.audioBtn = audioBtn;
    this.audioIcon = audioIcon;
  }

  initialize() {
    this.audio.autoplay = this.isSoundOn;
    this.audio.loop = true;

    // event listeners for toggle sound(on/ off)
    this.audioBtn.addEventListener("click", () =>
      this.isSoundOn ? this.pause() : this.play()
    );
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      e.key.toLowerCase() === "m" &&
        (this.isSoundOn ? this.pause() : this.play());
    });
    this.updateIcon();
  }

  updateIcon() {
    // console.log(`Updating icon. Is music playing? ${this.isSoundOn}`);
    // Toggle the icons for volume high/mute based on the `isSoundOn` state
    this.audioIcon.classList.toggle("fa-volume-high", this.isSoundOn);
    this.audioIcon.classList.toggle("fa-volume-mute", !this.isSoundOn);
  }

  play() {
    this.audio.play();
    this.isSoundOn = true;
    this.updateIcon();
  }

  pause() {
    this.audio.pause();
    this.isSoundOn = false;
    this.updateIcon();
  }
}
