const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const scoreBoard = document.getElementById('score');

const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 9;
const PADDLE_MARGIN = 16;
const PLAYER_X = PADDLE_MARGIN;
const AI_X = canvas.width - PADDLE_WIDTH - PADDLE_MARGIN;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;
let paused = false;

// Mouse movement
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    playerY = Math.max(Math.min(playerY, canvas.height - PADDLE_HEIGHT), 0);
});

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#555';
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#2ecc40';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#ff4136';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
}

/* Made by Bansi Jhala
Student at GLS University, Ahmedabad, Gujarat, India
email: bansijhala@yahoo.com
instagram: https://www.instagram.com/bansijhala/
linkedin: https://www.linkedin.com/in/bansijhala/
github: https://github.com/bansi-png */

function update() {
    if (paused) return;

    ballX += ballVelX;
    ballY += ballVelY;

    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballVelY = -ballVelY;
    }

    if (
        ballX - BALL_RADIUS <= PLAYER_X + PADDLE_WIDTH &&
        ballY >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballVelX = -ballVelX;
        ballVelY = (ballY - (playerY + PADDLE_HEIGHT / 2)) * 0.15;
    }

    if (
        ballX + BALL_RADIUS >= AI_X &&
        ballY >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballVelX = -ballVelX;
        ballVelY = (ballY - (aiY + PADDLE_HEIGHT / 2)) * 0.15;
    }

    if (ballX < 0) {
        aiScore++;
        handlePointScored('Opponent');
    } else if (ballX > canvas.width) {
        playerScore++;
        handlePointScored('You');
    }

    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 10) aiY += PADDLE_SPEED;
    else if (aiCenter > ballY + 10) aiY -= PADDLE_SPEED;
    aiY = Math.max(Math.min(aiY, canvas.height - PADDLE_HEIGHT), 0);
}

function handlePointScored(scorer) {
    paused = true;
    updateScoreDisplay();
    message.textContent = `${scorer} scored!`;
    if (playerScore >= 5 || aiScore >= 5) {
        setTimeout(() => {
            message.textContent = `${scorer} wins the game! 🎉`;
        }, 500);
        return;
    }

    setTimeout(() => {
        resetBall();
        message.textContent = '';
        paused = false;
    }, 2000);
}

function updateScoreDisplay() {
    scoreBoard.textContent = `${playerScore} - ${aiScore}`;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    let dir = ballVelX > 0 ? -1 : 1;
    ballVelX = BALL_SPEED * dir;
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

function loop() {
    update();
    draw();
    if (playerScore < 5 && aiScore < 5) requestAnimationFrame(loop);
}

loop();