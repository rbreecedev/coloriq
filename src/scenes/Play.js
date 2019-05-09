import * as PIXI from 'pixi.js';
import Bubble from '../pieces/Bubble';
import PlayArea from '../pieces/PlayArea';
import ScoreBoard from '../pieces/ScoreBoard';
import Specials from '../pieces/Specials';
import { selfExpiringTicker } from '../PIXIExtras/selfExpiringTicker';
import { callbackify } from 'util';


export default class PlayScene {
    constructor({config, player, app, sounds}) {
        this.config = config;
        this.player = player;
        this.sounds = sounds;
        this.app = app;
        this.scoreboard = new ScoreBoard();
        this.renderTexture = PIXI.RenderTexture.create(this.config.width, this.config.height);
        this.renderTexture2 = PIXI.RenderTexture.create(this.config.width, this.config.height);
        this.currentTexture = this.renderTexture;
        this.playContainer = new PIXI.Container();
        this.playContainer.sortableChildren = true;
        this.stageSprite = PIXI.Sprite.from(this.renderTexture);
        this.save = false;
        this.needBorderUpdate = false;
        this.specialsCollection = [];
        this.start = new Date();
        this.count = 0;
        this.playArea = null;
        this.addScore = this.addScore.bind(this);
        this.startTime = new Date();
        this.changeTime = new Date();
        this.timeToAdd = 2;
        this.timeTillChange = 3;
        this.countdown = 30;
        this.lastCountdown = 31;
        this.changeCountdown = this.timeTillChange;
        this.playTicker = new PIXI.ticker.Ticker();
        this.playResolve = null;
        this.playReject = null;
        this.gameOverBG = new PIXI.Graphics();
        this.adBlock = document.createElement('ins');
        this.app.stage.addChild(this.playContainer);
        this.gameOverTitle = new PIXI.Text('Your Color IQ is \n'+this.player.score+'\n Your a freakin Genius!',{fontFamily : 'Arial', fontSize: 40, fill : 0xffffff, align : 'center'});
        this.gameOverText = new PIXI.Text('GAME OVER',{fontFamily : 'Arial', fontSize: 54, fill : 0xffffff, align : 'center'});
    }
    async init() {
        return new Promise((resolve, reject) => {
            // save the promise functions
            this.playResolve = resolve;
            this.playReject = reject;

            // stage effects
            this.playContainer.addChild(this.stageSprite);
            
            this.stageSprite.position.x = this.config.width/2;
            this.stageSprite.position.y = this.config.height/2;
            this.stageSprite.anchor.x = 0.5;
            this.stageSprite.anchor.y = 0.5;
            this.playContainer.pivot = new PIXI.Point(this.config.width/2,this.config.height/2);
            this.playContainer.position = new PIXI.Point(this.config.width/2,this.config.height/2);
            this.stageSprite.alpha = .1;

            //play ticker - update function
            this.playTicker.stop();
            this.startTime.setSeconds(this.startTime.getSeconds() + this.countdown);
            this.changeTime.setSeconds(this.changeTime.getSeconds() + this.timeTillChange);
            this.playTicker.add(this.playTickerFunc.bind(this));
            this.playTicker.start();
            
            // start stage animation
            this.changeSave();

            // init the play area
            this.playArea = new PlayArea({
                app: this.app,
                playContainer: this.playContainer,
                sounds: this.sounds,
                gridsize: this.config.levelQtyStart * this.player.level,
                screenWidth: this.config.width,
                screenHeight: this.config.height,
                addScore: this.addScore,
                specialsCollection: this.specialsCollection,
                player: this.player
            });
        });
    }
    async gameOver() {
        this.playTicker.stop();
        this.save = false;
        this.stageSprite.texture = null;
        this.gameOverBG.beginFill(0x000000);
        this.gameOverBG.lineStyle(25, 0x000000, 1);
        this.gameOverBG.moveTo(0,0);
        this.gameOverBG.lineTo(this.config.width,0);
        this.gameOverBG.lineTo(this.config.width, this.config.height);
        this.gameOverBG.lineTo(0, this.config.height);
        this.gameOverBG.endFill();
        this.gameOverBG.alpha = .5;
        this.gameOverBG.interactive = true;
        this.playContainer.addChild(this.gameOverBG);
        this.adBlock.setAttribute('data-ad-client', 'ca-pub-9212170889709965');
        this.adBlock.setAttribute('data-ad-slot', '4098773054');
        this.adBlock.setAttribute('data-ad-format', 'auto');
        this.adBlock.setAttribute('data-full-width-responsive', 'true');
        this.adBlock.className = 'adsbygoogle';
        this.adBlock.style.width = '100%';
        this.adBlock.style.zIndex = '9999';
        this.adBlock.style.top = '70px';
        this.adBlock.style.left = 0;
        this.adBlock.style.right = 0;
        this.adBlock.style.background = 'white';
        this.adBlock.style.display = 'block';
        this.adBlock.style.position = 'absolute';
        window.document.getElementById('game_container').appendChild(this.adBlock);
        (adsbygoogle = window.adsbygoogle || []).push({});
        this.setOptions = {
            delay: 2,
            incrementBy: .001,
            beforeAddTicker:() => {
            },
            updateTicker: (count) => {
            },
            onDestroy: () => {
                this.playContainer.addChild(this.gameOverTitle);
                this.playContainer.addChild(this.gameOverText);
                this.gameOverTitle.text = 'Your Color IQ is \n'+this.player.score;
                this.gameOverText.position = new PIXI.Point(this.config.width /2, this.config.height - 50);
                this.gameOverText.anchor.set(.5)
                this.gameOverTitle.position = new PIXI.Point(this.config.width /2, this.config.height - 200);
                this.gameOverTitle.anchor.set(.5)
            }
        };
        await selfExpiringTicker(this.setOptions);
    }
    cleanup() {
        this.adBlock.style.display = 'none';
        this.playArea.clearPlayArea();
        this.playContainer.removeChildren();
        this.scoreboard.header.style.display = 'none';
        this.playResolve();
    }
    getSpecialsCollection () {
        return this.specialsCollection;
    }
    async playTickerFunc(delta) {
        this.count += 0.01;
        this.playContainer.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
        // const temp = this.renderTexture;
        // this.renderTexture = this.renderTexture2;
        // this.renderTexture2 = temp;
        // this.stageSprite.texture = this.renderTexture;
        // this.stageSprite.scale.set(.9 + Math.sin(this.count) * .04);
        // this.app.renderer.render(this.app.stage, this.renderTexture2, this.save);
        this.scoreboard.setColor(this.playArea.winner);
        this.countdown = Math.floor((this.startTime - Date.now()) / 1000);
        this.changeCountdown = Math.floor((this.changeTime - Date.now()) / 1000);
        if (this.specialsCollection && this.specialsCollection.length>0) {
            this.activateSpecialIcons();
            this.specialsCollection.map(special => {
                this.scoreboard.specialSlot1QTY.textContent = `${special.qty}`;
            })
        }
        if (this.countdown <= 0) {
            this.gameOver();
            this.scoreboard.counterText.textContent = 0;
        } else {
            if (this.countdown !== this.lastCountdown) {
                this.scoreboard.counterText.textContent = this.countdown;
                this.lastCountdown = this.countdown;
            }
        }
        // if (this.changeCountdown <= 0) {
        //     this.resetChangeCounter();
        //     this.playArea.selectWinner();
        //     this.needBorderUpdate = true;
        // }
        if (this.needBorderUpdate) {
            this.playArea.drawBorderGraphic();
            this.needBorderUpdate = false;
        }
        switch (this.player.score) {
            case 5: {
                if (this.specialsCollection.length < 1) {
                    this.specialsCollection.push(
                        new Specials(
                        {
                            name: 'shotty', 
                            id: 'shotGunIcon', 
                            qty: 99, 
                            areaOfDamage: 1, 
                            gunPath: require('../assets/shottyGraphic.png'),
                            bulletPath: require('../assets/shottySpray.png'), 
                            app: this.app,
                            playContainer: this.playContainer,
                            config: this.config
                        })
                    );
                    this.player.score++
                }
            } default:{
                
            }
        }
    }
    checkForSpecials() {

    }
    clickSpecialSlotOne() {
        this.specialsCollection.map((e)=> {
            e.toggle();
        });
    }
    activateSpecialIcons() {
        this.specialsCollection.map((special) => {
            if (special.qty > 0 && special.active === false) {
                this.scoreboard[special.id].style.display = 'block';
                this.scoreboard[special.id].addEventListener("click", this.clickSpecialSlotOne.bind(this));
                special.active = true;
            } else if (special.qty <= 0) {
                this.scoreboard[special.id].style.display = 'hidden';
                special.active = false;
            }
            
        });
    }
    addScore(points) {
        this.player.score += points;
        this.addTime(2);
        this.player.levelProgession++;
        this.scoreboard.scoreText.textContent = this.player.score;
        this.levelCheck();
    }
    addTime(time) {
        this.startTime.setSeconds(this.startTime.getSeconds() + time);
    }
    resetChangeCounter() {
        this.changeTime.setSeconds(this.changeTime.getSeconds() + this.timeTillChange);
    }
    changeSave() {
        setInterval(() => {
            this.save = !this.save;
        }, 50);
    }
    levelCheck() {
        if(this.config.progressLevel === this.player.levelProgession) {
            this.player.level++;
            this.player.levelProgession = 1;
            this.scoreboard.levelText.textContent = this.player.level;
            this.stageSprite.alpha = this.player.levelProgession/10;
            this.sounds.right.play();
            this.playArea.clearPlayArea();
            this.addTime(30);
            this.playArea = new PlayArea({
                app: this.app,
                playContainer: this.playContainer,
                sounds: this.sounds,
                gridsize: this.config.levelQtyStart * this.player.level,
                screenWidth: this.config.width,
                screenHeight: this.config.height,
                addScore: this.addScore,
                specialsCollection: this.specialsCollection,
                player: this.player
            });
        } else {
            this.stageSprite.alpha = this.player.levelProgession/10;
        }
    }
}