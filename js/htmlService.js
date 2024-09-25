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
  }

  getHtmlByKeyName(name) {
    return this[name];
  }

  getMapHtml(size) {
    const mapContainer = document.createElement("div");
    mapContainer.classList.add("map");

    for(var x = 0; x < size; x++){
        for (let y = 0; y < size; y++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("id", `${x}_${y}`);
            mapContainer.append(cell);
        }
    }

    mapContainer.style.width = `${this.widthCell * size}px`;
    mapContainer.style.height = `${this.widthCell * size}px`;

    return mapContainer;
  }
}

export default HtmlService;
