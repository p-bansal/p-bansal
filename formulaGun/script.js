//resizing title image
//TODO remake barriers to make sense
//TODO menus
const height = document.getElementById("homeLink").clientHeight;
document.getElementById("title").style.height = height * 1.5 + 'px';
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
//hiscore stuff
localStorage.clear();
const initialScoreLoad = localStorage.getItem('highScore');
const initialScore = initialScoreLoad ?? 0;
localStorage.setItem('highScore', initialScore);
//
checkUnlocks();



var x = 0; var y = 0;
var speed = 0;
// var rotation = -Math.PI / 2; //radians
// const distanceToCenter = Math.sqrt((37 * 37) + (27 * 27)), angleToCenter = Math.atan(37 / 27);
var score = 0, lives = 100; // if lives >= 100, game has not started yet, 
//start with 10 lives
let lapCompleted = true, gameComplete = true, checkpointReached = false;
let collision = false;
var background = new Image();
var car = new Image();
var turret = new Image();
var bullet = new Image();
var keysHeld = [false, false, false, false];
var fullscreen = false;
var screenShake = false;
var shakeLog = [0, 0];
var turrets = [];
var bullets = [];

background.src = "images/finalTrack.png";
background.onload = function() {
  context.drawImage(background, 0, 0);
}
car.src = "images/starterCar.png"; // 74 * 54
car.onload = function() {
  //context.drawImage(car, x, y);
}
turret.src = "images/turret.png";
bullet.src = "images/bullet.png";

resize();

window.addEventListener('resize', resize);
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup)
canvas.addEventListener('mousedown', mousedown);

function spawnTurret(x, y, int) {
  turrets.push({
    x: x,
    y: y,
    draw: () => { drawTurret(x, y) },
    shoot: () => { shootTurret(x, y) },
    interval: setInterval(() => { shootTurret(x, y) }, int)
  });
}

function drawTurret(tempx, tempy) {
  let xDist = (x - tempx);
  let yDist = (y - tempy);
  let deg = Math.atan2(yDist, xDist);

  context.save();
  context.translate(tempx, tempy);
  context.rotate(deg);
  context.drawImage(turret, -(turret.width / 2), - (turret.height / 2));
  context.restore();
}

function shootTurret(tempx, tempy) {
  bullets.push({
    x: tempx,
    y: tempy,
    speed: (Math.random() * 5 + 2) * (1 + score / 20),
    destination: [x - tempx, y - tempy],
  })
}

spawnTurret(250, 400, 5000);
spawnTurret(735, 325, 5250);
spawnTurret(480, 625, 5500);

function mousedown(event) {
  //   console.log(event.offsetX + ", " + event.offsetY);
  //   console.log("lol:" + x + " " + y);
}

setInterval(draw, 16.66666);

function draw() {
  // main looping function
  if(lives > 0 && lives < 100){
    game();
  } else if (lives <= 0){
    end();
  }

  //console.log(car.width + " " + car.height);
}


function keydown(event) {
  event.preventDefault();
  if (event.key == "ArrowUp" || event.key === 'w') {
    keysHeld[0] = true;
  }
  if (event.key == "ArrowDown" || event.key === 's') {
    keysHeld[1] = true;
  }
  if (event.key == "ArrowLeft" || event.key === 'a') {
    keysHeld[2] = true;
  }
  if (event.key == "ArrowRight" || event.key === 'd') {
    keysHeld[3] = true;
  }
  if (event.key == "Escape") {
    toggleFullscreen();
  }
  //  if(event.key == "ArrowUp"){
  // if(ySpeed > -2.5){
  //   ySpeed --;
  // }
  //  } else if (event.key == "ArrowDown"){
  // if(ySpeed < 2.5){
  //   ySpeed ++;
  // }
  //  } else if (event.key == "ArrowLeft"){
  // if(xSpeed > -2.5){
  //   xSpeed --
  // }
  //  } else if (event.key == "ArrowRight"){
  // if(xSpeed < 2.5){
  //   xSpeed ++
  // }
  //  } else if (event.code == "Space"){
  // if(xSpeed != 0){
  //   xSpeed -= xSpeed/2;
  // }
  // if(ySpeed != 0){
  //   ySpeed -= ySpeed/2;
  // }
  //  }
}

function keyup(event) {
  event.preventDefault();
  if (event.key == "ArrowUp" || event.key === 'w') {
    keysHeld[0] = false;
  }
  if (event.key == "ArrowDown" || event.key === 's') {
    keysHeld[1] = false;
  }
  if (event.key == "ArrowLeft" || event.key === 'a') {
    keysHeld[2] = false;
  }
  if (event.key == "ArrowRight" || event.key === 'd') {
    keysHeld[3] = false;
  }
}

function move() {
  var rotateMultiplier = speed / 2.5;
  if (rotateMultiplier > 1) {
    rotateMultiplier = 1;
  }
  if (keysHeld[0]) {
    speed += 0.25;
  }
  if (keysHeld[1]) {
    speed -= 0.25;
    rotateMultipier = 1;
  }
  //if(speed > 0.1){
  if (keysHeld[2]) {
    rotation -= Math.PI / 72 * rotateMultiplier;
  }
  if (keysHeld[3]) {
    rotation += Math.PI / 72 * rotateMultiplier;
  }
  //}
}

function resize() {
  // resizes canvas along 4x3 aspect ratio when page is resized
  let width;
  let height;

  if (fullscreen) {
    if (document.getElementById("gameArea") != null) {
      document.getElementById("gameArea").id = "fullscreenGame";
      document.body.style.overflow = "hidden";
    }

    if (window.innerHeight * 1.3 <= window.innerWidth) {
      height = window.innerHeight;
      width = window.innerHeight * 1.3;
    } else {
      width = window.innerWidth;
      height = window.innerWidth / 1.3;
    }
  } else {
    if (document.getElementById("fullscreenGame") != null) {
      document.getElementById("fullscreenGame").id = "gameArea";
      document.body.style.overflow = "auto";
    }

    let sizeIncrease = 1.5;
    width = window.innerWidth / (3 / sizeIncrease);
    height = window.innerWidth / (4 / sizeIncrease);
  }

  canvas.height = height;
  canvas.width = width;


  let menu = document.getElementsByClassName('menu');
  for (let i = 0; i < menu.length; i++) {
    menu[i].style.width = width + "px";
    menu[i].style.height = height + "px";
  }
  let optionDivs = document.getElementsByClassName('customOption');
  let optionDivWidth = width / 5;
  for (let i = 0; i < optionDivs.length; i++) {
    optionDivs[i].style.width = optionDivWidth + "px";
  }
  // document.getElementsByClassName("startMenuContent")[0].style.transform = "scale(" + (canvas.width / 900) + "," + (canvas.height / 675) + ")";

  context.scale(canvas.width / 900, canvas.height / 675); // cuz OG size is 900 x 675
  draw();




}

function toggleFullscreen() {
  fullscreen = !fullscreen
  resize();
}

function drawCar() {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  // context.fillStyle = 'green';
  // context.fillRect(-37, -27, 2, 2);
  //use to check origin point for car image
  for (let i = 0; i < bullets.length; i++) {
    let tempX = bullets[i].x;
    let tempY = bullets[i].y;

    if (tempX - bullet.width >= x - car.width / 2 && tempX + bullet.width <= x + car.width / 2) {
      if (tempY + bullet.height >= y - car.height / 2 && tempY - bullet.height <= y + car.height / 2) {
        explodeCar();
        shakeScreen(1000);
        bullets.splice(i, 1);
        lives--;
      }
    }
  }


  context.drawImage(car, -37, -27);
  context.restore();
}

function explodeCar() {
  let plo = document.createElement("img");
  plo.src = "images/explosion.gif?" + Math.random();
  plo.classList = "explosion";
  plo.width = (75 * (canvas.width / 900));

  let realX = x * (canvas.width / 900); // account for canvas scaling
  let realY = y * (canvas.height / 675);

  let area;
  if (fullscreen) area = document.getElementById("game");
  else area = document.getElementById("gameArea");

  plo.style.top = (area.offsetTop + realY - (plo.width / 2)) + "px";
  plo.style.left = (area.offsetLeft + realX - (plo.width / 2)) + "px";

  document.body.appendChild(plo);

  setTimeout(() => {
    plo.remove();
  }, 1200);
}

function shakeScreen(length) {
  if (screenShake) return;
  screenShake = true;
  setTimeout(() => {
    screenShake = false;
    context.translate(-shakeLog[0], -shakeLog[1]);
    shakeLog = [0, 0];
  }, length);
}

function drawBullet(bulletX, bulletY, bulletRotation) {
  context.save();
  context.translate(bulletX, bulletY);
  context.rotate(bulletRotation);
  context.drawImage(bullet, -10, -10);
  context.restore();
}





function game() {
  //  if(x+xSpeed < 861 && x+xSpeed > 1){
  // x += xSpeed;
  //  } else {
  // xSpeed = 0;
  //  }
  //  if(y+ySpeed < 646 && y+ySpeed > 1){
  // y += ySpeed;
  //  } else {
  // ySpeed = 0;
  //  }

  if (screenShake) {
    let shakeX = Math.floor(Math.random() * 5);
    let shakeY = Math.floor(Math.random() * 5);

    if (shakeLog[0] > 6) {
      shakeX = -shakeX;
    } else if (shakeLog[0] > -6) {
      if (Math.floor(Math.random() * 2) == 1) {
        shakeX = -shakeX;
      }
    }

    if (shakeLog[1] > 6) {
      shakeY = -shakeY;
    } else if (shakeLog[1] > -6) {
      if (Math.floor(Math.random() * 2) == 1) {
        shakeY = -shakeY;
      }
    }

    shakeLog = [shakeLog[0] + shakeX, shakeLog[1] + shakeY];
    context.translate(shakeX, shakeY);
  }


  move();

  rotation = rotation % (2 * Math.PI);
  speed -= speed / 20; //drag
  if (speed <= -1.5) {
    speed = -1.5;
  }
  var ySpeed = Math.sin(rotation) * speed;
  var xSpeed = Math.cos(rotation) * speed;

  x += xSpeed;
  y += ySpeed;







  context.fillStyle = "#ff1493";
  context.drawImage(background, 0, 0);
  // context.fillStyle = "black";
  // context.fillRect(x, y, 40, 30);
  drawCar();
  // context.fillStyle = 'blue';
  // context.fillRect(785, 145, 20, 310);
  // context.fillRect(765, 145, 20, 110);
  // context.fillRect(505, 255, 270, 20);
  // context.fillRect(690, 455, 100, 20);
  // context.fillStyle = 'white';
  // context.fillRect(675, 335, 20, 120);
  // context.fillRect(575, 595, 320, 20);
  // context.fillRect(450, 315, 245, 20);
  // context.fillStyle = 'red';
  // context.fillRect(475, 460, 80, 20);
  // context.fillRect(555, 465, 20, 150);
  // context.fillRect(895, 5, 20, 590);
  // context.fillStyle = 'orange';
  // context.fillRect(445, 140, 190, 20);
  // context.fillRect(665, 5, 20, 100);
  // context.fillRect(665, -15, 235, 20);
  // //diagonal & boxes
  // context.fillStyle = 'purple';
  // context.fillRect(495, 260, 15, 15);
  // context.fillRect(485, 270, 15, 15);
  // context.fillRect(475, 280, 15, 15);
  // context.fillRect(465, 290, 15, 15);
  // context.fillRect(455, 300, 15, 15);
  // context.fillRect(445, 310, 15, 15);
  // context.fillRect(435, 320, 15, 15);
  // context.fillRect(425, 330, 15, 15);
  // context.fillRect(415, 340, 15, 15);
  // context.fillRect(405, 350, 15, 15);
  // context.fillRect(395, 360, 15, 15);
  // context.fillRect(385, 370, 15, 15);
  // context.fillRect(375, 380, 15, 15);
  // context.fillRect(365, 390, 15, 15);
  // context.fillRect(355, 400, 15, 15);
  // context.fillRect(345, 410, 15, 15);
  // context.fillRect(335, 420, 15, 15);
  // context.fillRect(325, 430, 15, 15);
  // context.fillRect(315, 440, 15, 15);
  // context.fillRect(305, 450, 15, 15);
  // context.fillRect(295, 460, 15, 15);
  // context.fillRect(285, 470, 15, 15);
  //   context.fillStyle = 'black';
  // context.fillRect(220, 300, 15, 15);
  // context.fillRect(230, 310, 15, 15);
  // context.fillRect(240, 320, 15, 15);
  // context.fillRect(250, 330, 15, 15);
  // context.fillRect(260, 340, 15, 15);
  // context.fillRect(270, 350, 15, 15);
  // context.fillRect(280, 360, 15, 15);
  // context.fillRect(290, 370, 15, 15);
  // context.fillRect(300, 380, 15, 15);
  // context.fillRect(210, 310, 15, 15);
  // context.fillRect(200, 320, 15, 15);
  // context.fillRect(190, 330, 15, 15);
  // context.fillRect(180, 340, 15, 15);
  // context.fillRect(170, 350, 15, 15);
  // context.fillStyle = 'green';
  // context.fillRect(160, 360, 15, 30);
  // context.fillRect(170, 385, 15, 15);
  // context.fillRect(180, 395, 15, 15);
  // context.fillRect(190, 405, 15, 15);
  // context.fillRect(200, 415, 15, 15);
  // context.fillRect(210, 425, 15, 15);
  // context.fillRect(220, 435, 15, 15);
  // context.fillStyle = 'red';
  // context.fillRect(230, 445, 15, 15);
  // context.fillRect(240, 455, 15, 15);
  // context.fillRect(250, 465, 15, 15);
  // context.fillRect(260, 475, 30, 15);
  // context.fillRect(200, 135, 65, 15);
  // context.fillRect(250, 145, 15, 15);
  // context.fillRect(260, 155, 15, 15);
  // context.fillRect(270, 165, 15, 15);
  // context.fillRect(280, 175, 15, 15);
  // context.fillRect(290, 185, 15, 15);
  // context.fillRect(300, 195, 15, 15);
  // context.fillRect(310, 205, 15, 15);
  // context.fillRect(320, 215, 15, 15);
  // context.fillRect(330, 225, 15, 15);
  // context.fillRect(340, 235, 15, 15);
  // context.fillRect(350, 230, 15, 15);
  // context.fillRect(360, 220, 15, 15);
  // context.fillRect(370, 210, 15, 15);
  // context.fillRect(380, 200, 15, 15);
  // context.fillRect(390, 190, 15, 15);
  // context.fillRect(400, 180, 15, 15);
  // context.fillStyle = 'pink';
  // context.fillRect(410, 170, 15, 15);
  // context.fillRect(420, 160, 15, 15);
  // context.fillRect(430, 150, 15, 15);
  // context.fillRect(-5, 335, 20, 80);
  // context.fillRect(230, 625, 85, 20);
  // context.fillRect(310, 385, 55, 20);
  // context.fillRect(190, 145, 15, 15);
  // context.fillRect(180, 155, 15, 15);
  // context.fillRect(170, 165, 15, 15);
  // context.fillRect(160, 175, 15, 15);
  // context.fillRect(150, 185, 15, 15);
  // context.fillRect(140, 195, 15, 15);
  // context.fillRect(130, 205, 15, 15);
  // context.fillRect(120, 215, 15, 15);
  // context.fillRect(110, 225, 15, 15);
  // context.fillRect(100, 235, 15, 15);
  // context.fillStyle = 'yellow';
  // context.fillRect(90, 245, 15, 15);
  // context.fillRect(80, 255, 15, 15);
  // context.fillRect(70, 265, 15, 15);
  // context.fillRect(60, 275, 15, 15);
  // context.fillRect(50, 285, 15, 15);
  // context.fillRect(40, 295, 15, 15);
  // context.fillRect(30, 305, 15, 15);
  // context.fillRect(20, 315, 15, 15);
  // context.fillRect(10, 325, 15, 15);
  // context.fillRect(10, 410, 15, 15);
  // context.fillRect(20, 420, 15, 15);
  // context.fillRect(30, 430, 15, 15);
  // context.fillRect(40, 440, 15, 15);
  // context.fillRect(50, 450, 15, 15);
  // context.fillRect(60, 460, 15, 15);
  // context.fillRect(70, 470, 15, 15);
  // context.fillRect(80, 480, 15, 15);
  // context.fillRect(90, 490, 15, 15);
  // context.fillRect(100, 500, 15, 15);
  // context.fillRect(110, 510, 15, 15);
  // context.fillRect(120, 520, 15, 15);
  // context.fillRect(130, 530, 15, 15);
  // context.fillRect(140, 540, 15, 15);
  // context.fillStyle = 'grey';
  // context.fillRect(150, 550, 15, 15);
  // context.fillRect(160, 560, 15, 15);
  // context.fillRect(170, 570, 15, 15);
  // context.fillRect(180, 580, 15, 15);
  // context.fillRect(190, 590, 15, 15);
  // context.fillRect(200, 600, 15, 15);
  // context.fillRect(210, 610, 15, 15);
  // context.fillRect(220, 620, 15, 15);
  // context.fillRect(310, 620, 15, 15);
  // context.fillRect(320, 610, 15, 15);
  // context.fillRect(330, 600, 15, 15);
  // context.fillRect(340, 590, 15, 15);
  // context.fillRect(350, 580, 15, 15);
  // context.fillRect(360, 570, 15, 15);
  // context.fillRect(370, 560, 15, 15);
  // context.fillRect(380, 550, 15, 15);
  // context.fillRect(390, 540, 15, 15);
  // context.fillRect(400, 530, 15, 15);
  // context.fillRect(410, 520, 15, 15);
  // context.fillRect(420, 510, 15, 15);
  // context.fillRect(430, 500, 15, 15);
  // context.fillRect(440, 490, 15, 15);
  // context.fillRect(450, 480, 15, 15);
  // context.fillRect(460, 470, 15, 15);
  // context.fillRect(665, 105, 15, 15);
  // context.fillRect(660, 115, 15, 15);
  // context.fillRect(655, 125, 15, 15);
  // context.fillRect(645, 135, 15, 15);
  // context.fillRect(635, 140, 15, 15);
  // context.fillRect(770, 135, 30, 20);

  checkCollision();





  //healthBar(temp)\
  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.fillRect(150, 30, 100, 10);
  context.fillStyle = 'red';
  context.fillRect(150, 30, lives * 10, 10);




  for (let i = 0; i < bullets.length; i++) {
    var bulletRotation = Math.atan2(bullets[i].destination[1], bullets[i].destination[0]);
    let temp = bullets[i];
    bullets[i].x += bullets[i].speed * Math.cos(bulletRotation);
    bullets[i].y += bullets[i].speed * Math.sin(bulletRotation);

    drawBullet(bullets[i].x, bullets[i].y, bulletRotation);
    if (bullets[i].x > 900 || bullets[i].y > 675 || bullets[i].x < 0 || bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  for (let i = 0; i < turrets.length; i++) {
    turrets[i].draw();
  }

  context.strokeStyle = 'white';
  context.font = '30px Arial';
  context.strokeText("Laps: " + score, 30, 30);

  checkLap();
}

function checkCollision() {
  let collision = false;
  for (let i = 0; i < barriers.length; i++) {
    var ySpeed = Math.sin(rotation) * speed;
    var xSpeed = Math.cos(rotation) * speed;
    let barrier = barriers[i];
    if (x > barrier[0] && x < barrier[2] && y > barrier[1] && y < barrier[3] && !collision){
      x -= 2*xSpeed;
      y -= 2*ySpeed;
      speed = -speed/2;
      keysHeld = [false, false, false, false];
      collision = true;
    } else {
      collision = false;
    }
  }
}
function checkLap() {
  if(x<200){
    checkpointReached = true;
  }
  if (x > 805 && x < 900 && y > 347 && y < 367 && !lapCompleted && (Math.sin(rotation) * speed) < 0 && checkpointReached) {
    score++;
    lapCompleted = true;
    checkpointReached = false;
  }
  if (y < 310 && lapCompleted) {
    lapCompleted = false;
   }

  // context.fillStyle = 'rgba(0, 255, 0, .5)';
  // context.fillRect(805, 310, 95, 26);
}




function end() {
  document.getElementById('end').style.display = 'flex';
  document.getElementById('scoreLine').innerHTML = score;
  if(Math.floor(score/5) > Math.floor(localStorage.getItem('highScore')/5)){
    document.getElementById('unlock').innerHTML = "New Car Unlocked!";
  }
  if (score > localStorage.getItem('highScore')) {
    localStorage.setItem("highScore", score);
    document.getElementById('newHiScore').innerHTML = "New High Score!";
  }
  checkUnlocks();
  document.getElementById('hiscore').innerHTML = localStorage.getItem('highScore');
}

function checkUnlocks(){
  let count = Math.floor(localStorage.getItem('highScore')/5) + 1;
  let unlocks = document.getElementsByClassName("customOption");
  for(let i = 0; (i<count && i<unlocks.length); i++){
    unlocks[i].style.display = 'flex'; 
  }
}

function customizationbtn() {
  let divs = document.getElementsByClassName('customOption');
  let widthToSet = document.getElementById('customization').width / 10;
  for (let i = 0; i < divs.length; i++) {
    divs[i].style.width = widthToSet + 'px';
  }
  document.getElementById('customization').style.display = 'flex';
}


function backbtn() {
  document.getElementById('customization').style.display = 'none';
}

function start() {
  score = 0;
  speed = 0;
  bullets.length = 0;
  lives = 10;
  x = 851;
  y = 400;
  let menus = document.getElementsByClassName("menu");
  document.getElementById('unlock').innerHTML = "";
  for (let i = 0; i < menus.length; i++) {
    menus[i].style.display = "none";
  }
  rotation = -Math.PI / 2;
  lapCompleted = true;
  gameComplete = true;
  collision = false;
}

function selectCar(name) {
  if (name === 1) {
    car.src = 'images/starterCar.png';
  } else if (name === 2) {
    car.src = "images/jordanCar.png"
  } else if (name === 3) {
    car.src = 'images/helloKittyCar.png';
  } else if (name === 4) {
    car.src = 'images/carLarge.png';
  }

  document.getElementById('customization').style.display = 'none';
}



var barriers = [
  [785, 145, 805, 455],
  [765, 145, 785, 255],
  [505, 255, 775, 275],
  [690, 455, 790, 475],
  [675, 335, 695, 455],
  [575, 595, 915, 615],
  [450, 315, 695, 335],
  [475, 460, 555, 480],
  [555, 465, 575, 615],
  [895, 5, 915, 595],
  [445, 140, 635, 160],
  [665, 5, 685, 105],
  [556, -15, 900, 5],
  [495, 260, 510, 275],
  [485, 270, 500, 285],
  [475, 280, 490, 295],
  [465, 290, 480, 305],
  [455, 300, 470, 315],
  [445, 310, 460, 325],
  [435, 320, 450, 335],
  [425, 330, 440, 345],
  [415, 340, 430, 355],
  [405, 350, 420, 365],
  [395, 360, 410, 375],
  [385, 370, 400, 385],
  [375, 380, 390, 395],
  [365, 390, 380, 405],
  [355, 400, 370, 415],
  [345, 410, 360, 425],
  [335, 420, 350, 435],
  [325, 430, 340, 445],
  [315, 440, 330, 455],
  [305, 450, 320, 465],
  [295, 460, 310, 475],
  [285, 470, 300, 485],
  [220, 300, 235, 315],
  [230, 310, 245, 325],
  [240, 320, 255, 335],
  [250, 330, 265, 345],
  [260, 340, 275, 355],
  [270, 350, 285, 365],
  [280, 360, 295, 375],
  [290, 370, 305, 385],
  [300, 380, 315, 395],
  [210, 310, 225, 325],
  [200, 320, 215, 335],
  [190, 330, 205, 345],
  [180, 340, 195, 355],
  [170, 350, 185, 365],
  [160, 360, 175, 390],
  [170, 385, 185, 400],
  [180, 395, 195, 410],
  [190, 405, 205, 420],
  [200, 415, 215, 430],
  [210, 425, 225, 440],
  [220, 435, 235, 450],
  [230, 445, 245, 460],
  [240, 455, 255, 470],
  [250, 465, 265, 480],
  [260, 475, 290, 490],
  [200, 135, 265, 150],
  [250, 145, 265, 160],
  [260, 155, 275, 170],
  [270, 165, 285, 180],
  [280, 175, 295, 190],
  [290, 185, 305, 200],
  [300, 195, 315, 210],
  [310, 205, 325, 220],
  [320, 215, 335, 230],
  [330, 225, 345, 240],
  [340, 235, 355, 250],
  [350, 230, 365, 245],
  [360, 220, 375, 235],
  [370, 210, 385, 225],
  [380, 200, 395, 215],
  [390, 190, 405, 205],
  [400, 180, 415, 195],
  [410, 170, 425, 185],
  [420, 160, 435, 175],
  [430, 150, 445, 165],
  [-5, 335, 15, 415],
  [230, 625, 315, 645],
  [310, 385, 365, 405],
  [190, 145, 205, 160],
  [180, 155, 195, 170],
  [170, 165, 185, 180],
  [160, 175, 175, 190],
  [150, 185, 165, 200],
  [140, 195, 155, 210],
  [130, 205, 145, 220],
  [120, 215, 135, 230],
  [110, 225, 125, 240],
  [100, 235, 115, 250],
  [90, 245, 105, 260],
  [80, 255, 95, 270],
  [70, 265, 85, 280],
  [60, 275, 75, 290],
  [50, 285, 65, 300],
  [40, 295, 55, 310],
  [30, 305, 45, 320],
  [20, 315, 35, 330],
  [10, 325, 25, 340],
  [10, 410, 25, 435],
  [20, 420, 35, 445],
  [30, 430, 45, 455],
  [40, 440, 55, 455],
  [50, 450, 65, 465],
  [60, 460, 75, 475],
  [70, 470, 85, 485],
  [80, 480, 95, 495],
  [90, 490, 105, 505],
  [100, 500, 115, 515],
  [110, 510, 125, 525],
  [120, 520, 135, 535],
  [130, 530, 145, 545],
  [140, 540, 155, 555],
  [150, 550, 165, 565],
  [160, 560, 175, 575],
  [170, 570, 185, 585],
  [180, 580, 195, 595],
  [190, 590, 205, 605],
  [200, 600, 215, 615],
  [210, 610, 225, 625],
  [220, 620, 235, 635],
  [310, 620, 325, 635],
  [320, 610, 335, 625],
  [330, 600, 345, 615],
  [340, 590, 355, 605],
  [350, 580, 365, 595],
  [360, 570, 375, 585],
  [370, 560, 385, 575],
  [380, 550, 395, 565],
  [390, 540, 405, 555],
  [400, 530, 415, 545],
  [410, 520, 425, 535],
  [420, 510, 435, 525],
  [430, 500, 445, 515],
  [440, 490, 455, 505],
  [450, 480, 465, 495],
  [460, 470, 475, 485],
  [665, 105, 680, 120],
  [660, 115, 675, 130],
  [655, 125, 670, 140],
  [645, 135, 660, 150],
  [635, 140, 650, 155],
  [770, 135, 800, 155]
];
