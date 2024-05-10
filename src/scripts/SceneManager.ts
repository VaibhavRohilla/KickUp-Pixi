import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import { Globals } from "./Globals";
import { Scene } from "./Scene";
import { Container } from "pixi.js";
import { DELTA_MS } from "./Utilities";

export class SceneManager {


    static instance: SceneManager;

    container!: PIXI.Container;
    scene: Scene | null = null;

    constructor() {


        if (SceneManager.instance != undefined) {
            console.log("SceneManager already created!");
            return;
        }

        SceneManager.instance = this;


        this.container = new PIXI.Container();
        this.scene = null;
    }

    static getCurrentContainer(): Container | null {
        if (SceneManager.instance.scene) {
            return SceneManager.instance.scene.mainContainer;
        } else
            return null;
    }


    start(scene: Scene) {

        if (this.scene) {
            this.scene.destroyScene();
            this.scene = null;
        }



        this.scene = scene;
        this.scene.initScene(this.container)
        // this.container.addChild(this.scene.sceneContainer);


        if (window.orientation == 90 || window.orientation == -90) {

            //orientation
        }
    }

    // lastTime = -1;

    update(dt: number) {


        TWEEN.update();

        // Globals.App?.world.step(1/60);

        // console.log("--------------------");
        // console.log("delta ms: " + DELTA_MS());
        // console.log(1 / (20 * (20 / DELTA_MS())));
        // console.log("--------------------");

        // let interpolation = 0;

        // if(this.lastTime == -1)
        //     this.lastTime = Date.now();
        // else
        // {
        //     interpolation = Date.now() - this.lastTime;
        //     console.log("delta: " + interpolation);
        //     this.lastTime = Date.now();
        // }

        const delta = 1 / (20 * (20 / DELTA_MS()));



        Globals.App?.world.step(delta);

        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }

        Globals.stats.update();

        if (Globals.fpsStats)
            Globals.fpsStats.update();

        Globals.stats.begin();

        // monitored code goes here

        Globals.stats.end();
    }

    resize() {
        if (this.scene) {
            this.scene.resize();
        }
    }

    recievedMessage(msgType: string, msgParams: any) {
        if (this.scene && this.scene.recievedMessage) {
            this.scene.recievedMessage(msgType, msgParams);
        }
    }
}