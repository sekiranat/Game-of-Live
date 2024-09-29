class LiveBoard {
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

    // constants
    this.canvasSize = 600;
    this.maxSideSizeWithTimeout = 700;
    this.aliveColor = "#00FF00";
    this.deadColor = "#303030";
    this.timeout = 400;
    this.aliveChance = 0.95;

    this.boardInterfaceElements = {
      time: null,
      quantity: null,
    };
  }

  create(canvasId, cellsQuantity) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.cellsQuantity = cellsQuantity;
    this.cellSize = this.canvas.width / this.cellsQuantity;
    this.boardInterfaceElements = {
      time: document.getElementById("render-time"),
      quantity: document.getElementById("render-quantity"),
    };

    this.setListeners();
  }

  start(cellsQuantity) {
    if (this.isPlaying) this.resetSettings();
    this.isPlaying = true;
    this.setSettings(cellsQuantity);

    if (!this.gameObjects.size) this.createFirstGeneration();
    this.gameLoop();
  }

  setSettings(cellsQuantity) {
    this.cellsQuantity = cellsQuantity;
    this.shouldTimeout = cellsQuantity < this.maxSideSizeWithTimeout;
    this.cellSize = this.canvas.width / this.cellsQuantity;
  }

  resetSettings() {
    clearTimeout(this.timeoutId);
    this.prevGenerationTime = NaN;
    this.gameObjects = new Map();
    this.nextGenerationAlive = new Map();
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
    this.gameObjects.set(this.getGameObjectKey(x, y), [x, y]);
  }

  getGameObjectKey(x, y) {
    return x + "_" + y;
  }

  createNextGeneration() {
    this.nextGenerationAlive.clear();
    for (let x = 0; x < this.cellsQuantity; x++) {
      for (let y = 0; y < this.cellsQuantity; y++) {
        // проверки соседей с учетом того что поле является поверхностью тора
        let north = y - 1;
        let south = y + 1;
        let west = x - 1;
        let east = x + 1;

        const yOtherSide = this.cellsQuantity - 1;
        const xOtherSide = this.cellsQuantity - 1;

        // координаты соседей при выходе за поле
        if (north < 0) north = yOtherSide;
        if (south > yOtherSide) south = 0;
        if (west < 0) west = xOtherSide;
        if (east > xOtherSide) east = 0;

        let numAliveNeighbors =
          this.isAlive(west, north) +
          this.isAlive(x, north) +
          this.isAlive(east, north) +
          this.isAlive(west, y) +
          this.isAlive(east, y) +
          this.isAlive(west, south) +
          this.isAlive(x, south) +
          this.isAlive(east, south);

        if (numAliveNeighbors === 2 || numAliveNeighbors === 3)
          this.nextGenerationAlive.set(this.getGameObjectKey(x, y), [x, y]);
      }
    }

    this.gameObjects = new Map(this.nextGenerationAlive);
  }

  isAlive(x, y) {
    return !!this.gameObjects.get(this.getGameObjectKey(x, y));
  }

  draw(x, y) {
    const isAlive = !!this.gameObjects.get(this.getGameObjectKey(x, y));
    this.context.fillStyle = isAlive ? this.aliveColor : this.deadColor;
    this.context.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
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
    } else window.requestAnimationFrame(() => this.gameLoop());
  }

  clearBoard() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const [xClick, yClick] = this.getCursorPosition(this.canvas, e);
      const x = Math.floor(xClick / this.cellSize);
      const y = Math.floor(yClick / this.cellSize);
      if (this.gameObjects.has(this.getGameObjectKey(x, y)))
        this.gameObjects.delete(this.getGameObjectKey(x, y));
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

    this.boardInterfaceElements.time.innerHTML = timeGenerationString;
    this.boardInterfaceElements.quantity.innerHTML = quantityAliveElements;
  }
}

export default LiveBoard;
