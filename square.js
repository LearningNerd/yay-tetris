export function Square(row, col, color) {

  console.log("Called Square constructor");

  this.row = row;
  this.col = col;
  this.color = color;

  console.log(this.row + ", " + this.col + " - " + this.color);

}

