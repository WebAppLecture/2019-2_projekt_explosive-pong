import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import SquareHitObject from "./SquareHitObject.js";
import SphereHitObject from "./SphereHitObject.js";
import Target from "./Target.js";
import * as Constants from "./Constants.js";
import EffectArea from "./EffectArea.js";
import Explosion from "./Explosion.js";
import getRandom from "./Randomizer.js";
import Point from "./Point.js";
//import Victor from './victor/victor-1.1.0/build/victor.js';



export default class Main {
    constructor(){
        this.canvas = document.querySelector("#maincanvas");
        this.ctx = this.canvas.getContext('2d');
        this.scoreP1 = document.querySelector("#score1");
        this.scoreP2 = document.querySelector("#score2");
        this.numTargets = Constants.NUM_TARGETS;
        this.isFirstStart = true;
        window.addEventListener("keydown", this.myKeyDown.bind(this));
        this.drawStartScreen();
    }

    drawStartScreen(){
        this.ctx.fillStyle = Constants.BACKGROUND_COLOR;
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "50px 'Share Tech Mono', monospace"
        this.ctx.textAlign = "center";
        this.ctx.fillText("enter", this.canvas.width/2, 350, this.canvas.width);
    }

    myKeyDown(event){
        if(event.which === Constants.RESET_KEY_CODE){
            this.resetGame();
        }
        if(event.which == Constants.XBOOST_BALL_KEY_CODE){
            this.ball.boostInRandom45DegreeAngle();
        }
        if(event.which >= Constants.MIN_NUM_TARGETS_KEY_CODE && event.which <= Constants.MAX_NUM_TARGETS_KEY_CODE && !this.gameIsRunning){
            this.numTargets = event.which - Constants.MIN_NUM_TARGETS_KEY_CODE + 1;
        }
    }

    createBall(){
        let startDir;
        if(Math.random() * (1 - (-1)) - 1 >= 0){
            startDir = 1;
        }
        else{
            startDir = -1;
        }
        
        let startvector = new Victor(startDir, 0);
        this.ball = new Ball(Constants.BALL_STARTING_X, Constants.BALL_STARTING_Y, startvector, this.canvas, this);
        this.ball.speed = Constants.BALL_DEFAULT_SPEED;
    }

    updateScores(){
        let scorePlayer1 = this.getScore(1);
        let scorePlayer2 = this.getScore(2);
        if(scorePlayer1 >= this.numTargets){
            this.win(1);
        }
        if(scorePlayer2 >= this.numTargets){
            this.win(2);
        }
        this.scoreP1.innerHTML = "" + scorePlayer1;
        this.scoreP2.innerHTML = "" + scorePlayer2;
    }

    

    drawFrame(){
        
        if(this.gameIsRunning){
            this.frameCounter++;
            this.framesSinceLastEffectAreaCreation++;
            this.ctx.fillStyle = Constants.BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            for(let i = 0; i < this.numTargets; i++){
                this.p1Targets[i].draw();
                this.p2Targets[i].draw();
            }
            for(let i = 0; i < Constants.EFFECT_DURATIONS.length; i++){
                if(this.effectAreas[i] != undefined && this.effectAreas[i] != null){
                    this.effectAreas[i].draw();
                }
            }
            
            if(this.explosionOnScreen == true){
                this.duringExplosionPause();
            }
            else{
                this.createEffectArea();
                this.detectCollision();
                
                this.ball.draw();
            }
            this.paddle1.draw();
            this.paddle2.draw();
            
            
            window.requestAnimationFrame(this.drawFrame.bind(this));
            this.updateScores();
        }
        else{
            window.requestAnimationFrame(this.drawWinScreen.bind(this));
            this.isFirstStart = true;
        }
    }

    
    duringExplosionPause (){
        if(this.frameCounter - this.timeSinceLastExplosion >= Constants.EXPLOSION_BREAK){
            this.effectAreas [2] = null;
            this.explosionOnScreen = false;
            if(this.winner == 0){
                this.createBall();
            }
            else{
                this.win(this.winner);
            }
        }
        else{
            this.explosion.draw();
            this.framesSinceLastEffectAreaCreation == Constants.EFFECT_AREA_CHANGE_TIME - 1;
        }
    }
    
    createEffectArea(){
        if(this.framesSinceLastEffectAreaCreation % Constants.EFFECT_AREA_CHANGE_TIME == 0) {
            let randomType = -1;
            this.effectAreas = [];
            do{
                randomType = getRandom(0, Constants.EFFECT_DURATIONS.length);
            }
            while(randomType == 1 && this.ball.currentEffectDurations[2] <= 0)
            let randomX;
            let randomY;
            let randomPoint;
            do{
                randomX = getRandom(Constants.EFFECT_AREA_MIN_X, Constants.EFFECT_AREA_MAX_X);
                randomY = getRandom(Constants.EFFECT_AREA_MIN_Y, Constants.EFFECT_AREA_MAX_Y);
                randomPoint = new Point(randomX, randomY);
            }
            while( randomPoint.getDistanceTo(this.ball.squareHitBox.refPoint) <= Constants.EFFECT_AREA_DISTANCE_TO_BALL)

            let radius = Constants.EFFECT_AREA_RADII[randomType] + Constants.EFFECT_AREA_ERROR_MARGIN;
            this.effectAreas[randomType] = new EffectArea(randomX, randomY, radius, this.canvas, randomType);
            this.framesSinceLastEffectAreaCreation = 0;
        }
    }
    

    detectCollision (){
        if(SquareHitObject.detectCollision(this.ball, this.paddle1)){
            this.ball.bounceFrom(this.paddle1);
        }
        
        if(SquareHitObject.detectCollision(this.ball, this.paddle2)){
            this.ball.bounceFrom(this.paddle2);
        }
        
        for(let i = 0; i < this.numTargets; i++){
            if(SquareHitObject.detectCollision(this.ball, this.p1Targets[i])){
                this.ball.hitTarget(this.p1Targets[i]);
            }
            if(SquareHitObject.detectCollision(this.ball, this.p2Targets[i])){
                this.ball.hitTarget(this.p2Targets[i]);
            }
        }
        for(let i in this.effectAreas){
            if(this.effectAreas[i] != undefined && this.effectAreas[i] != null){
                if(SphereHitObject.detectCollision(this.ball, this.effectAreas[i])){
                    this.ball.obtainEffect(this.effectAreas[i]);
                    this.effectAreas[i] = null;
                    this.framesSinceLastEffectAreaCreation = Constants.EFFECT_AREA_CHANGE_TIME;
                    this.createEffectArea();
                }
            }
        }
    
    }

    onExplosion (centerPoint, strength){
        this.explosion = new Explosion(centerPoint.x, centerPoint.y, strength, this.canvas);
        for(let i = 0; i < this.p1Targets.length; i++){
            
            let point1 = this.p1Targets[i].squareHitBox.refPoint;

            if(SphereHitObject.detectCollision(this.explosion, point1) == true){
                this.p1Targets[i].onHit(Constants.TARGET_HEALTH);
            }

            let point2 = this.p2Targets[i].squareHitBox.refPoint;
            if(SphereHitObject.detectCollision(this.explosion, point2) == true){
                this.p2Targets[i].onHit(Constants.TARGET_HEALTH);
            }
        }
        this.explosionOnScreen = true;
        this.timeSinceLastExplosion = this.frameCounter;
    }
    

    getScore(whichPlayer){
        let counter = 0;
        if(whichPlayer == 1){
            for(let i = 0; i < this.p2Targets.length; i++){
                if(this.p2Targets[i].health < 1){
                    counter++;
                }
            }
        }
        if(whichPlayer == 2){
            for(let i = 0; i < this.p1Targets.length; i++){
                if(this.p1Targets[i].health < 1){
                    counter++;
                }
            }
        }

        return counter;
    }

    win(whoWon){
        this.winner = whoWon;
        if(!this.explosionOnScreen){
            this.gameIsRunning = false;
        }
    }
    
    drawWinScreen(){
        this.ctx.fillStyle = Constants.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        if(this.checkForEasteregg()){
            let goldGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            goldGradient.addColorStop(0.2, Constants.GOLD_COLOR_1);
            goldGradient.addColorStop(0.5, Constants.GOLD_COLOR_2);
            goldGradient.addColorStop(0.8, Constants.GOLD_COLOR_1);
            this.ctx.fillStyle = goldGradient;
            
        }

        this.ctx.font = "50px 'Share Tech Mono', monospace"
        this.ctx.textAlign = "center";
        this.ctx.fillText(Constants.WINNING_MESSAGE_1 + this.winner, this.canvas.width / 2, 200, this.canvas.width);
        if(this.checkForEasteregg()){
            this.ctx.fillText(Constants.WINNING_MESSAGE_2_VARIANT, this.canvas.width / 2, 400, this.canvas.width);
        }
        else{
            this.ctx.fillText(Constants.WINNING_MESSAGE_2, this.canvas.width / 2, 400, this.canvas.width);
        }
        this.ctx.fillText(Constants.WINNING_MESSAGE_3, this.canvas.width / 2, 600, this.canvas.width);
    }

    checkForEasteregg(){
        let winnersTargets;
        let numberOfFullHPTargets = 0;

        if(this.winner == 1){
            winnersTargets = this.p1Targets;
        }
        if(this.winner == 2){
            winnersTargets = this.p2Targets;
        }

        if(this.winner != 0){
            for (let i = 0; i < this.numTargets; i++){
                if(winnersTargets[i].health == Constants.TARGET_HEALTH){
                    numberOfFullHPTargets++;
                }
            }
        }
        return (numberOfFullHPTargets == this.numTargets);
    }

    resetGame(){
        console.log("reset game called");
        this.frameCounter = 0;
        this.framesSinceLastEffectAreaCreation = 0;
        
        this.winner = 0;
        this.ball = null;
        this.createBall();
        this.paddle1 = new Paddle(Constants.PLAYER_1_X, Constants.PLAYER_1_STARTING_Y, this.canvas, Constants.PLAYER_1_KEY_UP, Constants.PLAYER_1_KEY_DOWN);
        this.paddle2 = new Paddle(Constants.PLAYER_2_X, Constants.PLAYER_2_STARTING_Y, this.canvas, Constants.PLAYER_2_KEY_UP, Constants.PLAYER_2_KEY_DOWN);
        this.effectAreas = [];

        this.explosionOnScreen = false;
        this.explosion = null;
        this.timeSinceLastExplosion = 0;

        this.gameIsRunning = true;

        this.p1Targets = [];
        this.p2Targets = [];
        for(let i = 0; i < this.numTargets; i++){
            this.p1Targets[i] = new Target(Constants.P1_TARGET_X, (i + 0.5) * (this.canvas.height / (this.numTargets)), Constants.TARGET_WIDTH, Constants.TARGET_HEIGHT, this.canvas);
            this.p2Targets[i] = new Target(Constants.P2_TARGET_X, (i + 0.5) * (this.canvas.height / (this.numTargets)), Constants.TARGET_WIDTH, Constants.TARGET_HEIGHT, this.canvas);
        }
        if(this.isFirstStart != false){
            window.requestAnimationFrame(this.drawFrame.bind(this));
            this.isFirstStart = false;
        }
    }
}

