import { Globals } from "./Globals";
import { TextLabel } from "./TextLabel";

export class Fps {

    time: number;
    currentTime: number = 0;
    m_secondCounter: number = 0;
    m_tempFps: number = 0;
    fps: number = 0;
    fpsDisplay: TextLabel;
    saveCounter: number = 0;
    minsCount: number = 0;
    avgFps: number = 0;
    totalFps: number = 0;
    avgFpsDisplay: TextLabel;

    constructor(xPos1: number = 700, yPos1 = 40, yPos2 = 80, fontSize: number = 30, color: any = 0x000000, public avgFpsWillDisplay: boolean = true) {
        this.time = 0;
        //ypos1: y of fps , ypos2: y of avg fps.
        this.fpsDisplay = new TextLabel(xPos1, yPos1, 0.5, "Current FPS: " + this.fps.toString(), fontSize, color);
        this.avgFpsDisplay = new TextLabel(xPos1, yPos2, 0.5, "Average FPS: " + this.fps.toString(), fontSize, color);

        if (!this.avgFpsWillDisplay) {
            this.avgFpsDisplay.renderable = false;
        }

    }
    //to be added in update
    update(dt: number) {

        const delta = Globals.App?.app.ticker.deltaMS ? Globals.App?.app.ticker.deltaMS : 0;


        //fps
        if (this.m_secondCounter < 1) {
            this.m_secondCounter += delta / 1000;
            this.m_tempFps += 1;
        }
        else if (this.m_secondCounter >= 1) {
            //fps
            this.fps = this.m_tempFps - 1;
            if (this.avgFpsWillDisplay) {
                this.time += 1;
                this.totalFps += this.fps;
                this.avgFps = this.totalFps / this.time;
                //to add on main container
                this.avgFpsDisplay.upadteLabelText("Average FPS: " + Math.floor(this.avgFps).toString());
            }
            this.m_secondCounter = 0;
            this.m_tempFps = 0;

            //to add on main container
            this.fpsDisplay.upadteLabelText("Current FPS: " + this.fps.toString());
        }




    }
}