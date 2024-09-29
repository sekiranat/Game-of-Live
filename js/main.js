import HtmlService from "./htmlService.js";
import LiveBoard from "./liveBoard.js";

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
    const renderTimeHtml = this.htmlService.getHtmlByKeyName("renderTime");
    this.insertChild(this.gameRoot, interfaceHtml);
    this.insertChild(this.gameRoot, renderTimeHtml);

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

window.onload = () => {
  new GameLive();
};
