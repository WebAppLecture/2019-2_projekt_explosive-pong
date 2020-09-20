import Point from "./Point.js";

export default class SquareHitObject{

    constructor(xPos, yPos, width, height, topBorder, bottomBorder, leftBorder, rightBorder, speed, movVector){
        
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.topBorder = topBorder;
        this.bottomBorder = bottomBorder;
        this.rightBorder = rightBorder;
        this.leftBorder = leftBorder;
        this.refPoint = this.updateRefPoint();
        this.speed = speed;
        this.vector = movVector;
        
        
    }

    updateRefPoint (){
        this.refPoint = new Point(this.xPos + (this.width / 2), this.yPos + (this.height / 2));
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
            if(this.yPos <= this.topBorder || (this.yPos + this.height) >= this.bottomBorder){
                collisionType = "y"
            }
            if(this.xPos <= this.leftBorder || (this.xPos + this.width) >= this.rightBorder){
                if(collisionType == "y"){
                    collisionType = "xy"
                }else{
                    collisionType = "x";
                }
            }

        return collisionType;
    }

    static detectCollision(object1, object2){
        let collidesX = false;
        let collidesY = false;

        let maxXCoord1 = Math.max(object1.squareHitBox.xPos, object1.squareHitBox.xPos + object1.squareHitBox.width);
        let minXCoord1 = Math.min(object1.squareHitBox.xPos, object1.squareHitBox.xPos + object1.squareHitBox.width);
        let maxXCoord2 = Math.max(object2.squareHitBox.xPos, object2.squareHitBox.xPos + object2.squareHitBox.width);
        let minXCoord2 = Math.min(object2.squareHitBox.xPos, object2.squareHitBox.xPos + object2.squareHitBox.width);
        collidesX = (Math.abs(Math.max(maxXCoord1, maxXCoord2) - Math.min(minXCoord1, minXCoord2)) <= (Math.abs(maxXCoord1 - minXCoord1) + Math.abs(maxXCoord2 - minXCoord2)))

        let maxYCoord1 = Math.max(object1.squareHitBox.yPos, object1.squareHitBox.yPos + object1.squareHitBox.height);
        let minYCoord1 = Math.min(object1.squareHitBox.yPos, object1.squareHitBox.yPos + object1.squareHitBox.height);
        let maxYCoord2 = Math.max(object2.squareHitBox.yPos, object2.squareHitBox.yPos + object2.squareHitBox.height);
        let minYCoord2 = Math.min(object2.squareHitBox.yPos, object2.squareHitBox.yPos + object2.squareHitBox.height);

        collidesY = (Math.abs(Math.max(maxYCoord1, maxYCoord2) - Math.min(minYCoord1, minYCoord2)) <= (Math.abs(maxYCoord1 - minYCoord1) + Math.abs(maxYCoord2 - minYCoord2)))

        if(collidesY && collidesX){
            return true;
        }
        else{
            return false;
        }
        
    }

}