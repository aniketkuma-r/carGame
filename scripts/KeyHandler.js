export class KeyHandler {
  constructor() {
    this.keys = new Map();
  }
  initialize() {
    // key handler eventlistener to move cars
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      this.keys.set(e.key, true);
    });
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      this.keys.set(e.key, false);
    });
  }
}
