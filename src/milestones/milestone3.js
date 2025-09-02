// Milestone 3: Add a single row of enemies
import { milestone2 } from './milestone2.js';

export function milestone3() {
    let gameOver = false;
    let level = 1;
    let left = false, right = false, space = false;
    let bullets = [];
    let enemies = [];
    let boss = null;
    let enemyCols = 8, enemyRows = 3, enemyWidth = 40, enemyHeight = 20, enemyGap = 20;
    let enemySpeed = 1;
    let direction = 1;
    let bossActive = false;

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Could not find canvas element');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    let player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 60,
        width: 50,
        height: 20,
        speed: 5,
        health: 100,
        maxHealth: 100,
        lives: 3
    };

    function initEnemies() {
        enemies = [];
        for (let row = 0; row < enemyRows + level - 1; row++) {
            for (let i = 0; i < enemyCols; i++) {
                enemies.push({
                    x: 60 + i * (enemyWidth + enemyGap),
                    y: 60 + row * (enemyHeight + enemyGap),
                    width: enemyWidth,
                    height: enemyHeight,
                    alive: true
                });
            }
        }
    }
    function initBoss() {
        boss = {
            x: canvas.width / 2 - 60,
            y: 40,
            width: 120,
            height: 40,
            health: 100 + 50 * (level-1),
            maxHealth: 100 + 50 * (level-1),
            phase: 1,
            alive: true
        };
        bossActive = true;
    }
    initEnemies();

    function drawPlayer() {
    // Draw a simple green spaceship (triangle with a cockpit)
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2); // nose
    ctx.lineTo(-player.width / 2, player.height / 2); // left wing
    ctx.lineTo(player.width / 2, player.height / 2); // right wing
    ctx.closePath();
    ctx.fillStyle = '#0f0';
    ctx.fill();
    // Cockpit
    ctx.beginPath();
    ctx.arc(0, 0, player.height / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0ff';
    ctx.fill();
    ctx.restore();
    // Draw health bar under the ship
    let barWidth = player.width;
    let barHeight = 6;
    let healthPercent = player.health / player.maxHealth;
    ctx.save();
    ctx.fillStyle = '#222';
    ctx.fillRect(player.x, player.y + player.height + 4, barWidth, barHeight);
    ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : (healthPercent > 0.2 ? '#ff0' : '#f00');
    ctx.fillRect(player.x, player.y + player.height + 4, barWidth * healthPercent, barHeight);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(player.x, player.y + player.height + 4, barWidth, barHeight);
    ctx.restore();
    }

        function drawBullets() {
        ctx.fillStyle = '#ff0';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    }

    function drawEnemies() {
        enemies.forEach(e => {
            if (!e.alive) return;
            ctx.save();
            ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
            // Draw a red UFO-like enemy: oval body and dome
            ctx.beginPath();
            ctx.ellipse(0, 0, e.width / 2, e.height / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#f00';
            ctx.fill();
            // Dome
            ctx.beginPath();
            ctx.ellipse(0, -e.height / 4, e.width / 4, e.height / 4, 0, 0, Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            // Legs
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-e.width / 4, e.height / 2 - 2);
            ctx.lineTo(-e.width / 4, e.height / 2 + 6);
            ctx.moveTo(0, e.height / 2 - 2);
            ctx.lineTo(0, e.height / 2 + 6);
            ctx.moveTo(e.width / 4, e.height / 2 - 2);
            ctx.lineTo(e.width / 4, e.height / 2 + 6);
            ctx.stroke();
            ctx.restore();
        });
        // Draw boss if active
        if (bossActive && boss && boss.alive) {
            ctx.save();
            ctx.translate(boss.x + boss.width / 2, boss.y + boss.height / 2);
            // Boss body
            ctx.beginPath();
            ctx.ellipse(0, 0, boss.width / 2, boss.height / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#800';
            ctx.fill();
            // Boss dome
            ctx.beginPath();
            ctx.ellipse(0, -boss.height / 4, boss.width / 4, boss.height / 4, 0, 0, Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            // Boss health bar
            ctx.restore();
            ctx.save();
            ctx.fillStyle = '#222';
            ctx.fillRect(boss.x, boss.y - 16, boss.width, 8);
            ctx.fillStyle = '#0ff';
            ctx.fillRect(boss.x, boss.y - 16, boss.width * (boss.health / boss.maxHealth), 8);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(boss.x, boss.y - 16, boss.width, 8);
            ctx.restore();
        }
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        if (left && player.x > 0) player.x -= player.speed;
        if (right && player.x < canvas.width - player.width) player.x += player.speed;
        if (space) {
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 7 });
            space = false;
        }
        bullets.forEach(b => b.y -= b.speed);
        bullets = bullets.filter(b => b.y + b.height > 0);

        // Move enemies or boss
        if (bossActive && boss && boss.alive) {
            // Boss movement: left-right
            boss.x += direction * (2 + level);
            if (boss.x <= 0 || boss.x + boss.width >= canvas.width) direction *= -1;
            // Boss attack: shoot at intervals
            if (Math.random() < 0.03 + 0.01 * level) {
                bullets.push({ x: boss.x + boss.width / 2 - 2.5, y: boss.y + boss.height, width: 5, height: 12, speed: -6, boss: true });
            }
        } else {
            let edge = false;
            enemies.forEach(e => {
                if (!e.alive) return;
                e.x += enemySpeed * direction;
                if (e.x <= 0 || e.x + e.width >= canvas.width) edge = true;
            });
            if (edge) {
                direction *= -1;
                enemies.forEach(e => {
                    e.y += 20;
                });
            }
        }

        // Bullet-enemy collision
        bullets.forEach(b => {
            if (bossActive && boss && boss.alive && !b.boss) {
                // Player bullet hits boss
                if (
                    b.x < boss.x + boss.width &&
                    b.x + b.width > boss.x &&
                    b.y < boss.y + boss.height &&
                    b.y + b.height > boss.y
                ) {
                    boss.health -= 10;
                    b.y = -100;
                    if (boss.health <= 0) {
                        boss.alive = false;
                        bossActive = false;
                        setTimeout(() => {
                            level++;
                            enemySpeed = 1 + 0.2 * (level-1);
                            initEnemies();
                        }, 1000);
                    }
                }
            } else {
                enemies.forEach(e => {
                    if (e.alive && b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                        e.alive = false;
                        b.y = -100; // Remove bullet
                    }
                });
            }
        });
        enemies = enemies.filter(e => e.alive || e.y < canvas.height);

        // Boss/player bullet collision
        bullets.forEach(b => {
            if (b.boss &&
                b.x < player.x + player.width &&
                b.x + b.width > player.x &&
                b.y < player.y + player.height &&
                b.y + b.height > player.y
            ) {
                player.health -= 34;
                b.y = -100;
            }
        });

        // Level progression: if all enemies are dead, spawn boss
        if (!bossActive && enemies.every(e => !e.alive)) {
            if (!boss || !boss.alive) {
                setTimeout(() => {
                    initBoss();
                }, 1000);
            }
        }

        // Game over and health/lives logic
        if (player.health <= 0) {
            player.lives--;
            if (player.lives > 0) {
                player.health = player.maxHealth;
            } else {
                player.health = 0;
                gameOver = true;
            }
        }
    }

    function drawLives() {
        ctx.save();
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Lives: ' + player.lives + '  Level: ' + level, 20, 30);
        ctx.restore();
    }

    function loop() {
        clear();
        update();
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawLives();
        if (gameOver) {
            ctx.save();
            ctx.font = '48px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        } else {
            requestAnimationFrame(loop);
        }
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') right = true;
        if (e.key === ' ' || e.key === 'Spacebar') space = true;
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') right = false;
    });

    loop();
}