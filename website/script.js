document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Smooth scrolling for anchor links with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            lenis.scrollTo(targetId);
        });
    });

    // 2. Canvas Background Animation (The Forever Loop)
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class FlowParticle {
        constructor() {
            this.t = Math.random() * Math.PI * 2; // Position on the curve
            this.speed = Math.random() * 0.002 + 0.001;
            this.radius = Math.random() * 2 + 1;
            this.offset = (Math.random() - 0.5) * 20; // Spread from the line
        }

        update() {
            this.t += this.speed;
        }

        draw() {
            // Lemniscate of Bernoulli (Infinity Symbol)
            // Scale it to fit the screen
            const scale = Math.min(width, height) * 0.3;
            const centerX = width / 2;
            const centerY = height / 2;

            // Parametric equations for Lemniscate
            const denom = 1 + Math.sin(this.t) * Math.sin(this.t);
            let x = scale * Math.cos(this.t) / denom;
            let y = scale * Math.sin(this.t) * Math.cos(this.t) / denom;

            // Add some organic offset/noise
            x += this.offset * Math.cos(this.t * 5);
            y += this.offset * Math.sin(this.t * 5);

            ctx.fillStyle = 'rgba(217, 119, 87, 0.6)'; // Terracotta
            ctx.beginPath();
            ctx.arc(centerX + x, centerY + y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < 300; i++) {
        particles.push(new FlowParticle());
    }

    function animateCanvas() {
        // Fade effect for trails
        ctx.fillStyle = 'rgba(244, 241, 235, 0.1)'; // Match bg color with low alpha
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();


    // 3. Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    });

    const animatedElements = document.querySelectorAll('.card, .pillar-card, .timeline-item, .section-title, .hero-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 4. 3D Tilt Effect - Removed for minimal design
    // The new design relies on subtle hover states defined in CSS

    // Navbar scroll effect - Removed to keep transparent
    // const navbar = document.querySelector('.navbar');
    // window.addEventListener('scroll', () => { ... });
});
