import { Text } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js"
import * as PIXI from "pixi.js"

export class TextLabel extends  Text
{


    constructor(x : number, y : number, anchor :number, textToShow :any ,size : number, public defaultColor :number =  0xff7f50, font : string = "Verdana") {
        super(textToShow);

        this.x = x;
        this.y = y;
        this.anchor.set(anchor);
        this.style = {
            fontFamily: 'FredokaOne',
            fontSize: size,
            fill: [this.defaultColor],
            fontWeight: "bold",
         
        };
    const style = new PIXI.TextStyle({
   
});
    
        
        this.text = textToShow;
    }

    upadteLabelText(text : any, color : number = this.defaultColor)
    {
        this.text = text;
        this.style.fill = [color];
        
    }
 
 

}