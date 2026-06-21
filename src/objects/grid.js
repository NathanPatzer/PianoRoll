import { Container, Graphics, Rectangle } from 'pixi.js';

class Grid extends Container {

  constructor(options = {}) {
    super();
    this.screenWidth = options.width ?? window.innerWidth;
    this.quantization = options.quantization ?? 4;
    this.screenHeight = options.height ?? window.innerHeight;
    this.cellWidth = options.cellWidth ?? options.cellSize ?? 50;
    this.cellHeight = options.cellHeight ?? options.cellSize ?? 50;
    this.color = options.color ?? 0x000000;
    this.strokeWidth = options.strokeWidth ?? 1;
    this.lineAlpha = options.lineAlpha ?? 1 ;
    this.octaves = options.octaves ?? 7;
    this._draw();
    this._setupInteraction();
  }

  _draw() {
    this.removeChildren();
    const line = new Graphics();
    const noteLine = new Graphics();
    const measureLine = new Graphics();
    const totalHeight = this.octaves * 12 * this.cellHeight;
    const noteWidth = this.cellWidth / this.quantization; 
    for (let column = 0; column <= this.screenWidth / noteWidth; column++) {
      const x = column * noteWidth;
      if (column % (this.quantization * 4) === 0) {
        measureLine.moveTo(x, 0).lineTo(x, totalHeight);
      } 
      else if (column % this.quantization === 0) {
        line.moveTo(x, 0).lineTo(x, totalHeight);
      }
      else {
        noteLine.moveTo(x, 0).lineTo(x, totalHeight);
      }
    } 

    for (let row = 0; row <= this.octaves * 12; row++) {
      const y = row * this.cellHeight;
      line.moveTo(0, y).lineTo(this.screenWidth, y);
    }

    line.stroke({ width: this.strokeWidth, color: this.color, alpha: this.lineAlpha });
    noteLine.stroke({ width: this.strokeWidth, color: this.color, alpha: this.lineAlpha / 2.5 });
    measureLine.stroke({ width: this.strokeWidth * 2, color: this.color, alpha: this.lineAlpha * 1.5 });
    this.addChild(noteLine);
    this.addChild(line);
    this.addChild(measureLine);
  }

_setupInteraction() {
    this.eventMode = 'static';
    const totalHeight = this.octaves * 12 * this.cellHeight;
    const totalWidth = this.screenWidth;
    this.hitArea = new Rectangle(0, 0, this.screenWidth, totalHeight);

    this.on('pointerdown', (e) => {
      if (e.button !== 0) return;

      const local = this.toLocal(e.global);
      var quarterNoteWidth = this.cellWidth / 4;
      
      const cellX = Math.floor(local.x / quarterNoteWidth);
      const cellY = Math.floor(local.y / this.cellHeight);

      const pixelX = cellX * quarterNoteWidth;
      const pixelY = cellY * this.cellHeight;

      this.emit('cellclick', { cellX, cellY, pixelX, pixelY });
    });

    this.on('rightdown', (e) => {
      const local = this.toLocal(e.global);
      var quarterNoteWidth = this.cellWidth / 4;
      const cellX = Math.floor(local.x / quarterNoteWidth);
      const cellY = Math.floor(local.y / this.cellHeight);

      const pixelX = cellX * quarterNoteWidth;
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
