import HtmlService from "./htmlService.js";
import GameWorld from "./gameWorld.js";

class GameLive {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
    this.liveBoard = new GameWorld();
    this.mapSize = 100;
    this.stateCell = [];
    this.gameBoardId = 'game-board'
    this.init();
  }

  init() {
    this.buildInterface();
    this.buildBoard();
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
        this.liveBoard.init(this.gameBoardId, fieldSize);
      }
    });
  }

  setMapSize(fieldSize) {
    this.mapSize = parseInt(fieldSize);
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
    const renderTimeHtml = this.htmlService.getHtmlByKeyName("renderTime");
    this.insertChild(this.gameRoot, interfaceHtml);
    this.insertChild(this.gameRoot, renderTimeHtml);
  }

  buildBoard() {
    const canvas = this.htmlService.getHtmlByKeyName("canvas");
    this.insertChild(this.gameRoot, canvas);
  }

  // Вставляет html string в element после последнего потомка
  insertChild(element, html) {
    element.insertAdjacentHTML("beforeend", html);
  }

  startGame() {}
}

window.onload = () => {
  new GameLive();
};
