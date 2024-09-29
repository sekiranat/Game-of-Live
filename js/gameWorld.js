class GameWorld {
  constructor() {
    this.canvas = null;
    this.prevGenerationTime = null;
    this.fieldSideSize = 100;
    this.cellSize = 2;
    this.shouldTimeout = 400;
    this.gameObjects = new Map();
    this.nextGenerationAlive = new Map();
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
    this.shouldTimeout = this.fieldSideSize < 300;
  }

  createGrid() {
    this.cellSize = this.canvas.width / this.fieldSideSize;
    for (let y = 0; y < this.fieldSideSize; y++) {
      for (let x = 0; x < this.fieldSideSize; x++) {
        const isAlive = Math.random() > 0.7;
        if (isAlive) this.gameObjects.set(this.getObjectKey(x, y), [x, y]);
        this.draw(x, y);
      }
    }
  }

  getObjectKey(x, y) {
    return x + '_' + y;
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.fieldSideSize || y < 0 || y >= this.fieldSideSize) {
      return false;
    }

    return !!this.gameObjects.get(this.getObjectKey(x, y));
  }

  draw(x, y) {
    const isAlive = !!this.gameObjects.get(this.getObjectKey(x, y));
    this.context.fillStyle = isAlive ? "#ff8080" : "#303030";
    this.context.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  createNextGeneration() {
    this.nextGenerationAlive.clear();
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
          this.nextGenerationAlive.set(this.getObjectKey(x, y), [x, y]);
      }
    }

    this.gameObjects = new Map(this.nextGenerationAlive)
    console.log(this.nextGenerationAlive)
  }

  gameLoop() {
    console.log(this.nextGenerationAlive)
    this.prevGenerationTime = new Date().getTime();

    this.createNextGeneration();
    this.clearBoard();

    this.gameObjects.forEach((value) => {
      const [x, y] = value;
      this.draw(x, y);
    })

    if (this.shouldTimeout) {
      setTimeout(() => {
        window.requestAnimationFrame(() => this.gameLoop());
        this.renderTimeGeneration();
      }, 200);
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
    const timeGenerationString = 'Рендер:' + deltaMs + 'ms'
    document.getElementById("render-time").innerHTML = timeGenerationString;
    console.log(timeGenerationString);
  }
}

export default GameWorld;
