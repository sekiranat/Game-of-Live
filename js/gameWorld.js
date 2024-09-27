import Cell from "./cell.js";

class GameWorld {
  constructor() {
    this.canvas = null;
    this.prevGenerationTime = null;
    this.cellWidth = 2;
    this.fieldSideSize = 100;
  }

  init(canvasId, fieldSize) {
    this.setSettings(canvasId, fieldSize);
    this.createGrid();

    // Request an animation frame for the first time
    // The gameLoop() function will be called as a callback of this request
    window.requestAnimationFrame(() => this.gameLoop());
  }

  setSettings(canvasId, fieldSize = 100) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    //const fieldSideSize  = this.calculateFieldSize(fieldSize)
    this.fieldSideSize = fieldSize;
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.timeGeneration = null;
    this.gameObjects = [];
  }

  calculateFieldSize(fieldSize) {
    return this.cellWidth * fieldSize;
  }

  createGrid() {
    const cellSize = this.canvas.width / this.fieldSideSize
    for (let y = 0; y < this.fieldSideSize; y++) {
      for (let x = 0; x < this.fieldSideSize; x++) {
        const isAlive = Math.random() > 0.9;
        this.context.fillStyle = isAlive ? "#ff8080" : "#303030";
        this.context.fillRect(
            x * cellSize,
            y * cellSize,
            cellSize,
            cellSize
        );
        this.gameObjects.push(new Cell(this.context, cellSize, x, y,));
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.fieldSideSize || y < 0 || y >= this.fieldSideSize) {
      return false;
    }

    return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
  }

  gridToIndex(x, y) {
    return x + y * this.fieldSideSize;
  }

  checkSurrounding() {
    // Loop over all cells
    for (let x = 0; x < this.fieldSideSize; x++) {
      for (let y = 0; y < this.fieldSideSize; y++) {
        // Count the nearby population
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);
        let centerIndex = this.gridToIndex(x, y);

        if (numAlive == 2) {
          // Do nothing
          this.gameObjects[centerIndex].nextAlive = true;
        } else if (numAlive == 3) {
          // Make alive
          this.gameObjects[centerIndex].nextAlive = true;
        } else {
          // Make dead
          this.gameObjects[centerIndex].nextAlive = false;
        }
      }
    }

    // Apply the new state to the cells
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
    }
  }

  gameLoop() {
    this.prevGenerationTime = new Date().getTime();

    // Check the surrounding of each cell
    this.checkSurrounding();

    // Clear the screen
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all the gameObjects
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw();
    }

    // The loop function has reached it's end, keep requesting new frames
    //window.requestAnimationFrame(() => this.gameLoop());
    this.renderTimeGeneration();
  }

  renderTimeGeneration() {
    const deltaMs = new Date().getTime() - this.prevGenerationTime;
    document.getElementById("render-time").innerHTML = `Рендер: ${deltaMs} ms`;
    console.log(`Generation: ${deltaMs} ms`);
  }
}

export default GameWorld;
