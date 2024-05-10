import { Globals } from "./Globals";
import * as PIXI from 'pixi.js';
import { DisplayObject } from "pixi.js";


export const getMousePosition = () => Globals.App!.app.renderer.plugins.interaction.mouse.global;

export const utf8_to_b64 = (str : string) => window.btoa(encodeURIComponent(str));

export const clamp = (num : number, min : number, max : number) => Math.min(Math.max(num, min), max);

export const fetchGlobalPosition = (component : DisplayObject) => {
    let point = new PIXI.Point();
    
    component.getGlobalPosition(point, false);
    return point;
};


export const DELTA_MS = function() : number
{
    return Globals.App?.app.ticker.deltaMS != undefined ? Globals.App?.app.ticker.deltaMS : 0;
}

export const lerp = (oldValue : number, newValue : number, weight : number) : number=> 
 {
    return oldValue + (oldValue * (1 - weight) + newValue * weight - oldValue) * DELTA_MS()/ 50;
  }

  export const checkIfMouseOver = (component :  DisplayObject) => {
    const rect1 = component.getBounds();
    console.log(rect1);
    const point = getMousePosition();
    if (rect1.x <= point.x &&
        rect1.x + rect1.width >= point.x &&
        rect1.y <= point.y &&
        rect1.y + rect1.height >= point.y) {
        // Over!
        return true;
    } else {
        // not over
        return false;
    }
};
    



// globalThis.logThis = (message, color = null) => {

//     const Style = {
//         base: [
//           "color: #fff",
//           "background-color: #444",
//           "padding: 2px 4px",
//           "border-radius: 2px"
//         ],
//         red: [
//           "color: #eee",
//           "background-color: red"
//         ],
//         green: [
//           "background-color: green"
//         ],
//         blue: [
//             "background-color: #0091F7"
//           ]
//       }



//     let extra = [];

//     if(color != null)
//     {
//         extra = Style[color];
//     }
    
//     let style = Style.base.join(';') + ';';
    
//     style += extra.join(';'); // Add any additional styles
    
//     console.log(`%c${message}`, style);
// };








