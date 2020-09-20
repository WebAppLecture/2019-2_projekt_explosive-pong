import Point from "./Point.js";
import SquareHitObject from "./SquareHitObject.js";
import * as Constants from "./Constants.js";

export default class Paddle {
    constructor(xPos, yPos, canvas, keyGoUp, keyGoDown){
        this.startVector = new Victor(0, 0);
        this.squareHitBox = new SquareHitObject (xPos, yPos, Constants.PLAYER_WIDTH, Constants.PLAYER_HEIGHT, Constants.BALL_HEIGHT,canvas.height - Constants.BALL_HEIGHT, xPos, xPos + Constants.PLAYER_WIDTH, 0, this.startVector);

        
        this.keyGoUp = keyGoUp;
        this.keyGoDown = keyGoDown;
        this.isMoving = false;

        this.ctx = canvas.getContext('2d');
        this.speed = 0;
        window.addEventListener("keydown", this.myKeyDown.bind(this));
        window.addEventListener("keyup", this.myKeyUp.bind(this));
    }

    draw(){
        this.checkforBorders();
        this.updateSpeed();
        this.squareHitBox.calcNewPosition();
        this.ctx.fillStyle = Constants.PLAYER_COLOR;
        this.ctx.fillRect(this.squareHitBox.xPos, this.squareHitBox.yPos, this.squareHitBox.width, this.squareHitBox.height);
    }


    checkforBorders(){
        if(this.squareHitBox.checkforBorders() == "y" || this.squareHitBox.checkforBorders() == "xy"){
            if(this.squareHitBox.yPos <= this.squareHitBox.topBorder){
                this.squareHitBox.yPos = this.squareHitBox.topBorder + 1;
            }
            if(this.squareHitBox.yPos + this.squareHitBox.height >= this.squareHitBox.bottomBorder){
                this.squareHitBox.yPos = this.squareHitBox.bottomBorder - this.squareHitBox.height - 1;
            }
            
            this.squareHitBox.vector = new Victor(0,0);
        }
    }

    

    myKeyDown(event){
        if(event.repeat == false){
            let keyUsed = event.which;
            switch(keyUsed){
                case this.keyGoUp: 
                    this.squareHitBox.vector = new Victor(0, -1); 
                    this.isMoving = true; 
                    this.speed = Constants.PLAYER_MIN_SPEED; 
                    break;
                case this.keyGoDown: 
                    this.squareHitBox.vector = new Victor(0, 1); 
                    this.isMoving = true; 
                    this.speed = Constants.PLAYER_MIN_SPEED; 
                    break;
            }
        }
    }



    myKeyUp(event){
        if(event.repeat == false){
            let keyUsed = event.which;
            switch(keyUsed){
                case this.keyGoUp:
                    this.isMoving = false; 
                    break;
                case this.keyGoDown:
                    this.isMoving = false; 
                    break;
                default:break;
            }
        }
    }

    getVector(){
        return this.squareHitBox.vector;
    }

    getRefPoint(){
        return this.squareHitBox.refPoint;
    }


    updateSpeed(){
        if(this.isMoving){
            this.accelerate();
        }
        else{
            this.decelerate();
        }
        this.squareHitBox.speed = this.speed;
    }

    decelerate(){
        if(this.speed > 0){
            this.speed -= Constants.PLAYER_DECELERATION;
        }
        if(this.speed < 0){
            this.speed = 0;
        }
    }

    accelerate(){
        if(this.speed < Constants.PLAYER_SPEED){
            this.speed += Constants.PLAYER_ACCELERATION;
        }
        if(this.speed > Constants.PLAYER_SPEED){
            this.speed = Constants.PLAYER_SPEED;
        }
    }
}