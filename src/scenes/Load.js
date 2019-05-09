import * as PIXI from 'pixi.js';
import * as pixiSound from 'pixi-sound';
import Bubble from '../pieces/Bubble';

export default class LoadScene {
    constructor ({app, config}) {
        this.app = app;
        this.config = config;
        this.soundPaths = [
            {name: 'click', soundUrl: require('../assets/click.mp3')},
            {name: 'start', soundUrl: require('../assets/start.mp3')},
            {name: 'gameover', soundUrl: require('../assets/gameover.mp3')},
            {name: 'right', soundUrl: require('../assets/right.mp3')},
            {name: 'song1', soundUrl: require('../assets/song-1.mp3')},
            {name: 'shotty', soundUrl: require('../assets/shotty.mp3')}
        ];
        this.sounds = [];
        this.startTime = new Date();
        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            align: 'center',
            fontSize: 70,
            fontWeight: 'bold',
            fill: ['#ffffff'], // gradient
            stroke: '#4a1850'
        });
        this.richText = new PIXI.Text('Color IQ', this.style);
        this.bubble = new Bubble(this.app, this.config.width / 2, this.richText.height / 2 +200, 1.5, '0x'+Math.random().toString(16).substr(-6),false);
        this.loadTicker = new PIXI.ticker.Ticker();
    }
    async init () {
        let s = await this.getSounds();
        this.richText.position= new PIXI.Point((this.config.width / 2)-(this.richText.width / 2), (this.config.height / 2)-(this.richText.height / 2+100));
        this.app.stage.addChild(this.richText);

        return new Promise((resolve, reject) => {
            this.loadTicker.stop();
            this.startTime.setSeconds(this.startTime.getSeconds() + 1);
            this.loadTicker.add((deltaTime) => {
                let time = Math.floor((this.startTime - Date.now()) / 1000);
                if (time <= 0) {
                    this.cleanup();
                    resolve(s);
                }
            });
            this.loadTicker.start();
        });
    }
    cleanup() {
        this.bubble.destroy();
        this.richText.destroy();
        this.loadTicker.destroy();
    }
    loadSound({name, soundUrl}) {
        return new Promise((resolve, reject) => {
            PIXI.sound.Sound.from({
                url: soundUrl,
                preload: true,
                loaded: function(err, sound) {
                    if(err) reject();
                    resolve({name, sound});
                }
            });
        })
    }
    getSounds() {
        return new Promise((resolve, reject) => {
            let pArr = this.soundPaths.map(this.loadSound);
            Promise.all(pArr)
            .then((d)=> {
                d.map((s) => {
                    this.sounds[s.name] = s.sound;
                });
                resolve(this.sounds);
            })
            .catch(e => {
                reject(e);
            });
        });
    }
}