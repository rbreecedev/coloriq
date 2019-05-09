import * as PIXI from 'pixi.js';
import * as pixiSound from 'pixi-sound';

export default class LoadScene {
    constructor () {
        this.startTime = new Date();
        this.loadTicker = new PIXI.ticker.Ticker();
    }
    async init () {
        return new Promise((resolve, reject) => {
            this.loadTicker.stop();
            this.startTime.setSeconds(this.startTime.getSeconds() + 1);
            this.loadTicker.add((deltaTime) => {
                let time = Math.floor((this.startTime - Date.now()) / 1000);
                if (time <= 0) {
                    resolve();
                }
            });
            this.loadTicker.start();
        });
    }
    cleanup() {
    }
}