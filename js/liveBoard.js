class LiveBoard{
  constructor() {
    this.canvas;
    this.prevGenerationTime;
    this.cellsQuantity;
    this.timeGeneration;
    this.shouldTimeout;
    this.cellSize;
    this.gameObjects = new Map();
    this.nextGenerationAlive = new Map();
    this.timeout;
    this.isPlaying = false;

    this.canvasSize = 600;
    this.maxSideSizeWithTimeout = 700;
    this.aliveColor = "#00FF00";
    this.deadColor = "#303030";
    this.timeout = 400;
    this.aliveChance = 0.95
  }

  create(canvasId, cellsQuantity) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.cellsQuantity = cellsQuantity;
    this.cellSize = this.canvas.width / this.cellsQuantity;

    this.setListeners();
  }

  applySettings(cellsQuantity) {
    this.setSettings(cellsQuantity);
  }

  start() {
    if (this.isPlaying) this.resetSettings();
    this.isPlaying = true;

    if (!this.gameObjects.size) this.createFirstGeneration();
    this.applySettings(this.cellsQuantity);
    this.gameLoop();

  }

  resetSettings() {
    clearTimeout(this.timeoutId);
    this.prevGenerationTime = NaN;
    this.gameObjects = new Map();
    this.nextGenerationAlive = new Map();
  }

  setSettings(cellsQuantity) {
    this.cellsQuantity = cellsQuantity;
    this.shouldTimeout = cellsQuantity < this.maxSideSizeWithTimeout;
    this.cellSize = this.canvas.width / this.cellsQuantity;
  }

  createFirstGeneration() {
    for (let y = 0; y < this.cellsQuantity; y++) {
      for (let x = 0; x < this.cellsQuantity; x++) {
        const isAlive = Math.random() > this.aliveChance;
        if (isAlive) this.setGameObjectByXY(x, y);
        this.draw(x, y);
      }
    }
  }

  setGameObjectByXY(x, y) {
    this.gameObjects.set(this.getObjectKey(x, y), [x, y]);
  }

  getObjectKey(x, y) {
    return x + "_" + y;
  }

  isAlive(x, y) {
    return !!this.gameObjects.get(this.getObjectKey(x, y));
  }

  draw(x, y) {
    const isAlive = !!this.gameObjects.get(this.getObjectKey(x, y));
    this.context.fillStyle = isAlive ? this.aliveColor : this.deadColor;
    this.context.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  createNextGeneration() {
    this.nextGenerationAlive.clear();
    for (let x = 0; x < this.cellsQuantity; x++) {
      for (let y = 0; y < this.cellsQuantity; y++) {
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

    this.gameObjects = new Map(this.nextGenerationAlive);
  }

  gameLoop() {
    this.renderAdditionalInfo();
    this.prevGenerationTime = new Date().getTime();

    this.createNextGeneration();
    this.clearBoard();

    this.gameObjects.forEach((value) => {
      const [x, y] = value;
      this.draw(x, y);
    });

    if (this.shouldTimeout) {
      this.timeoutId = setTimeout(
        () => window.requestAnimationFrame(() => this.gameLoop()),
        this.timeout
      );
    } else {
      window.requestAnimationFrame(() => this.gameLoop());
    }
  }

  clearBoard() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const [xClick, yClick] = this.getCursorPosition(this.canvas, e);
      const x = Math.floor(xClick / this.cellSize);
      const y = Math.floor(yClick / this.cellSize);
      if (this.gameObjects.has(this.getObjectKey(x, y)))
        this.gameObjects.delete(this.getObjectKey(x, y));
      else this.setGameObjectByXY(x, y);

      this.draw(x, y);
    });
  }

  getCursorPosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
  }

  renderAdditionalInfo() {
    const deltaMs = new Date().getTime() - this.prevGenerationTime;
    const isFirstGeneration = isNaN(deltaMs);
    const deltaString = !isFirstGeneration ? deltaMs : "-";
    const timeGenerationString = "Рендер: " + deltaString + " ms";
    const quantityAliveElements =
      "Количество живых клеток: " + this.gameObjects.size;

    document.getElementById("render-time").innerHTML = timeGenerationString;
    document.getElementById("render-quantity").innerHTML =
      quantityAliveElements;
  }
}

export default LiveBoard;
