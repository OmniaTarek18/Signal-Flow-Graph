import Konva from "konva";

export default class Node {
  constructor(number, draggable) {
    this.id = ""; 
    this.name = `X${number}`;
    this.currentProductColor = null;

    this.group = new Konva.Group({
      draggable,
      name: this.name,
    });

    this.circle = new Konva.Circle({
      x: 50,
      y: 50,
      radius: 30,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 2,
     });

    this.text = new Konva.Text({
      text: this.name,
      x: -this.circle.radius() + 50,
      y: -this.circle.radius() + 50,
      fontSize: 14,
      fill: "#000",
      width: this.circle.radius() * 2,
      height: this.circle.radius() * 2,
      align: "center",
      verticalAlign: "middle",
    });

    this.group.add(this.circle, this.text);
  }
}