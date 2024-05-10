import { Body, Box, Circle, ContactMaterial, Material } from "p2";
import { Graphics } from "pixi.js";
import { config } from "./appConfig";
import { Globals } from "./Globals";
import { Scene } from "./Scene";



 class TestScene extends Scene
{
    ballBody: Body;
    ballGraphic: Graphics;

    recievedMessage(msgType: string, msgParams: any): void {
        // throw new Error("Method not implemented.");
    }
    constructor()
    {
        super(0x3c3c3c);







        const planeBody = new Body({
            position : [config.logicalWidth/2, config.logicalHeight - 100],
            damping : 0
        });
        const planeShape = new Box({
            width : config.logicalWidth,
            height : 20
        });

        planeBody.addShape(planeShape);
        planeShape.material = new Material();

        Globals.App?.world.addBody(planeBody);

        const graphic = new Graphics();
        graphic.beginFill(0xff0000, 1);
        graphic.drawRect(-planeShape.width/2, -planeShape.height/2, planeShape.width, planeShape.height);
        graphic.endFill();
        graphic.x = planeBody.position[0];
        graphic.y = planeBody.position[1];
        this.addChild(graphic);





        this.ballBody = new Body({
            position : [config.logicalWidth/2, config.logicalHeight - 1000],
            mass : 10,
            damping : 0.05

        });
        const ballShape = new Circle({
            radius : 50
        });

        this.ballBody.addShape(ballShape);
        ballShape.material = new Material();

        Globals.App?.world.addBody(this.ballBody);

        this.ballGraphic = new Graphics();
        this.ballGraphic.beginFill(0xff0000, 1);
        this.ballGraphic.drawCircle(0, 0, ballShape.radius);
        this.ballGraphic.endFill();
        this.ballGraphic.x = this.ballBody.position[0];
        this.ballGraphic.y = this.ballBody.position[1];
        this.addChild(this.ballGraphic);

        Globals.App?.world.addContactMaterial(new ContactMaterial(ballShape.material, planeShape.material,
        {
            restitution: 1,
            friction: 0,
            // surfaceVelocity : 500
        }));

        console.log(this.ballBody);
        console.log(ballShape);

        
    }

    update(dt: number): void {
        this.ballGraphic.x = this.ballBody.position[0];
        this.ballGraphic.y = this.ballBody.position[1];
        // throw new Error("Method not implemented.");
    }
}