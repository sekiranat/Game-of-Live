import HtmlService from './htmlService.js'

class Live {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
  }

  init() {
    this.buildInterface();
  }

  buildInterface() {
    const interfaceHtml = this.htmlService.getHtmlByKeyName("userInterface");
    this.insertChild(this.gameRoot, interfaceHtml);
  }

  // Вставляет html string в element после последнего потомка
  insertChild(element, html) {
    element.insertAdjacentHTML("beforeend", html);
  }
}

const liveGame = new Live();
liveGame.init();
