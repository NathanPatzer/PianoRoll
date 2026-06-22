import { Container, Graphics, Rectangle } from 'pixi.js';

class Note extends Container {

    constructor(options = {}) {
        super();
        this.quantization = options.quantization ?? 1;
        this.color = options.color ?? 0x42f59b;
        this.noteWidth = options.width ?? 100;
        this.quantizedNoteWidth = options.width;
        this.noteHeight = options.height ?? 100;
        this.x = options.x ?? 50;
        this.y = options.y ?? 50;
        this.pointerdown = false;
        this.resizingRight = false;
        this.resizingLeft = false;
        this.moving = false;
        this.moveStartX = undefined;
        this.moveStartY = undefined;
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
        this._setupInteraction();
    }

    setNoteWidth(width) {
        var noteLength = Math.round(this.noteWidth / this.quantizedNoteWidth);
        var newWidth = width * noteLength;
        this.quantizedNoteWidth = width;
        this._reDraw(newWidth, this.noteHeight);
    }

    setQuantization(quantization) {
        this.quantization = quantization;
    }

    setNoteHeight(height) {
        this._reDraw(this.noteWidth, height);
    }

    _reDraw(newWidth, newHeight) {
        this.removeChildren();
        const rect = new Graphics();
        this.hitArea = new Rectangle(0, 0, newWidth, newHeight);
        this.noteWidth = newWidth;
        this.noteHeight = newHeight;
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }

    _setupInteraction() {
        this.eventMode = 'static';
        this.hitArea = new Rectangle(0, 0, this.noteWidth, this.noteHeight);
        let resizeStartX = 0;
        let resizeStartWidth = 0;
        const EDGE_THRESHOLD = 10;
        this.moveStartX = 0;
        this.on('globalpointermove', (e) => {
            const local = this.toLocal(e.global);
            
            const nearRightEdge = local.x >= this.noteWidth - EDGE_THRESHOLD;
            const nearLeftEdge = local.x <= EDGE_THRESHOLD;
            this.cursor = (nearRightEdge || nearLeftEdge || this.resizingRight || this.resizingLeft) ? 'ew-resize' : 'grab';

            if (this.pointerdown) {
                if ((nearRightEdge || this.resizingRight) && !this.resizingLeft && !this.moving) {
                    this.resizingRight = true;
                    const dx = local.x;
                    const snappedDx = Math.round(dx / this.quantizedNoteWidth) * this.quantizedNoteWidth;
                    const newWidth = Math.max(this.quantizedNoteWidth, snappedDx);

                    if (newWidth !== this.noteWidth) {
                        this._reDraw(newWidth, this.noteHeight);
                    }
                }
                else if ((this.resizingLeft || nearLeftEdge) && !this.resizingRight && !this.moving) {
                    this.resizingLeft = true;
                    const dx = this.noteWidth - local.x;
                    const snappedDx = Math.round(dx / this.quantizedNoteWidth) * this.quantizedNoteWidth;
                    const newWidth = Math.max(this.quantizedNoteWidth, snappedDx);

                    if (newWidth !== this.noteWidth) {
                        const widthDelta = newWidth - this.noteWidth;
                        this.x -= widthDelta;
                        this._reDraw(newWidth, this.noteHeight);
                    }
                }
                else if ((!this.resizingRight && !this.resizingLeft) || this.moving) {
                    this.moving = true;
                    if (this.moveStartX === undefined) {
                        this.moveStartX = local.x;
                    }

                    if (this.moveStartY === undefined) {
                        this.moveStartY = local.y;
                    }
                    const dx = local.x - this.moveStartX;
                    const dy = local.y - this.moveStartY;
                    if (Math.abs(dx) >= this.quantizedNoteWidth) {
                        this.moveStartX = undefined;
                        var moveDir = dx > 0 ? 1 : -1;
                        this.x += this.quantizedNoteWidth * moveDir;
                    }

                    if (Math.abs(dy) >= this.noteHeight) {
                        this.moveStartY = undefined;
                        var moveDirY = dy > 0 ? 1 : -1;
                        this.y += this.noteHeight * moveDirY;
                    }
                }
            }
        });

        this.on('pointerdown', (e) => {
            this.pointerdown = true;
        });

        this.on('pointerupoutside', (e) => {
            this.pointerdown = false;
            this.resizingRight = false;
            this.resizingLeft = false;
            this.moving = false;
            this.moveStartX = undefined;
            this.moveStartY = undefined;
        });

        this.on('pointerup', (e) => {
            this.pointerdown = false;
            this.resizingRight = false;
            this.resizingLeft = false;
            this.moving = false;
            this.moveStartX = undefined;
            this.moveStartY = undefined;
        });
    }
}

export default Note;
