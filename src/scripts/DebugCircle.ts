import * as PIXI from "pixi.js";
import { Container, DisplayObject } from "pixi.js";

export class DebugCircle extends PIXI.Graphics
{
    constructor(component : DisplayObject, radius = 5, container : Container | null = null)
    {
        super();

        let point = new PIXI.Point();
        
        component.getGlobalPosition(point, false);


        this.lineStyle(0); 
        this.beginFill(0xDE3249, 1);
        this.drawCircle(point.x, point.y, radius);
        this.endFill();

        container?.addChild(this);
    }
}


export class DebugCircleAtPosition extends PIXI.Graphics
{
    constructor(point : {x : number, y : number}, radius = 5, container : Container | null = null, color : number =  0xDE3249)
    {
        super();

        console.log(`Debug Spawned at : ${point.x}, ${point.y}`)
        // let point = new PIXI.Point();
        
        // component.getGlobalPosition(point, false);


        this.lineStyle(0); 
        this.beginFill(color, 1);
        this.drawCircle(point.x, point.y, radius);
        this.endFill();

        container?.addChild(this);
    }
}