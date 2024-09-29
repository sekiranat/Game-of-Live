import HtmlService from "./htmlService.js";
import GameWorld from "./gameWorld.js";

class GameLive {
  constructor() {
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
    this.liveBoard = new GameWorld();
    this.defaultCellsQuantity = 20
    this.gameBoardId = 'game-board'

    this.interfaceElements = {
      applyButton: null,
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
    this.interfaceElements.startButton.addEventListener("click", () => this.liveBoard.start());
    this.interfaceElements.applyButton.addEventListener("click", () => this.applySettings());
  }

  applySettings() {
    const boardSideSize = this.interfaceElements.boardSizeInput.value
    this.liveBoard.applySettings(boardSideSize);
  }

  buildInterface() {
    const interfaceHtml = this.htmlService.getGameInterface(this.defaultCellsQuantity);
    const renderTimeHtml = this.htmlService.getHtmlByKeyName("renderTime");
    this.insertChild(this.gameRoot, interfaceHtml);
    this.insertChild(this.gameRoot, renderTimeHtml);

    this.interfaceElements = {
      applyButton: document.querySelector('[data-action="apply"]'),
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
