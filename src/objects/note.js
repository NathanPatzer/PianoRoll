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
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
        this._setupInteraction();
    }

    setNoteWidth(width) {
        this.noteWidth = width;
        this.quantizedNoteWidth = width;
        this.removeChildren();
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }

    setQuantization(quantization) {
        this.quantization = quantization;
    }

    setNoteHeight(height) {
        this.noteHeight = height;
        this.removeChildren();
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }

    _reDraw(newWidth) {
        this.removeChildren();
        const rect = new Graphics();
        this.hitArea = new Rectangle(0, 0, newWidth, this.noteHeight);
        this.noteWidth = newWidth;
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

        this.on('globalpointermove', (e) => {
            const local = this.toLocal(e.global);
            
            const nearRightEdge = local.x >= this.noteWidth - EDGE_THRESHOLD;
            const nearLeftEdge = local.x <= EDGE_THRESHOLD;
            this.cursor = (nearRightEdge || nearLeftEdge || this.resizingRight || this.resizingLeft) ? 'ew-resize' : 'grab';

            if (this.pointerdown) {
                if (nearRightEdge || this.resizingRight) {
                    this.resizingRight = true;
                    const dx = local.x;
                    const snappedDx = Math.round(dx / this.quantizedNoteWidth) * this.quantizedNoteWidth;
                    const newWidth = Math.max(this.quantizedNoteWidth, snappedDx);

                    if (newWidth !== this.noteWidth) {
                        this._reDraw(newWidth);
                    }
                }
            else if (this.resizingLeft || nearLeftEdge) {
                this.resizingLeft = true;
                const dx = this.noteWidth - local.x;
                const snappedDx = Math.round(dx / this.quantizedNoteWidth) * this.quantizedNoteWidth;
                const newWidth = Math.max(this.quantizedNoteWidth, snappedDx);

                if (newWidth !== this.noteWidth) {
                    const widthDelta = newWidth - this.noteWidth;
                    this.x -= widthDelta;
                    this._reDraw(newWidth);
                }
            }
         }
        });

        this.on('pointerdown', (e) => {
            this.pointerdown = true;
            const local = this.toLocal(e.global);
            const nearRightEdge = local.x >= this.noteWidth - EDGE_THRESHOLD;

            if (nearRightEdge) {
                // handle resize
            } else {
                // handle drag/click
            }
        });

        this.on('pointerupoutside', (e) => {
            this.pointerdown = false;
            this.resizingRight = false;
            this.resizingLeft = false;
        });

        this.on('pointerup', (e) => {
            this.pointerdown = false;
            this.resizingRight = false;
            this.resizingLeft = false;
        });
    }
}

export default Note;
