const yValues = [60, 143, 226];//different row values for enemy (row = 83)
const speedValues = [200, 300];//different speed Values for enemy
playerSkins = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png']
const restart = document.querySelector('.restart');
const hearts = document.querySelector('.hearts');
const time = document.querySelector('.time');
const points = document.querySelector('.points');
const score = document.querySelector('#score');
const restartButton = document.querySelector('#restartButton');
const modal = document.querySelector('.modal');
const modalMessage = document.querySelector(".modal-message");
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let timer;
let restartTimer = 0;
let collisionAlert = 0;

// Enemies our player must avoid
var Enemy = function() {
    this.x = 1;
    this.y = yValues[Math.floor(Math.random() * yValues.length)];
    this.speed = speedValues[Math.floor(Math.random() * speedValues.length)];
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    // Distance traveled by enemy equals the enemy's speed multiplied by time -dt-
    this.x += dt * this.speed;
    // When enemy reach right end of display, it disappears and reappears in a different y position from the left
    if (this.x > 520) {
      this.x = -120;
      this.y = yValues[Math.floor(Math.random() * yValues.length)];
      this.speed = speedValues[Math.floor(Math.random() * speedValues.length)];
      this.x += dt * this.speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check collision between player and enemies
Enemy.prototype.checkCollision = function() {
      if (this.x < player.x + 50 && this.x + 50 > player.x &&
          this.y < player.y + 50 && 50 + this.y > player.y) {
            // If yes, reset player to start position and take a life down
            player.x = 203;
            player.y = 400;
            points.textContent -= 10;
            collisionAlert += 1;
            lives();
        }
};

// Our player
var Player = function() {
    this.x = 203;
    this.y = 400;
    this.sprite = playerSkins[Math.floor(Math.random() * playerSkins.length)];//randomly chooses a player character everytime you refresh the page
};

// When player reach water, return to start position and add score points by 10
Player.prototype.update = function() {
  if (this.y === 1){
    this.y = 400;
    this.x = 203;
    points.textContent = (parseInt(points.textContent) + 10);//// TODO: Why did I need to implement parsInt here and not in line 46?
  }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Handle keyboard control of game by arrow keys
Player.prototype.handleInput = function(arrowUsed) {
  if (arrowUsed === 'left') {
    this.x -=40;
    if(this.x < 1) {
      this.x = 1;
    }
  }
  if (arrowUsed === 'right') {
    this.x +=40;
    if(this.x > 400) {
      this.x = 400;
    }
  }
  if (arrowUsed === 'down') {
    this.y +=83;
    if(this.y > 400) {
      this.y = 400;
    }
  }
  if (arrowUsed === 'up') {
    this.y -=83;
    if(this.y < 1) {
      this.y = 1;
    }
  }
  // Serves only one timer function for every game
  if (restartTimer === 0){
      startTime();
      restartTimer = 1;
    }
};

// Instantiate objects.
const enemy1 = new Enemy();
const enemy2 = new Enemy();
const enemy3 = new Enemy();
let allEnemies = [enemy1, enemy2, enemy3];
let player = new Player();

// This listens for key presses, modified keyup to keydown to add a sliding effect
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Prevent page scrolling while using keyboard control keys in the game
window.addEventListener("keydown", function(e) {
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// Start stop watch -minutes and seconds-
function startTime() {
 	timer = setInterval(function() {
 		seconds.innerText++;
 		if(seconds.innerText == 60) {
 			minutes.innerText++;
 			seconds.innerText = 0;
 		}
 	}, (1000));
 	return timer;
 }

// Freeze stop watch
 function stopTime() {
 	clearInterval(timer);
 }

// Lives decrease by 1 when collision with enemy happens till game is over
function lives(){
  if (collisionAlert === 1){
     document.querySelector('.hearts li:nth-child(3)').classList.add('loseLife');
  }
  else if (collisionAlert === 2){
     document.querySelector('.hearts li:nth-child(2)').classList.add('loseLife');
  }
  else if (collisionAlert === 3){
     document.querySelector('.hearts li:nth-child(1)').classList.add('loseLife');
     gameOver();
  }
};

// Reset the lives to full state again
function resetLives(){
  document.querySelector('.hearts li:nth-child(2)').classList.remove('loseLife');
  document.querySelector('.hearts li:nth-child(1)').classList.remove('loseLife');
  document.querySelector('.hearts li:nth-child(3)').classList.remove('loseLife');
};

// Display modal game over message when all lives are lost
function gameOver(){
  stopTime();
  modal.style.display = 'block';
  score.innerText = points.textContent;
};

// Game interface restart game button
restart.addEventListener("click", function(){
  modal.style.display = 'none';
  points.textContent = 0;
  minutes.innerText = 0;
  seconds.innerText = 0;
  resetLives();
  stopTime();
  restartTimer = 0;
  collisionAlert = 0;
});

// Modal message restart game button
restartButton.addEventListener("click", function(){
  modal.style.display = 'none';
  points.textContent = 0;
  minutes.innerText = 0;
  seconds.innerText = 0;
  resetLives();
  stopTime();
  restartTimer = 0;
  collisionAlert = 0;
});
