class GameLive {
  constructor() {
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
    this.liveBoard = new LiveBoard();
    this.defaultCellsQuantity = 20
    this.gameBoardId = 'game-board'

    this.interfaceElements = {
      startButton: null,
      boardSizeInput: null
    }

    this.init();
  }

  init() {
    this.buildInterface();
    this.buildBoard();
    this.setListeners();
    this.liveBoard.create(this.gameBoardId, this.defaultCellsQuantity);
  }

  setListeners() {
    this.interfaceElements.startButton.addEventListener("click", () => this.startGame());
  }

  startGame() {
    const boardSideSize = this.interfaceElements.boardSizeInput.value
    this.liveBoard.start(boardSideSize);
  }

  buildInterface() {
    const interfaceHtml = this.htmlService.getGameInterface(this.defaultCellsQuantity);
    const renderAdditionalInfoHtml = this.htmlService.getHtmlByKeyName("renderAdditionalInfo");
    this.insertChild(this.gameRoot, interfaceHtml);
    this.insertChild(this.gameRoot, renderAdditionalInfoHtml);

    this.interfaceElements = {
      startButton: document.querySelector('[data-action="start"]'),
      boardSizeInput: document.querySelector('[data-type="board-size"]')
    }
  }

  buildBoard() {
    const canvas = this.htmlService.getHtmlByKeyName("canvas");
    this.insertChild(this.gameRoot, canvas);
  }

  insertChild(element, html) {
    element.insertAdjacentHTML("beforeend", html);
  }
}

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

class HtmlService {
  constructor() {
    this.widthCell = 10 + 2; // размер cell + border width в css
    this.canvas = `
    <canvas id="game-board" class="liveGame__board"/>
    `;
    this.renderAdditionalInfo = `
      <div class='liveGame__render-time' id="render-time"></div>
      <div class='liveGame__render-quantity' id="render-quantity"></div>
    `;
  }

  getHtmlByKeyName(name) {
    return this[name];
  }

  getGameInterface(defaultBoardSize) {
    return `
      <div class="liveGame__interface">
          <h1 class="liveGame__interface-title">
              Игра жизнь
          </h1>
          <div class="liveGame__interface-form">
              <div class="liveGame__interface-form-top">
                  <label class="liveGame__interface-label" for="field-size">
                      <div class="liveGame__interface-text">
                          Количество клеток
                      </div>
                      <input data-type="board-size" class="liveGame__interface-input" value=${defaultBoardSize}
                          name="field-size" type="text">
                  </label>
                  <div class="liveGame__interface-form-buttons">
                      <button data-action="start" class="liveGame__interface-button">Запустить</button>
                  </div>
              </div>
              <div class="liveGame__interface-form-bottom">
                  <div class="liveGame__interface-form-bottom">
                      Если количество клеток меньше 700, рендерится с таймаутом 400мс для наглядности
                  </div>
              </div>
          </div>
      </div>
    `;
  }
}

window.onload = () => {
  new GameLive();
};
