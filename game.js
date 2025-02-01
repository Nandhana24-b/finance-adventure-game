// Global Variables
let currentMoney = 0;
let savedAmount = localStorage.getItem("savedAmount") ? parseInt(localStorage.getItem("savedAmount")) : 0;
let goalAmount = 50;
let gameOver = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const toySymbol = document.getElementById("toySymbol"); // Toy emoji element

// Player properties (as a simple rectangle for the runner)
let player = {
    x: 50,
    y: canvas.height - 70,
    width: 50,
    height: 70,
    speed: 3,
    jumpHeight: 50,
    velocity: 0
};

let coins = [];
let obstacles = [];

// Handle jump
document.addEventListener("keydown", function(event) {
    if (event.key === " " && !gameOver) {
        player.velocity = -player.jumpHeight;
    }
});

// Generate coins and obstacles
function generateCoins() {
    let coin = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 60),
        size: 30
    };
    coins.push(coin);
}

function generateObstacles() {
    let obstacle = {
        x: canvas.width,
        y: canvas.height - 60,
        width: 30 + Math.random() * 50,
        height: 50 + Math.random() * 30
    };
    obstacles.push(obstacle);
}

// Update game state
function updateGame() {
    if (gameOver) return;

    // Update player
    player.y += player.velocity;
    player.velocity += 3;  // Gravity effect

    if (player.y >= canvas.height - 70) {
        player.y = canvas.height - 70;
        player.velocity = 0;
    }

    // Move coins and obstacles
    coins.forEach((coin, index) => {
        coin.x -= 2;
        if (coin.x < 0) coins.splice(index, 1);
    });

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 2;
        if (obstacle.x < 0) obstacles.splice(index, 1);
    });

    // Collision detection with coins
    coins.forEach((coin, index) => {
        if (
            player.x < coin.x + coin.size &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.size &&
            player.y + player.height > coin.y
        ) {
            currentMoney += 10;
            coins.splice(index, 1);
            updateStats();
        }
    });

    // Collision detection with obstacles
    obstacles.forEach((obstacle, index) => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            endGame("Game Over! You hit an obstacle.");
        }
    });

    // Display toy symbol when score reaches 50
    if (currentMoney >= goalAmount) {
        toySymbol.style.display = "block"; // Display the toy symbol (🎁)
    }

    // Clear and update canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";  // Color for the runner (a simple rectangle)
    ctx.fillRect(player.x, player.y, player.width, player.height);  // Draw the player (rectangle)

    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();
    });

    obstacles.forEach(obstacle => {
        ctx.fillStyle = "red";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    requestAnimationFrame(updateGame);
}

// Update stats on the screen
function updateStats() {
    document.getElementById("currentMoney").textContent = `Money: ₹${currentMoney}`;
    document.getElementById("savedAmount").textContent = `Saved: ₹${savedAmount}`;
    document.getElementById("goalAmount").textContent = `Goal: ₹50 for a Toy`;

    // If the player reaches ₹50, show the toy symbol
    if (currentMoney >= 50) {
        toySymbol.style.display = "block";
    }
}

// End the game
function endGame(message) {
    gameOver = true;
    savedAmount += currentMoney;  // Add current money to saved amount
    localStorage.setItem("savedAmount", savedAmount);  // Store the updated saved amount in localStorage
    document.getElementById("endMessage").style.display = "block";
    document.getElementById("resultMessage").textContent = message;
}

// Restart the game
function restartGame() {
    currentMoney = 0;
    coins = [];
    obstacles = [];
    gameOver = false;
    toySymbol.style.display = "none"; // Hide the toy symbol on restart
    document.getElementById("endMessage").style.display = "none";
    updateStats();
    updateGame();
}

// Start the game
function startGame() {
    setInterval(generateCoins, 2000);  // Generate coins every 2 seconds
    setInterval(generateObstacles, 3000);  // Generate obstacles every 3 seconds
    updateGame();
}

startGame();
