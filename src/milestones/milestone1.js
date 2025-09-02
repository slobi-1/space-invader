// Milestone 1: Draw player ship and allow left/right movement
export function milestone1() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20, speed: 5 };
    let left = false, right = false;

    function drawPlayer() {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        if (left && player.x > 0) player.x -= player.speed;
        if (right && player.x < canvas.width - player.width) player.x += player.speed;
    }

    function loop() {
        clear();
        update();
        drawPlayer();
        requestAnimationFrame(loop);
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') left = true;
        if (e.key === 'ArrowRight') right = true;
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft') left = false;
        if (e.key === 'ArrowRight') right = false;
    });

    loop();
}
