export class Car {
  constructor(element, color, offset, keys) {
    this.htmlElement = element;
    this.htmlElement.style.backgroundColor = color;
    this.htmlElement.style.left = `${offset}%`;
    this.keys = keys;
    this.speed = 5;
  }

  move(keyHandlerKeys, roadBoundary) {
    // Get the current position and dimensions of the element
    let { top, bottom, left, height, width } =
      this.htmlElement.getBoundingClientRect();

    const mini = 0;
    const maxi = roadBoundary.width - width;

    switch (true) {
      case keyHandlerKeys.get(this.keys.up):
        top = Math.max(roadBoundary.top, top - this.speed);
        this.htmlElement.style.top = `${top}px`;
        break;

      case keyHandlerKeys.get(this.keys.down):
        bottom = Math.min(roadBoundary.bottom, bottom + this.speed);
        top = bottom - height; // Recalculate the top from the bottom position
        this.htmlElement.style.top = `${top}px`;
        break;

      case keyHandlerKeys.get(this.keys.left):
        // this is relative left position w.r.t road
        left = left - roadBoundary.left;
        left = Math.max(mini, left - this.speed);
        this.htmlElement.style.left = `${left}px`;
        break;

      case keyHandlerKeys.get(this.keys.right):
        left = left - roadBoundary.left;
        left = Math.min(maxi, left + this.speed);
        this.htmlElement.style.left = `${left}px`;
        break;
    }
  }
}
