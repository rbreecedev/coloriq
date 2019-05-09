import * as PIXI from 'pixi.js';
import SceneTransition from './scenes/SceneTransition';
import Load from './scenes/Load';
import Play from './scenes/Play';
import './styles/global.css'

document.onreadystatechange = async () => {
    if (document.readyState == "interactive") {
        let gameContainer = window.document.getElementById('game_container');
        var config = {
            width: gameContainer.clientWidth,
            height: gameContainer.clientHeight,
            progressLevel: 10,
            levelQtyStart: 3
        };

        const app = new PIXI.Application(config);
        gameContainer.appendChild(app.view);
        let player = {
            name: 'test',
            score: 1,
            level: 1,
            levelProgession: 1,
            correctInARow: 0
        };

        let loaded = new Load({app, config});
        let sounds = await loaded.init();
        sounds.song1.play();
        let sceneTransition = new SceneTransition();
        await sceneTransition.init();
        let play = new Play({config, player, app, sounds});
        await play.init();
        await sceneTransition.init();
        
    }
};


// window.addEventListener('resize', (e) => {
//     this.config.width = gameContainer.clientWidth;
//     this.config.height = gameContainer.clientHeight;
//     this.app.renderer.resize(this.config.width, this.config.height);
//     playArea.clearPlayArea();
//     playArea = new PlayArea({
//         this.app, 
//         gridsize: 3,
//         screenWidth: this.config.width,
//         screenHeight: this.config.height
//     });
// });

// window.addEventListener('resize', (e) => {
//     this.stageSprite.setTransform(this.config.width /2, this.config.height /2, .5, .5)
// });