// ========================================
// Animated Particle Background
// ========================================
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener("resize", initParticles);

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========================================
// Typing Effect
// ========================================
const texts = [
    "Merhaba, ben bir Python Geliştiricisiyim.",
    "Oyunlar tasarlıyor, kodla hikaye anlatıyorum.",
    "Pygame • Ursina • Python 🐍"
];
const typingEl = document.getElementById("typing-text");
let textIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
    const current = texts[textIndex];
    if (!isDeleting) {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeLoop, 2000);
            return;
        }
        setTimeout(typeLoop, 80);
    } else {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 40);
    }
}
setTimeout(typeLoop, 800);

// ========================================
// Navbar Scroll & Scrollspy
// ========================================
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    // Navbar background
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    // Scrollspy
    let current = "";
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.getAttribute("id");
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
});

// ========================================
// Mobile Menu
// ========================================
const hamburger = document.getElementById("hamburger");
const navLinksContainer = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinksContainer.classList.toggle("open");
});

navLinksContainer.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinksContainer.classList.remove("open");
    });
});

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));

// ========================================
// Stat Counter Animation
// ========================================
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(".stat-number").forEach(num => {
                const target = parseInt(num.dataset.count);
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    num.textContent = current;
                }, 40);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector(".hero-stats");
if (statsEl) statObserver.observe(statsEl);

// ========================================
// Skill Bar Animation
// ========================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(".skill-fill").forEach(bar => {
                setTimeout(() => { bar.style.width = bar.dataset.width + "%"; }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsEl = document.querySelector(".skills-grid");
if (skillsEl) skillObserver.observe(skillsEl);

// ========================================
// Project Filtering
// ========================================
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const match = filter === "all" || card.dataset.category === filter;
            card.style.display = match ? "flex" : "none";
            if (match) card.style.animation = "fadeIn 0.5s ease forwards";
        });
    });
});

// Inject fadeIn keyframes
const style = document.createElement("style");
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);

// ========================================
// Project Modal
// ========================================
const projectsData = [
    {
        icon: "🚀", title: "Space Explorer",
        tags: ["Python", "Pygame", "OOP"],
        problem: "Uzay temalı bir hayatta kalma oyununda düşman yapay zekasını (AI) verimli bir pathfinding algoritması ile yönetmek gerekiyordu.",
        solution: "A* Pathfinding algoritması ve Entity-Component-System (ECS) mimarisi kullanılarak modüler, genişletilebilir bir oyun motoru tasarlandı. Sprite yönetimi ve çarpışma algılama (collision detection) optimize edildi.",
        result: "60 FPS'de 100+ aktif düşman yönetimi sağlandı. Oyun Itch.io'da 500+ indirme aldı.",
        demo: "#", github: "#"
    },
    {
        icon: "📈", title: "Crypto Data Analyzer",
        tags: ["Pandas", "Matplotlib", "NumPy"],
        problem: "Kripto para piyasasındaki büyük veri setlerini anlamlı trendlere dönüştürmek ve görselleştirmek gerekiyordu.",
        solution: "Pandas ile veri temizleme pipeline'ı, NumPy ile istatistiksel analiz ve Matplotlib ile interaktif grafikler oluşturuldu.",
        result: "10.000+ veri noktası gerçek zamanlı işlenerek kullanıcıya sunuldu. Trend tahmin doğruluğu %78'e ulaştı.",
        demo: "#", github: "#"
    },
    {
        icon: "⚙️", title: "Oyun Liderlik Tablosu API",
        tags: ["FastAPI", "Docker", "JWT"],
        problem: "Birden fazla oyun için merkezi, güvenli ve hızlı bir skor tablosu sistemi gerekiyordu.",
        solution: "FastAPI ile asenkron REST API geliştirildi. JWT ile kimlik doğrulama, Docker ile konteynerize deployment sağlandı.",
        result: "Ortalama yanıt süresi 15ms altında. 5 farklı oyun projesinde aktif olarak kullanılıyor.",
        demo: "#", github: "#"
    }
];

const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".open-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.project);
        const p = projectsData[idx];
        document.getElementById("modalIcon").textContent = p.icon;
        document.getElementById("modalTitle").textContent = p.title;
        document.getElementById("modalProblem").textContent = p.problem;
        document.getElementById("modalSolution").textContent = p.solution;
        document.getElementById("modalResult").textContent = p.result;
        document.getElementById("modalDemo").href = p.demo;
        document.getElementById("modalGithub").href = p.github;

        const tagsContainer = document.getElementById("modalTags");
        tagsContainer.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}
