import { Container, DisplayObject } from "pixi.js";
import { config } from "./appConfig";
import { BackgroundGraphic } from "./Background";

export abstract class Scene {


    private sceneContainer: Container;
    // private fullBackground: BackgroundGraphic;

    mainContainer: Container;
    // private mainBackground: BackgroundGraphic;

    constructor(mainBackgroundColor: number) {
        this.sceneContainer = new Container();
        // this.fullBackground = new BackgroundGraphic(window.innerWidth, window.innerHeight, 0xFFFFFF);
        // this.sceneContainer.addChild(this.fullBackground);

        this.mainContainer = new Container();

        this.resetMainContainer();

        this.sceneContainer.addChild(this.mainContainer);

        // this.mainBackground = new BackgroundGraphic(config.logicalWidth, config.logicalHeight, mainBackgroundColor);
        // this.mainContainer.addChild(this.mainBackground);

    }

    addChild(obj: DisplayObject) {
        this.mainContainer.addChild(obj);
    }
    addToScene(obj: DisplayObject, index: number) {
        this.sceneContainer.addChildAt(obj, index);

    }

    resetMainContainer() {
        this.mainContainer.x = config.minLeftX;
        this.mainContainer.y = config.minTopY;
        this.mainContainer.scale.set(config.minScaleFactor);
    }

    resize(): void {
        this.resetMainContainer();
        // this.fullBackground.resetGraphic(window.innerWidth, window.innerHeight);
    }

    initScene(container: Container) {
        container.addChild(this.sceneContainer);
    }
    destroyScene() {
        this.sceneContainer.destroy();
    }

    abstract update(dt: number): void;

    abstract recievedMessage(msgType: string, msgParams: any): void;
}