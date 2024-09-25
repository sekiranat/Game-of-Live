class HtmlService {
  constructor() {
    this.userInterface = `
          <div class="liveGame__interface">
              <label class="liveGame__interface-label" for="field-size">
                  <div class="liveGame__interface-text">
                      Количество клеток
                  </div>
                  <input class="liveGame__interface-input" name="field-size" type="text">
              </label>
          </div>
    `;
  }

  getHtmlByKeyName(name) {
    return this[name]
  }
}

export default HtmlService;