import { Easing, Tween } from "@tweenjs/tween.js";
import { Body, BodyOptions, Circle, Material, Shape, Box } from "p2";
import { Resource, Sprite, Texture } from "pixi.js";
import { Globals } from "./Globals";
import { lerp } from "./Utilities";

export class CircleEntity extends Sprite {
  body: any;
  shape: Circle;
  newPosition: { x: number; y: number };

  lerpWeight: number = 0.1;
  aspectRatio: { x: number, y: number } = { x: 1, y: 1 };
  constructor(
    texture: Texture<Resource> | undefined,
    bodyOptions: BodyOptions,
    shape: Circle,
    entityID: number,
    parentRef: any = undefined
  ) {
    super(texture);


    if (this.height == Math.max(this.height, this.width)) {
      this.aspectRatio.y = Math.max(this.height, this.width) / Math.min(this.height, this.width);
    } else
      this.aspectRatio.x = Math.max(this.height, this.width) / Math.min(this.height, this.width);


    this.anchor.set(0.5);
    this.newPosition = bodyOptions.position
      ? { x: bodyOptions.position[0], y: bodyOptions.position[1] }
      : { x: 0, y: 0 };
    this.body = new Body(bodyOptions);

    if (parentRef) {
      this.body.parentRef = parentRef;
    }

    this.body.checkID = entityID;

    // console.log("CREATED BODY");
    // console.log(this.body);
    this.shape = shape;
    this.shape.material = new Material();


    this.width = (this.shape.radius * 2) * this.aspectRatio.x;
    this.height = (this.shape.radius * 2) * this.aspectRatio.y;

    Globals.App?.world.addBody(this.body);
    this.body.addShape(this.shape);
  }
  changePositionLerp(x: number | undefined, y: number | undefined) {
    if (x !== undefined) {
      this.newPosition.x = x;
    }

    if (y !== undefined) {
      this.newPosition.y = y;
    }

    // this.syncMovementLerp();
  }
  changePosition(x: number | undefined, y: number | undefined) {
    if (x !== undefined && y !== undefined) {
      this.body.position[0] = x;
      this.body.position[1] = y;
      this.syncMovement();
    }

  }

  syncMovement() {
    this.x = this.body.position[0];
    this.y = this.body.position[1];

    this.width = (this.shape.radius * 2) * this.aspectRatio.x;
    this.height = (this.shape.radius * 2) * this.aspectRatio.y;

  }

  syncMovementLerp() {
    this.body.position[0] = lerp(
      this.body.position[0],
      this.newPosition.x,
      this.lerpWeight
    );
    this.body.position[1] = lerp(
      this.body.position[1],
      this.newPosition.y,
      this.lerpWeight
    );

    this.x = this.body.position[0];
    this.y = this.body.position[1];

    this.width = this.shape.radius * 2;
    this.height = this.shape.radius * 2;
  }


  fixedSyncMovement() {

    if (this.body.position[0] != this.newPosition.x || this.body.position[1] != this.newPosition.y) {
      console.log("Calleddddd");
      
      const tween = new Tween(this.body.position).to({
        [0]: this.newPosition.x,
        [1]: this.newPosition.y,
      },100 ).easing(Easing.Linear.None).onUpdate(() => {
        this.x = this.body.position[0];
        this.y = this.body.position[1];

        this.width = this.shape.radius * 2;
        this.height = this.shape.radius * 2;
      }).start();
    }

  }

  destroyEntity() {
    Globals.App?.world.removeBody(this.body);
    this.destroy();
  }
}
export class BoxEntity extends Sprite {
  body!: any;
  shape!: Box;
  Material: any;
  constructor(
    texture: Texture<Resource> | undefined,
    bodyOptions: BodyOptions,
    shape: Box,

    entityID: number
  ) {
    super(texture);

    this.body = new Body(bodyOptions);
    this.body.checkID = entityID;
    this.shape = shape;
    this.shape.material = new Material();
    this.width = this.shape.width;
    this.height = this.shape.height;

    Globals.App?.world.addBody(this.body);
    this.body.addShape(this.shape);
  }

  changePosition(x: number | undefined, y: number | undefined) {
    if (x !== undefined) {
      this.body.position[0] = x;
    }

    if (y !== undefined) {
      this.body.position[1] = y;
    }

    this.syncMovementnormal();
  }

  syncMovementnormal() {
    this.x = this.body.position[0];
    this.y = this.body.position[1];

    this.width = this.shape.width;
    this.height = this.shape.height;
  }

  destroyEntity() {
    Globals.App?.world.removeBody(this.body);
    this.destroy();
  }
}
