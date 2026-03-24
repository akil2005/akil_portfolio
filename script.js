// --- Lidar / Point Cloud Canvas Animation ---
const canvas = document.getElementById('lidar-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const config = {
    particleCount: 150,
    connectionDistance: 120,
    speed: 0.5,
    colors: ['#00ffcc', '#41f098', '#1e283c']
};

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 2; // depth for pseudo-3D
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.radius = Math.random() * 2 + 1;
        this.color = config.colors[Math.floor(Math.random() * 2)]; // pick cyan or green mostly
        if(Math.random() > 0.8) this.color = config.colors[2]; // dark blue sometimes
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 50 : config.particleCount;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                const opacity = 1 - (distance / config.connectionDistance);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 255, 204, ${opacity * 0.2})`;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Optional: add a grid to look like a ground plane or calibration board
    ctx.strokeStyle = 'rgba(30, 40, 60, 0.2)';
    ctx.lineWidth = 1;

    for (let p of particles) {
        p.update();
        p.draw();
    }
    drawConnections();

    requestAnimationFrame(animateCanvas);
}

// Setup
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

resizeCanvas();
initParticles();
animateCanvas();

// --- Scroll Animation Observer ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once visible
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.observe-me').forEach(el => {
    observer.observe(el);
});

// --- Mouse Parallax for Hero ---
const hero = document.getElementById('hero');
if(hero) {
    hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const content = document.querySelector('.hero-content');
        if(content) content.style.transform = `translate(${x}px, ${y}px)`;
    });
}
