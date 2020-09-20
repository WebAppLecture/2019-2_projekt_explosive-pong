
export default class Point{
    constructor(xPos, yPos){
        this.x = xPos;
        this.y = yPos;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getDistanceTo(anotherPoint){
        if(anotherPoint instanceof Point){
            let xdifference = this.getX() - anotherPoint.getX();
            let ydifference = this.getY() - anotherPoint.getY();

            if(xdifference < 0){
                xdifference = -xdifference;
            }
            if(ydifference < 0){
                ydifference = -ydifference;
            }

            let distance = Math.sqrt((xdifference * xdifference) + (ydifference * ydifference));
            return distance;
        }else{
            //console.log("wrong parameter in Point.getDistanceTo(): parameter must be another Point");
            return undefined;
        }
    }
}