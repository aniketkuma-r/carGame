const audioBtn = document.querySelector("#audio-btn");
const audioIcon = document.querySelector("#icon-audio");

export class SoundManager {
  constructor(filePath) {
    this.audio = new Audio(filePath);
    this.isOn = false;
    this.userPreferences = {};
    this.userPreferences.isSoundOn = true;
    
    this.audioBtn = audioBtn;
    this.audioIcon = audioIcon;
  }

  initialize() {
    this.audio.autoplay = this.isOn;
    this.audio.loop = true;

    // event listeners for toggle sound(on/ off)
    this.audioBtn.addEventListener("click", () =>
      this.isOn ? this.pause() : this.play()
    );
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      e.key.toLowerCase() === "m" &&
        (this.isOn ? this.pause() : this.play());
    });
    this.updateIcon();
  }

  updateIcon() {
    // console.log(`Updating icon. Is music playing? ${this.isOn}`);
    // Toggle the icons for volume high/mute based on the `isOn` state
    this.audioIcon.classList.toggle("fa-volume-high", this.isOn);
    this.audioIcon.classList.toggle("fa-volume-mute", !this.isOn);
  }

  play() {
    this.audio.play();
    this.isOn = true;
    this.updateIcon();
    this.userPreferences.isSoundOn = true;
  }

  pause() {
    this.audio.pause();
    this.isOn = false;
    this.updateIcon();
    this.userPreferences.isSoundOn = false;
  }
}
