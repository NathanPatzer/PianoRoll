import { Application, Assets, Sprite } from "pixi.js";
import Cursor from './objects/cursor.js';
import Grid from './objects/grid.js';
import Note from './objects/note.js';
import { startAudio, stopAudio } from "./audio/audio.js";

const app = new Application();
var notes = [];

await app.init({ background: "#7c7cd1", resizeTo: window });
var previousGridWidth = app.screen.width;
var previousGridHeight = app.screen.height;
document.getElementById("pixi-container").appendChild(app.canvas);

app.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

const cursor = new Cursor(app.screen.height);
cursor.zIndex = 1;
app.stage.addChild(cursor);

const grid = new Grid({ height: app.screen.height, width: app.screen.width, lineAlpha: 0.15 });
grid.zIndex = 0;
app.stage.addChild(grid);

app.ticker.add((time) => {
  cursor.update(time.deltaTime);
});

document.getElementById("play").addEventListener("click", startAudio);
document.getElementById("stop").addEventListener("click", stopAudio);

document.getElementById('width-grid-slider').addEventListener('input', (e) => {
  previousGridWidth = grid.cellWidth;
  const deltaWidth = Number(e.target.value) - previousGridWidth;
  grid.setCellWidth(Number(e.target.value));
  for (const note of notes) {
    const cellX = Math.floor(note.x / previousGridWidth);
    note.x = cellX * grid.cellWidth;
    note.setNoteWidth(grid.cellWidth);
  }
});

document.getElementById('height-grid-slider').addEventListener('input', (e) => {
  previousGridHeight = grid.cellHeight;
  const deltaHeight = Number(e.target.value) - previousGridHeight;
  grid.setCellHeight(Number(e.target.value));
  for (const note of notes) {
    const cellY = Math.floor(note.y / previousGridHeight);
    note.y = cellY * grid.cellHeight;
    note.setNoteHeight(grid.cellHeight);
  }
});

grid.on('cellclick', (data) => {
  var noteExists = false;
  for (const note of notes) {
    if (note.x === data.pixelX && note.y === data.pixelY) {
      noteExists = true;
      break;
    }
  }
  
  if (noteExists) return;

  const note = new Note({ x: data.pixelX, y: data.pixelY, width: grid.cellWidth, height: grid.cellHeight });
  note.zIndex = 2;
  app.stage.addChild(note);
  notes.push(note);
});

grid.on('cellrightclick', (data) => {
  for (const note of notes) {
    if (note.x === data.pixelX && note.y === data.pixelY) {
      note.destroy();
      notes = notes.filter(n => n !== note);
      break;
    }
  }
});
