// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const statusWrapper = document.querySelector('.status-wrapper')
const statusText = document.querySelector('.status-content')
//Define game variables
const gridsize= 20;
let snake = [{ x: 10, y: 10 }];
let highScore = 0;
let direction = 'right';
let gameSpeed = 250;
let gameSpeedDelay = 200;
let food = generateFood();
let gameStarted = false;
let isPaused = true;
let gameInterval;

//Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    getScore();
}

//draw snake
function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
   })
}
function createGameElement(tag, className) {
    let newElement = document.createElement(tag);
    newElement.className = className;
    return newElement;
}
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
// draw food funtion 
function drawFood() {
    if (isPaused) return
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement)
}

//generate food
function generateFood() {
    const xAxis = Math.floor(Math.random() * gridsize + 1);
    const yAxis = Math.floor(Math.random() * gridsize  + 1);
    return {x: xAxis, y: yAxis};
}

// moving the  snake
function move() {
    // add new blocks
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--
            break;
        case 'down':
            head.y++
            break;
        case 'right':
            head.x++
            break;
        case 'left':
            head.x--
            break;
    }
    snake.unshift(head);
    if (food.x === head.x && food.y === head.y) {
        food = generateFood()
        drawFood();
        
    } else {
        snake.pop()
    }
}


// start the game
function start() {
    startGame = true;
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();   
    }, gameSpeed)   
}
    
//adding key controls
// game control keys
function handleKeyPress(event) {
    if (
      (!gameStarted && event.code === 'Space') ||
      (!gameStarted && event.key === ' ')
    ) {
        // startGame();
        isPaused = !isPaused;

        if (isPaused) {
            gameStarted = false;
            statusWrapper.style.display = 'flex'
            // board.style.display="none"
            clearInterval(gameInterval)
        } else {
            // gameStarted = true;
            board.style.display="grid"
            statusWrapper.style.display = 'none';
            start()
        }
    } else {
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
      }
    }
  }

//   linsten to Keypress event listener
  document.addEventListener('keydown', handleKeyPress);
//score card
function getScore() {
    let curScore = snake.length - 1;
    score.innerHTML = curScore.toString().padStart(3, '0');
    if (highScore < curScore) {
        highScore = curScore;
        highScoreText.innerHTML = highScore.toString().padStart(3, '0');
    }
}

function checkCollision(){
    const head = snake[0];
    if (head.x < 1 || head.x > gridsize || head.y < 1 || head.y > gridsize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
}
function resetGame() {
    isPaused = true;
    clearInterval(gameInterval);
    highScore = 0;
    instructionText.style.display = "block";
    logo.style.display = "block";
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeed = 250;
    gameStarted = false;
    isPaused = true;
    board.innerHTML = ''; 
}
// function stopGame() {
//     resetGame()
//     clearInterval(gameInterval);
// }