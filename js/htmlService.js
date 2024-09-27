class HtmlService {
  constructor() {
    this.widthCell = 10 + 2; // размер cell + border width в css
    this.userInterface = `
    <div class="liveGame__interface">
        <h1 class="liveGame__interface-title">
            Игра жизнь
        </h1>
        <div class="liveGame__interface-form">
            <label class="liveGame__interface-label" for="field-size">
                <div class="liveGame__interface-text">
                    Количество клеток
                </div>
                <input data-type="field-size" class="liveGame__interface-input" name="field-size" type="text">
            </label>
            <button data-action="start" class="liveGame__interface-button">Применить</button>
        </div>
    </div>
    `;

    this.canvas = `
    <canvas id="game-board" class="liveGame__board"/>
    `;
    this.renderTime = `
    <div class='liveGame__render-time' id="render-time"></div>
    `;
  }

  getHtmlByKeyName(name) {
    return this[name];
  }
}

export default HtmlService;
