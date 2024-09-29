class GameWorld {
  constructor() {
    this.canvas = null;
    this.prevGenerationTime = null;
    this.boardSideSize = 20;
    this.cellSize = 2;
    this.shouldTimeout = 400;
    this.gameObjects = new Map();
    this.nextGenerationAlive = new Map();
    this.timeGeneration = null;
  }

  create(canvasId, boardSideSize) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.boardSideSize = boardSideSize;
    this.cellSize = this.canvas.width / this.boardSideSize;

    this.setListeners();
  }

  applySettings(boardSideSize) {
    this.setSettings(boardSideSize);
  }

  start() {
    if(!this.gameObjects.size) this.createFirstGeneration();
    this.gameLoop();
  }

  setSettings(boardSideSize = 100) {
    this.boardSideSize = boardSideSize;
    this.shouldTimeout = boardSideSize < 300;
    this.cellSize = this.canvas.width / this.boardSideSize;
  }

  createFirstGeneration() {
    for (let y = 0; y < this.boardSideSize; y++) {
      for (let x = 0; x < this.boardSideSize; x++) {
        const isAlive = Math.random() > 0.95;
        if (isAlive) this.setGameObjectByXY(x, y);
        this.draw(x, y);
      }
    }
  }
  
  setGameObjectByXY(x, y) {
    this.gameObjects.set(this.getObjectKey(x, y), [x, y])
  }

  getObjectKey(x, y) {
    return x + "_" + y;
  }

  isAlive(x, y) {
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
    for (let x = 0; x < this.boardSideSize; x++) {
      for (let y = 0; y < this.boardSideSize; y++) {
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);

          console.log(x, y)

        if (numAlive === 2 || numAlive === 3)
          this.nextGenerationAlive.set(this.getObjectKey(x, y), [x, y]);
      }
    }

    this.gameObjects = new Map(this.nextGenerationAlive);
  }

  gameLoop() {
    this.prevGenerationTime = new Date().getTime();

    this.createNextGeneration();
    this.clearBoard();

    this.gameObjects.forEach((value) => {
      const [x, y] = value;
      this.draw(x, y);
    });

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

  setListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const [xClick, yClick ] = this.getCursorPosition(this.canvas, e);
      const x = Math.floor(xClick / this.cellSize)
      const y = Math.floor(yClick / this.cellSize)
      this.setGameObjectByXY(x, y)
      this.draw(x, y)
    });
  }

  getCursorPosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [ x, y ];
  }

  renderTimeGeneration() {
    const deltaMs = new Date().getTime() - this.prevGenerationTime;
    const timeGenerationString = "Рендер: " + deltaMs + "ms";
    document.getElementById("render-time").innerHTML = timeGenerationString;
    console.log(timeGenerationString);
  }
}

export default GameWorld;
