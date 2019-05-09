export default class ScoreBoard {
    constructor() {
        this.header = document.createElement("div");
        this.header.style.display = 'flex';
        this.header.style.justifyContent = 'center';
        this.header.className = 'header';
        this.header.style.paddingLeft = '10px';
        this.header.style.paddingRight = '10px';
        this.header.style.height = '5vh';
        this.header.style.background = 'black';
        this.scoreBoard = document.createElement("div");
        this.scoreBoard.style.width = '100%';
        this.scoreBoard.style.marginBottom = '-20px';
        this.scoreBoard.style.marginTop = '10px';
        this.scoreBoard.style.zIndex = '990';
        this.scoreBoard.style.display = 'flex';
        this.scoreBoard.style.justifyContent = 'space-between';
        this.scoreBoard.style.background = 'black';
        this.scoreBoard.style.borderRadius = '7px';
        this.scoreBoard.className = 'scoreBoard';
        this.scoreText = document.createElement('h1');
        this.scoreText.style.color = 'white';
        this.scoreText.style.marginTop = '5px';
        this.scoreText.style.fontFamily = 'Arial';
        this.scoreText.style.marginRight = '9vw';
        this.scoreText.style.zIndex = '999';
        this.scoreText.textContent = '0';
        this.levelText = document.createElement('h1');
        this.levelText.style.color = 'white';
        this.levelText.style.marginTop = '5px';
        this.levelText.style.marginLeft = '9vw';
        this.levelText.style.fontFamily = 'Arial';
        this.levelText.style.zIndex = '999';
        this.levelText.textContent = '1';
        this.counterText = document.createElement('h1');
        this.counterText.style.color = 'white';
        this.counterText.style.marginTop = '5px';
        this.counterText.style.marginLeft = '9vw';
        this.counterText.style.zIndex = '999';
        this.counterText.style.fontFamily = 'Arial';
        this.counterText.textContent = '30';
        //3 special slots
        this.specialSlotOne = document.createElement("div");
        this.specialSlotOne.style.display = 'inline-flex';
        //shotgun special
        this.shotGunIcon = document.createElement('img');
        this.shotGunIcon.src = require('../assets/shotgunIcon.png');
        this.shotGunIcon.className = 'rotate';
        this.shotGunIcon.style.width = '40px';
        this.shotGunIcon.style.height = '40px';
        this.shotGunIcon.style.marginTop= '3px';
        this.shotGunIcon.style.display = 'none';
        //special slot qty
        this.specialSlot1QTY = document.createElement('p');
        this.specialSlot1QTY.style.color = 'white';
        this.specialSlot1QTY.style.fontFamily = 'Arial';
        this.specialSlot1QTY.textContent = '';
        this.specialSlot1QTY.style.marginTop= '2px';
        this.specialSlot1QTY.style.marginRight= '3px';

        document.body.prepend(this.header);
        this.header.appendChild(this.scoreBoard);
        // this.scoreBoard.appendChild(this.levelText);
        this.scoreBoard.appendChild(this.counterText);
        this.scoreBoard.appendChild(this.specialSlotOne);
        this.specialSlotOne.appendChild(this.specialSlot1QTY);
        this.specialSlotOne.appendChild(this.shotGunIcon);
        this.scoreBoard.appendChild(this.scoreText);

        this.setColor = this.setColor.bind(this);
    }
    setColor(color) {
        this.header.style.background = '#'+color.substr(2,color.length);
    }
}