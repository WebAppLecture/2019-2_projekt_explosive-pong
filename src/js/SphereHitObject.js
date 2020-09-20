import Point from "./Point.js";

export default class SphereHitObject{

    constructor (xPos, yPos, radius, topBorder, bottomBorder, leftBorder, rightBorder, speed, movVector){
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.topBorder = topBorder;
        this.bottomBorder = bottomBorder;
        this.rightBorder = rightBorder;
        this.leftBorder = leftBorder;
        this.refPoint = this.updateRefPoint();
        this.speed = speed;
        this.vector = movVector;
    }

    updateRefPoint (){
        this.refPoint = new Point(this.xPos, this.yPos);
        return this.refPoint;
    }

    calcNewPosition (){
        this.normalizeVectorBySpeed();
        this.updateRefPoint();
        let coordComponents = this.vector.toArray();
        this.xPos += coordComponents[0] * 1;
        this.yPos += coordComponents[1] * 1;
    }

    normalizeVectorBySpeed(){
        this.vector.normalize();
        this.vector.x *= this.speed;
        this.vector.y *= this.speed;
    }

    checkforBorders(){
        let collisionType = "o";
        if( (this.yPos - this.radius) <= this.topBorder || (this.yPos + this.radius) >= this.bottomBorder){
            collisionType = "y"
        }

        if( (this.xPos - this.radius) <= this.leftBorder || (this.xPos + this.radius) >= this.rightBorder){
            if(collisionType == "y"){
                collisionType = "xy"
            }
            else{
                collisionType = "x";
            }
        }

        return collisionType;
    }

    static detectCollision (object1, object2){
        let collision = false;
        let point1 = object1.sphereHitBox.refPoint;
        let radius1 = object1.sphereHitBox.radius;
        if(object2 instanceof Point){
            if(point1.getDistanceTo(object2) <= radius1){
                collision = true;
            }
        }
        else{
            if(object2 instanceof SphereHitObject){
                let point2 = object2.refPoint;
                let radius2 = object2.radius;
                if(point1.getDistanceTo(point2) <= radius1 + radius2){
                    collision = true;
                }
            }else{
                let point2 = object2.sphereHitBox.refPoint;
                let radius2 = object2.sphereHitBox.radius;
                if(point1.getDistanceTo(point2) <= radius1 + radius2){
                    collision = true;
                }
            }
        }
        return collision;
    }
}