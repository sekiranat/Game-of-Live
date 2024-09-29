class HtmlService {
  constructor() {
    this.widthCell = 10 + 2; // размер cell + border width в css
    this.canvas = `
    <canvas id="game-board" class="liveGame__board"/>
    `;
    this.renderTime = `
      <div class='liveGame__render-time' id="render-time"></div>
      <div class='liveGame__render-time' id="render-quantity"></div>
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
                <input data-type="board-size" class="liveGame__interface-input" value=${defaultBoardSize} name="field-size" type="text">
            </label>
            <div class="liveGame__interface-form-buttons">
            <button data-action="apply" class="liveGame__interface-button">Применить</button>
            <button data-action="start" class="liveGame__interface-button">Запустить</button>
            </div>
</div>
<div class="liveGame__interface-form-bottom">
                       <div class="liveGame__interface-form-bottom">
              Если количество клеток меньше 800, рендерится с таймаутом 400мс
           </div> 
              </div> 
        </div>
    </div>
    `;
  }
}

export default HtmlService;
