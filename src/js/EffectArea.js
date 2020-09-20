import Point from "./Point.js";
import SphereHitObject from "./SphereHitObject.js";
import * as Constants from "./Constants.js";

export default class EffectArea {

    constructor(xPos, yPos, radius, canvas, type){
        this.sphereHitBox = new SphereHitObject(xPos,yPos,radius);
        this.radius = radius;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.color = Constants.EFFECT_COLORS[type];
    }

    draw(){
        this.ctx.lineWidth = Constants.EFFECT_AREA_BORDER_WIDTH;
        this.ctx.strokeStyle = this.color;
        if(this.type != 3){
            this.ctx.beginPath();
            this.ctx.arc(this.sphereHitBox.xPos, this.sphereHitBox.yPos, this.radius - Constants.EFFECT_AREA_ERROR_MARGIN, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        else{
            let brushAngularPosition = 5 / 32;
            for(let i = 0; i < 4; i++){
                this.ctx.beginPath();
                this.ctx.arc(this.sphereHitBox.xPos, this.sphereHitBox.yPos, this.radius - Constants.EFFECT_AREA_ERROR_MARGIN, brushAngularPosition * 2 * Math.PI, (brushAngularPosition + (6 / 32)) * 2 * Math.PI);
                this.ctx.stroke();
                brushAngularPosition += (1 / 4);
            }
        }
        
    }

}