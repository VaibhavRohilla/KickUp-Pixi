import { Body, Circle, Material } from "p2";
import { CircleEntity } from "././Entity";
import { Globals, isMobile, TimeTracker } from "./Globals";
import { Scene } from "./Scene";
import { Graphics, InteractionEvent } from "pixi.js";
import * as PIXI from "pixi.js";
import { config } from "./appConfig";
import { Easing, Tween } from "@tweenjs/tween.js";
import { DELTA_MS } from "./Utilities";

export class MouseCols {
  container!: PIXI.Container;
  mousePointer: CircleEntity;
  isVisible: boolean = false;
  timer!: NodeJS.Timeout;
  pressed : boolean = false;
  constructor() {
    this.container = new PIXI.Container();

    this.mousePointer = new CircleEntity(
      Globals.resources["Mousecircle"].texture,
      {
        position: [config.logicalWidth / 2, config.logicalHeight * 2],
        type: Body.KINEMATIC,
        mass: 15,
        // id: 2,

      },
      new Circle({
        radius: 110,
      }),
      2
    );
    if (!isMobile.any()) {
      this.setVisible(true);
    }
    this.mousePointer.position.set(500, 2500);
    this.container.addChild(this.mousePointer);

    this.mousePointer.body.collisionResponse = false;

    this.mousePointer.body.allowSleep = false;

    // this.mousePointer.body.sleep();
  }

  GetMaterial(): Material {
    return this.mousePointer.shape.material;
  }
  Setcol(): void {
    this.mousePointer.body.collisionResponse = false;
    setTimeout(() => {
      if(this.pressed)
      this.mousePointer.body.collisionResponse = true;
    }, 150);
  }

  setVisible(bool: boolean) {
    this.isVisible = bool;
    if (bool) {
      this.pressed = true;
      if(this.timer)clearTimeout(this.timer);

      new Tween(this.mousePointer)
        .to({ alpha: 1 }, 150)
        .easing(Easing.Quadratic.Out)
        .start();
        this.mousePointer.body.collisionResponse = true;
    }
    if (!bool) {
      this.pressed = false;

    // if(this.timer)clearTimeout(this.timer);
    console.log();
    
      this.timer = setTimeout(()=>{
    this.changePos({ x: this.mousePointer.position.x, y: this.mousePointer.position.y + 100 })
        this.mousePointer.body.collisionResponse = false;
    },150);
      
      new Tween(this.mousePointer).to({ alpha: 0 }, 150)
      .easing(Easing.Back.Out).start();
    }

  }

  update(dt: number): void {
    // throw new Error('Method not implemented.');

    // this.mousePointer.syncMovementLerp();

    //call every 3rd frame

    if (TimeTracker.update(DELTA_MS())) {
      this.mousePointer.fixedSyncMovement();
    }


  }
  changePos(point: { x: number; y: number }) {
    this.mousePointer.changePositionLerp(point.x, point.y);
  }
  // lerp (oldValue, newValue, weight)
  // {
  //     return oldValue + (oldValue * (1 - weight) + newValue * weight - oldValue) *  Globals.App?.app.ticker.deltaMS / 50;
  // }
}
