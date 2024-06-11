const canvas = document.getElementById("ping_pong");
const context = canvas.getContext('2d');

const user1 = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: 'black'
}

const user2 = {
    x: (canvas.width - 10),
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: 'aqua'
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: 'BLACK'
}

const net = {
    x: (canvas.width - 2 - 10) / 2,
    y: 0,
    width: 2,
    height: 10,
    color: 'lightgreen'
}

canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    user1.y = event.clientY - rect.top - user1.height / 2;
})

function resizeCanvas() {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 50;

    user1.y = (canvas.height - user1.height) / 2;
    user2.x = canvas.width - user2.width;
    user2.y = (canvas.height - user2.height) / 2;
    net.x = (canvas.width - 12)/2
    resetBall();
    update();
}

canvas.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawText(text, x, y) {
    context.fillStyle = 'Red';
    context.font = '50px Arial';
    context.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawArc(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // ball.velocityX = -ball.velocityX;
    ball.speed = 5;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "white");

    //scores
    drawText(user1.score, canvas.width / 4, canvas.height / 5);
    drawText(user2.score, 3 * canvas.width / 4, canvas.height / 5);

    drawNet();

    //users
    drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return (player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top);
}

function update() {
    if (ball.x - ball.radius <= 0) {
        user2.score += 1;
        resetBall();
    }
    else if (ball.x + ball.radius >= canvas.width) {
        user1.score += 1;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    user2.y += ((ball.y - (user2.y + user2.height / 2)) * 0.1);

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;

        if (Math.abs(ball.velocityY) < 0.1) {
            ball.velocityY += (ball.velocityY > 0) ? 0.2 : -0.2;
        }
    }

    let currentInteraction = (ball.x < canvas.width / 2) ? user1 : user2;

    if (collision(ball, currentInteraction)) {
        let collisionPoint = (ball.y - (currentInteraction.y + currentInteraction.height / 2));
        collisionPoint = collisionPoint / (currentInteraction.height / 2);

        let angleRad = (Math.PI / 4) * collisionPoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

}

function main() {
    update();
    render();
}
main();

let frames = 60;
// let loop = setInterval(main, 1000 / frames);
