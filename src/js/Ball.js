import Point from "./Point.js";
import * as Constants from "./Constants.js";
import SquareHitObject from "./SquareHitObject.js";
import SphereHitObject from "./SphereHitObject.js";
import Paddle from "./Paddle.js";
import Target from "./Target.js";
import EffectArea from "./EffectArea.js";
import Main from "./Main.js";
import getRandom from "./Randomizer.js";

 export default class Ball {
    constructor(xPos, yPos, movVector, canvas, main){
        
        
        this.speed = Constants.BALL_DEFAULT_SPEED;
        
        this.squareHitBox = new SquareHitObject(xPos, yPos, Constants.BALL_WIDTH, Constants.BALL_HEIGHT, 0, canvas.height, 0, canvas.width, this.speed, movVector)
        this.sphereHitBox = new SphereHitObject(xPos + Constants.BALL_WIDTH / 2, yPos + Constants.BALL_HEIGHT / 2, Constants.BALL_RADIUS, 0, canvas.height, 0, canvas.width, this.speed, movVector);
        this.color = Constants.BALL_COLOR;
        this.strength = Constants.BALL_DEFAULT_STRENGTH;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.previousPosition = new Point(this.squareHitBox.xPos, this.squareHitBox.yPos);
        this.currentEffectDurations=[-1, -1, -1, -1, -1];
        this.mainObject = main;
        this.explosionStrength = 1;
        this.stuckInBorder = false;
    }


    

    draw() {
        this.previousPosition.x = this.squareHitBox.xPos;
        this.previousPosition.y = this.squareHitBox.yPos;
        this.updateSpeed();
        this.checkforBorders();
        this.countDownEffects();
        this.sphereHitBox.calcNewPosition();
        this.syncHitboxes();
        this.squareHitBox.calcNewPosition();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.squareHitBox.xPos, this.squareHitBox.yPos, this.squareHitBox.width, this.squareHitBox.height);
    }


    handleCollision (object){
        if(object instanceof Paddle){
            this.bounceFrom(object);
        }
        if(object instanceof Target){
            this.hitTarget(object);
        }
        if(object instanceof EffectArea){
            this.obtainEffect(object);
        }
    }

    bounceFrom(object){
            let paddleVector = object.getVector();
            if(paddleVector instanceof Victor){
                let paddlePoint = object.getRefPoint();
                if(paddlePoint instanceof Point){
                    let ballPoint = this.squareHitBox.refPoint;
                    let connectingVector = new Victor(ballPoint.x-paddlePoint.x, ballPoint.y-paddlePoint.y);
                    let vectorToEdge = this.getVectorToEdgeOfBall(object,paddlePoint);

                    let playerDiagonalAngle1 = Math.atan(((Constants.PLAYER_WIDTH / 2) + this.squareHitBox.width / 2) / (Constants.PLAYER_HEIGHT / 2));
                    let playerDiagonalAngle2 = Math.atan(((Constants.PLAYER_WIDTH / 2) + this.squareHitBox.width / 2)/ -(Constants.PLAYER_HEIGHT / 2));
                    
                    if(vectorToEdge.verticalAngle() >= playerDiagonalAngle2 && connectingVector.verticalAngle() <= playerDiagonalAngle1){
                        
                        this.squareHitBox.vector.invertY();
                    }
                    else{
                        this.squareHitBox.vector.invertX();
                    }
                    if(paddleVector.y == 0){
                        this.squareHitBox.vector.y += (connectingVector.y);
                    }else{
                        if(paddleVector.y > 0 && this.squareHitBox.y > 0 || paddleVector.y < 0 && this.squareHitBox.y < 0){
                            this.speed += object.speed;
                        }
                        this.squareHitBox.vector.y += connectingVector.y;
                        this.squareHitBox.vector.y += paddleVector.y;
                    }

                    
                    this.squareHitBox.vector.addX(connectingVector);
                    this.syncHitboxes();
                    this.correctAngle;
                }
                
            
            }
        
    }

    hitTarget(target){
        target.onHit(this.strength);
    }

    /**
     * A method to mitigate the problem of the ball moving in a vertical line, as this creates a boring and uninteresting situation for both players.
     */
    correctAngle(){
        let angle = Math.abs(this.squareHitBox.vector.getVerticalAngle)
        if(angle <= 0.35|| angle >= Math.PI * 2 - 0.35){
            if(this.squareHitBox.vector.x >= 0){
                if(this.squareHitBox.vector.x < 1){
                    this.squareHitBox.vector.x = 1;
                }
                if(angle <= 0.1){
                    this.squareHitBox.vector.x += 40;
                }
            }
            else{
                if(this.squareHitBox.vector.x > -1){
                    this.squareHitBox.vector.x = -1;
                }
                if(angle <= 0.1){
                    this.squareHitBox.vector.x -= 40;
                }
            }
            this.squareHitBox.vector.x *= 40;
        }
    }

    obtainEffect(object){
        if(object instanceof EffectArea){
            if(object.type == 3){
                this.boostInRandom45DegreeAngle();
            }
            if(object.type == 2 && this.currentEffectDurations[2] != -1){
                this.currentEffectDurations [2] = Math.round(this.currentEffectDurations [2] / 2);
                this.explosionStrength++;
            }else{
                if(this.currentEffectDurations[object.type] != -1){
                    this.currentEffectDurations[object.type] += Constants.EFFECT_DURATIONS[object.type];
                }else{
                    this.currentEffectDurations[object.type] = Constants.EFFECT_DURATIONS[object.type];
                }
            }

            if(object.type == 4){
                this.color = Constants.BALL_STRONGER_COLOR;
            }
        }
    }

    countDownEffects(){
        for(let i in this.currentEffectDurations){

            if(this.currentEffectDurations[i] > 0){
                this.handleEffect(i);
                this.currentEffectDurations[i]--;
            }

            if(this.currentEffectDurations[i] == 0){
                this.stopEffect(i);
                this.currentEffectDurations[i]--;
            }
        }
    }

    handleEffect (type){
        if(type == 0 || type == 3){
            this.speed = Constants.BALL_MAX_SPEED;
            this.updateSpeed();
        }

        if(type == 1){
            this.currentEffectDurations[2] = -1;
            this.explosionStrength = 1;
        }

        if(type == 2){
            this.letBallFlash();
        }

        if(type == 4){
            this.strength = 2 * Constants.BALL_DEFAULT_STRENGTH;
        }

        
    }

    
    stopEffect (type){

        if(type >= 0 && type < Constants.EFFECT_DURATIONS.length){
            this.currentEffectDurations [type] = -1;


            if(type == 1){
                this.currentEffectDurations[2] = -1
                this.explosionStrength = 1;
                this.color = Constants.BALL_COLOR;

            }

            if(type == 2){
                this.color = Constants.BALL_COLOR;
                this.explode();
                
            }

            if(type == 4){
                this.strength = Constants.BALL_DEFAULT_STRENGTH;
                this.color = Constants.BALL_COLOR;
            }
        }
    }


    letBallFlash (){
        if(this.currentEffectDurations [2] >= 1){
            if(this.currentEffectDurations [2] > Constants.BALL_FLASHES_FASTER){
                if(this.currentEffectDurations [2] % Constants.BALL_FLASHING_INTERVALS == 0){
                    this.color = Constants.BALL_IGNITED_COLOR;
                }
                if(this.currentEffectDurations [2] % Constants.BALL_FLASHING_INTERVALS == Constants.BALL_FLASHING_INTERVALS/2)
                {
                    if(this.currentEffectDurations[4] > 0){
                        this.color = Constants.BALL_STRONGER_COLOR;
                    }
                    else{
                        this.color = Constants.BALL_COLOR;
                    }
                }
            }

            else{
                if(this.currentEffectDurations [2] % Constants.BALL_FASTER_FLASHING_INTERVALS == 0){
                    this.color = Constants.BALL_IGNITED_COLOR;
                }
                if(this.currentEffectDurations [2] % Constants.BALL_FASTER_FLASHING_INTERVALS == Constants.BALL_FASTER_FLASHING_INTERVALS/2)
                {
                    if(this.currentEffectDurations[4] > 0){
                        this.color = Constants.BALL_STRONGER_COLOR;
                    }
                    else{
                        this.color = Constants.BALL_COLOR;
                    }
                }
            }
        }
    }
    
    explode(){
        this.mainObject.onExplosion(this.sphereHitBox.refPoint, this.explosionStrength);
    }

    boostInRandom45DegreeAngle(){
        let xDirection;
        let yDirection;
        if(Math.random() * (1 - (-1)) - 1 >= 0){
            xDirection = 1;
        }
        else{
            xDirection = -1;
        }
        if(Math.random() * (1 - (-1)) - 1 >= 0){
            yDirection = 1;
        }
        else{
            yDirection = -1;
        }
        let newVector = new Victor(xDirection, yDirection);
        this.squareHitBox.vector = newVector;
        this.sphereHitBox.vector = newVector;
        this.syncHitboxes();
    }

    getVectorToEdgeOfBall (paddlePoint){
        let xEdge = 0;
        let yEdge = 0;
        if(this.previousPosition.y >= paddlePoint.y){
            yEdge = this.previousPosition.y;
        }else{
            yEdge = this.previousPosition.y + this.squareHitBox.height;
        }

        if(this.previousPosition.x >= paddlePoint.x){
            xEdge = this.previousPosition.x;
        }else{
            xEdge = this.previousPosition.x + this.squareHitBox.width;
        }
        return new Victor(xEdge-paddlePoint.x,yEdge - paddlePoint.y);
    }

    

    checkforBorders(){
        switch(this.squareHitBox.checkforBorders()){

            case "y":
                this.squareHitBox.vector.invertY(); 
                this.sphereHitBox.vector = this.squareHitBox.vector;
                this.reduceSpeed();
                this.correctAngle();

                if(this.stuckInBorder == true){
                    this.getOutOfBorder();
                }
                else{
                    this.stuckInBorder = true;
                }
                break;

            case "x":
                this.squareHitBox.vector.invertX();
                this.sphereHitBox.vector = this.squareHitBox.vector;
                this.reduceSpeed(); 
                this.correctAngle();

                if(this.stuckInBorder == true){
                    this.getOutOfBorder();
                }
                else{
                    this.stuckInBorder = true;
                }
                break;

            case "xy": 
                this.squareHitBox.vector.invertX(); 
                this.squareHitBox.vector.invertY(); 
                this.sphereHitBox.vector = this.squareHitBox.vector;
                this.reduceSpeed(); 
                this.correctAngle();

                if(this.stuckInBorder == true){
                    this.getOutOfBorder();
                }
                else{
                    this.stuckInBorder = true;
                }
                break;

            case "o": 
                this.stuckInBorder = false;
        }
    }

    getOutOfBorder(){
        if(this.squareHitBox.xPos + this.squareHitBox.width >= this.squareHitBox.rightBorder){
            this.squareHitBox.xPos = this.squareHitBox.rightBorder - this.squareHitBox.width - 1;
            this.sphereHitBox.xPos = this.sphereHitBox.rightBorder - this.sphereHitBox.radius - 1;
        }
        if(this.squareHitBox.xPos <= this.squareHitBox.leftBorder){
            this.squareHitBox.xPos = this.squareHitBox.leftBorder + 1;
            this.sphereHitBox.xPos = this.sphereHitBox.leftBorder + this.sphereHitBox.radius + 1;
        }
        if(this.squareHitBox.yPos + this.squareHitBox.height >= this.squareHitBox.bottomBorder){
            this.squareHitBox.yPos = this.squareHitBox.bottomBorder - this.squareHitBox.height - 1;
            this.sphereHitBox.yPos = this.sphereHitBox.bottomBorder - this.sphereHitBox.radius - 1;
        }
        if(this.squareHitBox.yPos <= this.squareHitBox.topBorder){
            this.squareHitBox.yPos = this.squareHitBox.topBorder + 1;
            this.sphereHitBox.yPos = this.sphereHitBox.topBorder + this.sphereHitBox.radius + 1;
        }
    }

    reduceSpeed(){
        if(this.speed > Constants.BALL_MAX_SPEED){
            this.speed = Constants.BALL_MAX_SPEED;
        }
        if(this.speed > Constants.BALL_DEFAULT_SPEED){
            this.speed -= Constants.BALL_SPEED_REDUCTION;
            
        }
        if(this.speed < Constants.BALL_DEFAULT_SPEED){
            this.speed = Constants.BALL_DEFAULT_SPEED;
        }
    }
    
    updateSpeed(){
        if(this.speed > Constants.BALL_DEFAULT_SPEED){
            this.speed -= Constants.BALL_SPEED_REDUCTION;
        }
        this.squareHitBox.speed = this.speed;
        this.sphereHitBox.speed = this.speed;
    }

    syncHitboxes(){
        this.sphereHitBox.refPoint.x = this.squareHitBox.xPos + (this.squareHitBox.width / 2);
        this.sphereHitBox.refPoint.y = this.squareHitBox.yPos + (this.squareHitBox.height / 2);
        this.sphereHitBox.movVector = this.squareHitBox.movVector;
    }

    
    
}
