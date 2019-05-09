import * as PIXI from 'pixi.js';

export default class specialWeapon {
    constructor({name, id, qty, areaOfDamage, gunPath, bulletPath, app, config, playContainer}) {
        this.app = app;
        this.config = config;
        this.playContainer = playContainer;
        this.name = name || 'shotty';
        this.id = id || 'shotGunIcon';
        this.qty = qty || 0;
        this.active = false;
        this.bulletPath = bulletPath;
        this.gunPath = gunPath;
        this.areaOfDamage = areaOfDamage || 1;
        this.bulletSprite = new PIXI.Sprite.from(bulletPath);
        this.bulletSprite.zIndex = 3;
        this.gunSprite = new PIXI.Sprite.from(gunPath);
        this.playContainer.addChild(this.gunSprite);
        this.gunSprite.zIndex = 999;
        this.gunSprite.visible = false;
        this.ticker = new PIXI.ticker.Ticker();
        this.bulletTicker = new PIXI.ticker.Ticker();
        this.iam = new PIXI.interaction.InteractionManager(this.app.renderer);
        this.toggled = false;
        this.shotLife = .5;
        this.shotLifeCounter = 0;
        this.startTime = null;
    }
    fireShot(gamePiece) {
        this.startTime = new Date();
            this.bulletSprite= new PIXI.Sprite.from(this.bulletPath);
            this.playContainer.addChild(this.bulletSprite);
            this.bulletTicker = new PIXI.ticker.Ticker();
            this.bulletTicker.start();
            this.startTime.setSeconds(this.startTime.getSeconds() + this.shotLife);
            this.bulletSprite.anchor.set(0.5);
            this.bulletSprite.setTransform(this.iam.mouse.global.x +300, this.iam.mouse.global.y+300, 1, 1, 0, 0, 0, 300, 300);
            let calcY = this.iam.mouse.global.y+300;
            let calcX = this.iam.mouse.global.x+300;
            this.qty = this.qty - 1;
            this.bulletTicker.add((delta) => {
                this.shotLifeCounter = Math.floor((this.startTime - Date.now()) / 100);
                this.bulletSprite.setTransform(calcX, calcY, .9, .9, 0, 0, 0, 300, 300);
                if (this.shotLifeCounter <0 ) {
                    this.bulletSprite.destroy();
                    this.bulletTicker.destroy();
                }
            });
    }
    toggle() {
        this.toggled = !this.toggled;
        if (this.toggled) {
            this.gunSprite.anchor.set(0.5);
            this.gunSprite.visible = true;
            this.gunSprite.setTransform(1100, 970, 1, 1, 0, 0, 0, 100, 100);
            this.ticker = new PIXI.ticker.Ticker();
            this.ticker.add((delta) => {
                this.gunSprite.zIndex = 99;
                if (this.iam.mouse.global.x != -999999 && this.iam.mouse.global.y != -999999) {
                    if (this.iam.mouse.global.y < this.config.height*.4) {
                        this.gunSprite.setTransform(this.iam.mouse.global.x+300, 600, 1, 1, 0, 0, 0, 100, 100);
                    } else if (this.iam.mouse.global.y > this.config.height*.6) {
                        this.gunSprite.setTransform(this.iam.mouse.global.x+300, 900, 1, 1, 0, 0, 0, 100, 100);
                    } else {
                        this.gunSprite.setTransform(this.iam.mouse.global.x+300, 790, 1, 1, 0, 0, 0, 100, 100);
                    }
                }
            });
            this.ticker.start();
        } else {
            this.ticker.destroy();
            this.gunSprite.visible = false;
        }
        
    
        
    }
}