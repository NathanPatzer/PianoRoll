import { Container, Graphics, Rectangle } from 'pixi.js';

class Grid extends Container {

  constructor(options = {}) {
    super();
    this.screenWidth = options.width ?? window.innerWidth;
    this.screenHeight = options.height ?? window.innerHeight;
    this.cellWidth = options.cellWidth ?? options.cellSize ?? 50;
    this.cellHeight = options.cellHeight ?? options.cellSize ?? 50;
    this.color = options.color ?? 0xffffff;
    this.strokeWidth = options.strokeWidth ?? 1;
    this.lineAlpha = options.lineAlpha ?? 1;

    this._draw();
    this._setupInteraction();
  }

  _draw() {
    this.removeChildren();
    const line = new Graphics();

    for (let x = 0; x <= this.screenWidth; x += this.cellWidth) {
      line.moveTo(x, 0).lineTo(x, this.screenHeight);
    }

    for (let y = 0; y <= this.screenHeight; y += this.cellHeight) {
      line.moveTo(0, y).lineTo(this.screenWidth, y);
    }

    line.stroke({ width: this.strokeWidth, color: this.color, alpha: this.lineAlpha });
    this.addChild(line);
  }

_setupInteraction() {
    this.eventMode = 'static';
    this.hitArea = new Rectangle(0, 0, this.screenWidth, this.screenHeight);

    this.on('pointerdown', (e) => {
      if (e.button !== 0) return;

      const local = this.toLocal(e.global);

      const cellX = Math.floor(local.x / this.cellWidth);
      const cellY = Math.floor(local.y / this.cellHeight);

      const pixelX = cellX * this.cellWidth;
      const pixelY = cellY * this.cellHeight;

      this.emit('cellclick', { cellX, cellY, pixelX, pixelY });
    });

    this.on('rightdown', (e) => {
      const local = this.toLocal(e.global);

      const cellX = Math.floor(local.x / this.cellWidth);
      const cellY = Math.floor(local.y / this.cellHeight);

      const pixelX = cellX * this.cellWidth;
      const pixelY = cellY * this.cellHeight;

      this.emit('cellrightclick', { cellX, cellY, pixelX, pixelY });
    });
}

  resize(width) {
    this.screenWidth = width;
    this._draw();
  }

  setCellSize(size) {
    this.cellWidth = size;
    this.cellHeight = size;
    this._draw();
  }

  setCellWidth(width) {
    this.cellWidth = width;
    this._draw();
  }

  setCellHeight(height) {
    this.cellHeight = height;
    this._draw();
  }
}

export default Grid;
