import { Container, Graphics, Rectangle } from 'pixi.js';

class Note extends Container {

    constructor(options = {}) {
        super();
        this.color = options.color ?? 0x42f59b;
        this.noteWidth = options.width ?? 100;
        this.noteHeight = options.height ?? 100;
        this.x = options.x ?? 50;
        this.y = options.y ?? 50;

        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }

    setNoteWidth(width) {
        this.noteWidth = width;
        this.removeChildren();
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }

    setNoteHeight(height) {
        this.noteHeight = height;
        this.removeChildren();
        const rect = new Graphics();
        rect.rect(0, 0, this.noteWidth, this.noteHeight);
        rect.fill(this.color);
        this.addChild(rect);
    }
}

export default Note;
