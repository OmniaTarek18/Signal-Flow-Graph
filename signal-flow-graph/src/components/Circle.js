import Konva from "konva";

export default class Circle {
  constructor(id) {
    this.id = id;
    this.group = new Konva.Group({
      draggable: true,
    });
    this.circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 25,
      fill: "lightblue",
      stroke: "#93b9dc",
      strokeWidth: 2,
    });
    this.text = new Konva.Text({
      x: 100 - 25,
      y: 100 - 25,
      text: `${id}`,
      fontSize: 18,
      fill: "#000",
      align: "center",
      verticalAlign: "middle",
      width: 25 * 2,
      height: 25 * 2,
    });
    this.group.add(this.circle, this.text);
  }
}
