import * as PIXI from 'pixi.js';
import Bubble from './Bubble';
import Specials from '../pieces/Specials';

export default class PlayArea {
    constructor({app, playContainer, player, gridsize, screenHeight, screenWidth, addScore, sounds, specialsCollection}) {
    this.gridsize = gridsize;
    this.app = app;
    this.playContainer = playContainer;
    this.player = player;
    this.specialsCollection = specialsCollection;
    this.sounds = sounds;
    this.bubbleGrid = [];
    this.addScore = addScore;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.selectedX = this.gridsize + 1;
    this.selectedY = 0;
    this.winner = '';
    this.columns = null;
    this.rows =null;
    this.gridTotal = this.gridsize * this.gridsize;
    this.borderGraphic = new PIXI.Graphics();
    this.init();
    this.selectWinner();
    }
    init() {
        for (let i = this.gridTotal; i > 0; i--) {
            if (i % this.gridsize == 0) {
                this.selectedY = i / this.gridsize;
                if (this.selectedX == 1) {
                    this.selectedX = this.gridsize + 1;
                }
                if (this.columns === null) {
                    this.columns = [];
                    let total = this.screenWidth;
                    let fract = total / this.selectedY;
                    for(let i = this.selectedY; i>0; i--) {
                        if (i === this.selectedY) {
                            this.columns[i] = total+100;
                        } else {
                            this.columns[i] = Math.abs(i * fract - total);
                        }
                     }
                }
                if (this.rows === null) {
                    this.rows = [];
                    let total = this.screenHeight;
                    let fract = total / this.selectedY;
                    for(let i = this.selectedY; i>0; i--) {
                        if (i === this.selectedY) {
                            this.rows[i] = total + 100;
                        } else {
                            this.rows[i] = Math.abs(Math.floor(i * fract - total));
                        }
                     }
                }
                this.selectedX--;
                let isAnimated = this.player.level > 1 ? false : true;
                let bubble = new Bubble(this.app, this.columns[this.selectedY], this.rows[this.selectedX], .15, '0x'+Math.random().toString(16).substr(-6), 0, 1, this.fireController.bind(this), true, isAnimated, this.playContainer);
                let gridObj = {
                    x: this.selectedX, 
                    y: this.selectedY,
                    bubble
                };
                bubble.bubble.accessibleHint = gridObj;
                this.bubbleGrid.push(gridObj);
            } else {
                this.y = this.selectedX--;
                let isAnimated = this.player.level > 1 ? false : true;
                let bubble = new Bubble(this.app, this.columns[this.selectedY], this.rows[this.selectedX], .15, '0x'+Math.random().toString(16).substr(-6), 0, 1, this.fireController.bind(this), true, isAnimated, this.playContainer);
                this.x = this.selectedX;
                let gridObj = {
                    x: this.selectedX, 
                    y:this.selectedY,
                    bubble
                };
                bubble.bubble.accessibleHint = gridObj;
                this.bubbleGrid.push(gridObj);            
            }
        }
        // let bubble2 = new Bubble(app, config.width/4, config.height/4, .6, '0x4286f4', .7, .6);
        // let bubble3 = new Bubble(app, config.width* .8, config.height/5, .4, '0x4286f4', 0, .8);
    }
    pickRandomColor() {
        let randomX = Math.floor(Math.random() * (this.gridsize - 1) + 1);
        let randomY = Math.floor(Math.random() * (this.gridsize - 1) + 1);
        let w = this.bubbleGrid.filter((e)=> e.x == randomX && e.y == randomY);
        while(w.length<1) {
            this.pickRandomColor();
        } 
        this.winner = w[0].bubble.color;
    }
    drawBorderGraphic() {
        this.borderGraphic.lineStyle(25, this.winner, 1);
        this.borderGraphic.moveTo(0,0);
        this.borderGraphic.lineTo(this.screenWidth,0);
        this.borderGraphic.lineTo(this.screenWidth, this.screenHeight);
        this.borderGraphic.lineTo(0, this.screenHeight);
        this.borderGraphic.lineTo(0,0);
        this.borderGraphic.beginFill(this.winner);
        this.borderGraphic.drawCircle(0,0,50);
        this.borderGraphic.drawCircle(this.screenWidth,0,50);
        this.borderGraphic.drawCircle(this.screenWidth, this.screenHeight,50);
        this.borderGraphic.drawCircle(0, this.screenHeight,50);
        this.borderGraphic.endFill();
        this.playContainer.addChild(this.borderGraphic);
        this.borderGraphic.pivot = new PIXI.Point(this.screenWidth/2,this.screenHeight/2);
        this.borderGraphic.position = new PIXI.Point(this.screenWidth/2,this.screenHeight/2);
    }
    selectWinner() {
        this.pickRandomColor();
        this.drawBorderGraphic();
    }
    replaceGamePiece() {

    }
    fireController(gamePiece) {
        if (this.specialsCollection.length>0 && this.specialsCollection[0].toggled) {
            this.sounds.shotty.play();
            this.specialsCollection[0].fireShot(gamePiece);
            let x = gamePiece.x;
            let y = gamePiece.y;
            let gunSpray = [];
            for (let i=x-this.specialsCollection[0].areaOfDamage; i<=this.specialsCollection[0].areaOfDamage+x; i++) {
                for (let v=y-this.specialsCollection[0].areaOfDamage; v<=this.specialsCollection[0].areaOfDamage+y; v++) {
                    gunSpray.push({x:i, y:v});
                }
            }
            for(let i=0; i<gunSpray.length; i++) {
                let bub = this.bubbleGrid.filter(({x,y}) => gunSpray[i].x == x && gunSpray[i].y ==y)[0];
                let res = this.ckeckForMatch(bub);
                if(res) {
                    break;
                }
            }
            this.bubbleGrid = this.bubbleGrid.filter(({bubble}) => bubble.isDestroy === false);
        } else {
            this.sounds.click.play();
            this.ckeckForMatch(gamePiece);
        }
    }
    ckeckForMatch(gamePiece) {
        if(gamePiece) {
            if (gamePiece.bubble.color === this.winner) {
                this.clearPlayArea();
                this.bubbleGrid = [];
                this.init();
                this.selectWinner();
                this.addScore(1);
                return true;
            } else {
                gamePiece.bubble.destroy();
                return false;
            }
        }
    }
    clearPlayArea() {
        this.bubbleGrid.map(({bubble}) => bubble.destroy());
    }
    
}
