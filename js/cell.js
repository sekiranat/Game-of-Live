export class Cell {  
    constructor(context, cellSize, gridX, gridY) {
      this.context = context;
  
      // Store the position of this cell in the grid
      this.gridX = gridX;
      this.gridY = gridY;
      this.cellSize = cellSize;
  
      // Make random cells alive
      this.alive = Math.random() > 0.9;
    }
  
    draw() {
      // Draw a simple square
      this.context.fillStyle = this.alive ? "#ff8080" : "#303030";
      this.context.fillRect(
        this.gridX * this.cellSize,
        this.gridY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }
  }

  export default Cell;