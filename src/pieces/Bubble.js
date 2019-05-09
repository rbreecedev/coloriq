import * as PIXI from 'pixi.js';
// TODO:
// -create a aspect of randomness to the pivot, elipse height, elipse width, and rotation
// -draw the elipse with draw elipse oputside the ticker and use set transform for all the animations in one place.
//
export default class Bubble {
    constructor(app, X, Y, scale, color, blur, opacity, click, interactive, isAnimated, container) {
        this.app = app;
        this.playContainer = container;
        this.X = X;
        this.Y = Y;
        this.color = color;
        this.click = click;
        this.opacity = opacity;
        this.blur = blur || 0;
        this.bubble = new PIXI.Graphics();
        this.bubble.zIndex = 99;
        this.isDestroy = false;
        this.isAnimated = isAnimated;
        this.bubble.pivot = new PIXI.Point(this.X -10,this.Y -30);
        this.bubble.interactive = interactive;
        this.bubble.accessible = true;
        this.bubble.accessibleHint = null;
        this.bubble.on('click', (e) => {
            this.click(this.bubble.accessibleHint);
        });
        this.bubble.buttonMode= true;
        this.count = 0;
        this.lastCount = 1;
        if(this.playContainer) {
            this.playContainer.addChild(this.bubble);
        } else {
            this.app.stage.addChild(this.bubble);
        }
        this.ticker = app.ticker.add((delta) => {
            if(this.isAnimated) {
                if(this.lastCount<=this.count && this.count < 1.5) {
                    this.lastCount = this.count;
                    this.count += 0.01;
                } else if(this.lastCount >= this.count && this.count <= 1) {
                    this.lastCount = 1;
                    this.count = 1;
                } else {
                    this.lastCount = this.count;
                    this.count -= 0.01;
                }
                this.bubble.clear();
                this.bubble.position = new PIXI.Point(this.X,this.Y);
                this.bubble.scale = new PIXI.Point((Math.random() * (scale*1.03 - scale) + scale), (Math.random() * (scale*1.03 - scale) + scale));
                this.bubble.beginFill(this.color, this.opacity);
                this.bubble.drawEllipse(this.X, this.Y, 10 *Math.sin(this.count*1) * 20, 10 *Math.sin(this.count*1.2) * 20);
                this.bubble.endFill();
                this.bubble.rotation -= (Math.random() * (0.15 - 0.08) + 0.08) * delta;
            } else {
                if(this.lastCount<=this.count && this.count < 1.5) {
                    this.lastCount = this.count;
                    this.count += 0.01;
                } else if(this.lastCount >= this.count && this.count <= 1) {
                    this.lastCount = 1;
                    this.count = 1;
                } else {
                    this.lastCount = this.count;
                    this.count -= 0.01;
                }
                this.bubble.clear();
                this.bubble.position = new PIXI.Point(this.X,this.Y);
                this.bubble.scale = new PIXI.Point(scale*1.03, scale*1.03);
                this.bubble.beginFill(this.color, this.opacity);
                this.bubble.drawEllipse(this.X, this.Y, 10 *Math.sin(this.count) * 22, 10 *Math.sin(this.count*1.2) * 20);
                this.bubble.endFill();
                this.bubble.zIndex = 2;
                this.bubble.rotation -= (Math.random() * (0.08 - 0.04) + 0.04) * delta;
            }
            if (this.isDestroy) {
                this.bubble.visible =false;
                let obj = this.bubble.clear();
                if(this.playContainer) {
                    this.playContainer.removeChild(obj);
                } else {
                    this.app.stage.removeChild(obj);
                }
            }
        });
    }
    destroy() {
        this.isDestroy = true;
        // this.removeTicker();
    }
    removeTicker() {
        setTimeout(() => {
            this.ticker.destroy();
        }, 10);
    }
}