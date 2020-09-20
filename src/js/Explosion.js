import SphereHitObject from "./SphereHitObject.js";
import * as Constants from "./Constants.js";

export default class Explosion {

    constructor(xPos, yPos, strength, canvas){
        let radius = Constants.EXPLOSION_BASE_RADIUS + Constants.EXPLOSION_STACKABLE_RADIUS * strength + Constants.EXPLOSION_ERROR_MARGIN;
        this.sphereHitBox = new SphereHitObject(xPos, yPos, radius);
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.color1 = Constants.EXPLOSION_COLOR1;
        this.color2 = Constants.EXPLOSION_COLOR2;
        this.radiusReduction = (radius - Constants.EXPLOSION_ERROR_MARGIN) / Constants.EXPLOSION_BREAK;
    }

    draw(){
        if(this.sphereHitBox.radius > 0){
            this.sphereHitBox.radius -= this.radiusReduction;
        }
        let gradient = this.ctx.createRadialGradient(this.sphereHitBox.xPos, this.sphereHitBox.yPos, 0, this.sphereHitBox.xPos, this.sphereHitBox.yPos, this.sphereHitBox.radius);
        gradient.addColorStop(0,this.color1);
        gradient.addColorStop(1,this.color2);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.sphereHitBox.xPos, this.sphereHitBox.yPos, (this.sphereHitBox.radius - Constants.EXPLOSION_ERROR_MARGIN), 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
}