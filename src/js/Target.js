
import SquareHitObject from "./SquareHitObject.js";
import * as Constants from "./Constants.js";

export default class Target{
    
    constructor(xPos, yPos, width, height, canvas){
        this.squareHitBox = new SquareHitObject (xPos, yPos, width, height);
        
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;

        this.color = Constants.TARGET_COLOR1;
        this.health = Constants.TARGET_HEALTH;
        this.iFrames = 0;
    }

    draw(){
        this.countDownIFrames();
        this.switchColor();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.squareHitBox.xPos, this.squareHitBox.yPos, this.squareHitBox.width,this.squareHitBox.height );
        let border = Constants.TARGET_BORDER_WIDTH;
        this.ctx.fillStyle = Constants.BACKGROUND_COLOR;
        this.ctx.fillRect (this.squareHitBox.xPos + border, this.squareHitBox.yPos + border, this.squareHitBox.width - 2 * border, this.squareHitBox.height - 2 * border);
    }


    onHit(strength){

        if(strength >= Constants.TARGET_HEALTH){
            this.health = 0;
            this.switchColor();
        }

        if(this.iFrames <= 0){
            if(this.health > 0){
                this.health = this.health - strength;
                if(this.health < 0){
                    this.health = 0;
                }
                this.switchColor();
                if(this.health > 0){
                    this.iFrames = Constants.TARGET_I_FRAMES;
                }
            }
        }
        
    }
    

    countDownIFrames(){
        if(this.iFrames > 0){
            this.iFrames--;
        }
    }

    isAlive(){
        if(this.health < 1){
            return false;
        }
        else{
            return true;
        }
    }

    switchColor(){
        if(this.iFrames > 0){
            this.color = Constants.TARGET_COLOR_INVINCIBLE;
        }
        else{
            switch(this.health){
                case 4:
                    this.color = Constants.TARGET_COLOR1; 
                    break;
                case 3:
                    this.color = Constants.TARGET_COLOR2; 
                    break; 
                case 2:
                    this.color = Constants.TARGET_COLOR3; 
                    break; 
                case 1:
                    this.color = Constants.TARGET_COLOR4; 
                    break; 
                case 0:
                    this.color = Constants.TARGET_COLOR5; 
                    break; 
            }
        }
    }

}