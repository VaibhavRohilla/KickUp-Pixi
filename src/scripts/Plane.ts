import { Body, Box, Material } from "p2";
import { Graphics, Sprite } from "pixi.js";
import { Globals } from "./Globals";
import { BoxEntity } from "./Entity";

export class Plane extends Graphics {
  planeShape: Box;
  planeBody: any;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    entityId: number
  ) {
    super();

    this.planeShape = new Box({ width: width, height: height});
    
    const material = new Material();
    this.planeShape.material = material;

    this.planeBody = new Body({ position: [x, y], mass: 10,type: Body.KINEMATIC});
    this.planeBody.checkID = entityId;
    this.planeBody.addShape(this.planeShape);
    Globals.App?.world.addBody(this.planeBody);
    this.pivot.set(0.5);

    this.beginFill(0x00000);
    this.alpha = 0;
    this.drawRect(
      -this.planeShape.width * 2,
      -this.planeShape.height / 2,
      this.planeShape.width * 4,
      this.planeShape.height * 10
    );
    this.x = this.planeBody.position[0];
    this.y = this.planeBody.position[1];
  }
}
