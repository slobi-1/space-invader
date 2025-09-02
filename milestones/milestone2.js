// Milestone 2: Add shooting bullets
import { milestone1 } from './milestone1.js';

export function milestone2() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20, speed: 5 };
    let left = false, right = false, space = false;
    let bullets = [];

    function drawPlayer() {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
        ctx.fillStyle = '#ff0';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
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
        // Remove bullets off screen
        bullets = bullets.filter(b => b.y + b.height > 0);
    }

    function loop() {
        clear();
        update();
        drawPlayer();
        drawBullets();
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
