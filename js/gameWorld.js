class GameWorld {
  constructor() {
    this.canvas = null;
    this.prevGenerationTime = null;
    this.fieldSideSize = 100;
    this.cellSize = 2;
    this.shouldTimeout = 400;
  }

  init(canvasId, fieldSize) {
    this.setSettings(canvasId, fieldSize);
    this.createGrid();

    this.gameLoop();
  }

  setSettings(canvasId, fieldSize = 100) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    this.fieldSideSize = fieldSize;
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.timeGeneration = null;
    this.gameObjects = [];
    this.nextGenerationAlive = [];
    this.shouldTimeout = this.fieldSideSize < 300;
  }

  createGrid() {
    this.cellSize = this.canvas.width / this.fieldSideSize;
    for (let y = 0; y < this.fieldSideSize; y++) {
      for (let x = 0; x < this.fieldSideSize; x++) {
        const isAlive = Math.random() > 0.7;
        if (isAlive) this.gameObjects[`${x}_${y}`] = [x, y];
        this.draw(x, y);
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.fieldSideSize || y < 0 || y >= this.fieldSideSize) {
      return false;
    }

    return !!this.gameObjects[`${x}_${y}`];
  }

  draw(x, y) {
    const isAlive = !!this.gameObjects[`${x}_${y}`];
    this.context.fillStyle = isAlive ? "#ff8080" : "#303030";
    this.context.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  createNextGeneration() {
    this.nextGenerationAlive = {};
    for (let x = 0; x < this.fieldSideSize; x++) {
      for (let y = 0; y < this.fieldSideSize; y++) {
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);

        if (numAlive === 2 || numAlive === 3)
          this.nextGenerationAlive[`${x}_${y}`] = [x, y];
      }
    }

    this.gameObjects = Object.assign({}, this.nextGenerationAlive);
  }

  gameLoop() {
    this.prevGenerationTime = new Date().getTime();

    this.createNextGeneration();
    this.clearBoard();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const key in this.gameObjects) {
      const [x, y] = this.gameObjects[key];
      this.draw(x, y);
    }
    console.log(this.shouldTimeout)
    if (this.shouldTimeout) {
      setTimeout(() => {
        window.requestAnimationFrame(() => this.gameLoop());
        this.renderTimeGeneration();
      }, 400);
    } else {
      window.requestAnimationFrame(() => this.gameLoop());
      this.renderTimeGeneration();
    }
  }

  clearBoard() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderTimeGeneration() {
    const deltaMs = new Date().getTime() - this.prevGenerationTime;
    document.getElementById("render-time").innerHTML = `Рендер: ${deltaMs} ms`;
    console.log(`Generation: ${deltaMs} ms`);
  }
}

export default GameWorld;
