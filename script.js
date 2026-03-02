const playerShip = document.getElementById("player_ship");
const enemyShip = document.getElementById("enemy_ship");
const gameContainer = document.getElementById("game");
const playerHpShow = document.getElementById("player_hp");
const enemyHpShow = document.getElementById("enemy_hp");
const bullet = document.getElementById("bullet");

let pY = 200;
let eY = 200;
let pSpeed = 2;
let eSpeed = 2.5;
let playerHp = 3;
let enemyHp = 3;

let isPlayerTurn = true;
let bulletActive = false;
let gameOver = false;

function moveShips() {
    if (gameOver) return;

    pY += pSpeed;
    eY += eSpeed;

    if (pY <= 0 || pY >= 420) {
        pSpeed *= -1;
    }
    if (eY <= 0 || eY >= 420) {
        eSpeed *= -1;
    }

    playerShip.style.top = pY + "px";
    enemyShip.style.top = eY + "px";

    requestAnimationFrame(moveShips);
}

moveShips();

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && isPlayerTurn && !bulletActive && !gameOver) {
        shoot("player");
    }
});

function shoot(shooter) {
    bulletActive = true;
    bullet.style.display = "block";

    let bx;
    let by;
    let angle;

    if (shooter === "player") {
        bx = 110;
        by = pY + 32;
        angle = 15;
    } else {
        bx = 675;
        by = eY + 32;
        angle = -15;
    }

    bullet.style.left = bx + "px";
    bullet.style.top = by + "px";

    const bulletInterval = setInterval(function () {
        if (gameOver) {
            clearInterval(bulletInterval);
            bullet.style.display = "none";
            bulletActive = false;
            return;
        }

        bx += angle;
        bullet.style.left = bx + "px";

        let hit = false;

        if (shooter === "player") {
            if (bx >= 690 && bx <= 750 && by + 15 >= eY && by <= eY + 80) {
                hit = true;
                enemyHp--;
                enemyHpShow.innerText = `Враг: ${enemyHp} ❤️`;
            }
        } else {
            if (bx <= 110 && bx >= 50 && by + 15 >= pY && by <= pY + 80) {
                hit = true;
                playerHp--;
                playerHpShow.innerText = `Игрок: ${playerHp} ❤️`;
            }
        }

        let miss;
        switch (shooter) {
            case "player":
                miss = bx > 800;
                break;
            case "enemy":
                miss = bx < 0;
                break;
            default:
                miss = false;
        }

        if (hit || miss) {
            clearInterval(bulletInterval);
            bullet.style.display = "none";
            bulletActive = false;

            if (hit) {
                checkWinCondition();
            }

            if (!gameOver) {
                if (shooter === "player") {
                    isPlayerTurn = false;

                    setTimeout(function () {
                        shoot("enemy");
                    }, 800);
                } else {
                    isPlayerTurn = true;
                }
            }
        }
    }, 20);
}

function checkWinCondition() {
    if (enemyHp <= 0) {
        gameOver = true;
        setTimeout(function () {
            alert("You win!");
        }, 50);
    } else if (playerHp <= 0) {
        gameOver = true;
        setTimeout(function () {
            alert("You lose!");
        }, 50);
    }
}
