import { Container, Graphics } from 'pixi.js';

class Cursor extends Container {

  constructor(options = {}) {
    super();
    this.cellWidth = options.cellWidth ?? 100;
    this.bpm = options.bpm ?? 120;
    const beatsPerSecond = this.bpm / 60;
    this.speed = this.cellWidth * beatsPerSecond;
    this.screenHeight = options.height ?? window.innerHeight;
    this.isPaused = false;

    this.graphic = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, this.screenHeight)
      .stroke({ width: 1, color: options.color ?? 0xffffff });

    this.g = new Graphics();
        this.g.poly([-10,0, 10,0, 0,10], true)
        this.g.fill({ color: 0xffffff });

    this.addChild(this.graphic);
    this.addChild(this.g);

    this.x = options.x ?? 0;
    this.y = 0;

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isPaused = !this.isPaused;
      }
    });

    this._setupDrag();
    this._setupPause();
    this._updateCursorSpeed();
  }

  _setupPause() {

  }

  _updateCursorSpeed(cellWidth) {
    if (!cellWidth) return;
    const beatsPerSecond = this.bpm / 60; 
    this.speed = cellWidth * beatsPerSecond;
  }

  _setupDrag() {
    this.eventMode = 'static';
    this.cursor = 'ew-resize';

    this.hitArea = { x: -10, y: 0, width: 20, height: this.screenHeight,
      contains(px, py) { return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height; }
    };

    this.on('pointerdown', (e) => {
      this.isDragging = true;
      this.dragOffsetX = e.globalX - this.x;
      e.stopPropagation();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      this.x = e.clientX - this.dragOffsetX;
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  update(deltaMS) {
    if (this.isDragging || this.isPaused) return;
    this.x += (this.speed / 1000) * deltaMS;

    if (this.x > window.innerWidth) {
        this.x = 0;
    }
  }
}

export default Cursor;