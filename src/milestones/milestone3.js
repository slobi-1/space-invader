// Milestone 3: Add a single row of enemies
import { milestone2 } from './milestone2.js';

export function milestone3() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20, speed: 5 };
    let left = false, right = false, space = false;
    let bullets = [];
    let enemies = [];
    let enemyCols = 8, enemyWidth = 40, enemyHeight = 20, enemyGap = 20;
    let enemySpeed = 1;
    let direction = 1;

    // Initialize enemies
    for (let i = 0; i < enemyCols; i++) {
        enemies.push({
            x: 60 + i * (enemyWidth + enemyGap),
            y: 60,
            width: enemyWidth,
            height: enemyHeight,
            alive: true
        });
    }

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

        // Move enemies
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

        // Bullet-enemy collision
        bullets.forEach(b => {
            enemies.forEach(e => {
                if (e.alive && b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                    e.alive = false;
                    b.y = -100; // Remove bullet
                }
            });
        });
        enemies = enemies.filter(e => e.alive || e.y < canvas.height);
    }

    function loop() {
        clear();
        update();
        drawPlayer();
        drawBullets();
        drawEnemies();
        requestAnimationFrame(loop);
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') left = true;
        if (e.key === 'ArrowRight') right = true;
        if (e.key === ' ' || e.key === 'Spacebar') space = true;
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft') left = false;
        if (e.key === 'ArrowRight') right = false;
    });

    loop();
}
