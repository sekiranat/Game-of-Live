import HtmlService from "./htmlService.js";

class Live {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
    this.mapSize = 100;
    this.stateCell = [];
  }

  init() {
    this.buildInterface();
    this.setListeners();
  }

  setListeners() {
    const startButton = document.querySelector('[data-action="start"]');
    startButton.addEventListener("click", (e) => {
      const target = e.target;
      if (target === startButton) {
        const fieldSize = document.querySelector(
          '[data-type="field-size"]'
        ).value;
        this.setMapSize(fieldSize);
        this.generateMap(fieldSize);
      }
    });
  }

  setMapSize(size) {
    this.mapSize = size;
  }

  generateMap(size) {
    this.generateAliveCells(size);

    const htmlMap = this.htmlService.getMapHtml(size);
    const mapElement = document.getElementById("map");

    if (mapElement) this.gameRoot.removeChild(mapElement);
    this.gameRoot.appendChild(htmlMap);
    this.gameLoop();
  }

  generateAliveCells(size) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (Math.random() > 0.8) {
          const arrayKey = `${x}_${y}`;;
          this.stateCell.push([arrayKey])
        }
      }
    }
  }

  renderAliveCells() {
    this.stateCell.forEach((aliveCell) => {
        console.log(aliveCell)
        const cell = document.getElementById(aliveCell)
        cell.classList.add("alive");
    })
  }

  gameLoop() {
    this.checkSurrounding();
    this.renderAliveCells()

    setTimeout(() => {
      this.gameLoop();
    }, 1000);
  }

  checkSurrounding() {
    const neighboringAliveСells = this.countNeighboringAlive()
  }

  countNeighboringAlive() {
    let count = 0;
    // if (row-1 >= 0) {
    //     if (grid[row-1][col] == 1) count++;
    // }
    // if (row-1 >= 0 && col-1 >= 0) {
    //     if (grid[row-1][col-1] == 1) count++;
    // }
    // if (row-1 >= 0 && col+1 < cols) {
    //     if (grid[row-1][col+1] == 1) count++;
    // }
    // if (col-1 >= 0) {
    //     if (grid[row][col-1] == 1) count++;
    // }
    // if (col+1 < cols) {
    //     if (grid[row][col+1] == 1) count++;
    // }
    // if (row+1 < rows) {
    //     if (grid[row+1][col] == 1) count++;
    // }
    // if (row+1 < rows && col-1 >= 0) {
    //     if (grid[row+1][col-1] == 1) count++;
    // }
    // if (row+1 < rows && col+1 < cols) {
    //     if (grid[row+1][col+1] == 1) count++;
    // }
    // return count;
  }

  buildInterface() {
    const interfaceHtml = this.htmlService.getHtmlByKeyName("userInterface");
    this.insertChild(this.gameRoot, interfaceHtml);
  }

  // Вставляет html string в element после последнего потомка
  insertChild(element, html) {
    element.insertAdjacentHTML("beforeend", html);
  }

  startGame() {}
}

const liveGame = new Live();
liveGame.init();
