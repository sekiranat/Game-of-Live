import HtmlService from "./htmlService.js";

class Live {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
    this.gameRoot = document.getElementById("game-root");
    this.htmlService = new HtmlService();
    this.mapSize = [100, 100];
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
            const fieldSize = document.querySelector('[data-type="field-size"]').value
            this.setMapSize(fieldSize)
            this.generateMap(fieldSize);
        }
    });
  }

  setMapSize(size) {
    this.mapSize = [size, size];
  }

  generateMap(size) {
    const htmlMap = this.htmlService.getMapHtml(size);
    const mapElement = document.getElementById('map')

    if (mapElement) this.gameRoot.removeChild(mapElement)
    console.log(htmlMap)
    this.gameRoot.appendChild(htmlMap)
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
