// MAIN SCRIPT actualizado: formulario funcional (guarda en localStorage), cookies persistentes,
// carrusel con flechas y autoplay cada 8s, reloj en footer, partículas adaptativas y hover verde solución.

/* Helpers */
function $(sel){return document.querySelector(sel);}
function $all(sel){return Array.from(document.querySelectorAll(sel));}

/* Wait DOM */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');

    /* ---------- PARTICLES (simple, ligero y adaptativo) ---------- */
    initParticles();

    /* ---------- HERO CARD hover efecto extra ---------- */
    const heroCard = $('#heroCard');
    if(heroCard){
        heroCard.addEventListener('mouseenter', () => heroCard.style.transform = 'scale(1.03) translateY(-10px)');
        heroCard.addEventListener('mouseleave', () => heroCard.style.transform = 'scale(1) translateY(0)');
    }

    /* ---------- MENÚ MÓVIL ---------- */
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if(mobileMenu && navLinks){
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    /* ---------- CARRUSEL (5 slides) ---------- */
    initCarousel();

    /* ---------- FILTRO SCRIPTS ---------- */
    $all('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(){
            $all('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const f = this.dataset.filter;
            $all('.script-card').forEach(card => {
                if(f === 'all' || card.dataset.category === f){
                    card.style.display = 'block';
                    setTimeout(()=>{ card.style.opacity = '1'; card.style.transform='translateY(0)'; }, 40);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(()=> card.style.display = 'none', 300);
                }
            });
        });
    });

    /* ---------- FORMULARIO (funcional: guarda en localStorage) ---------- */
    const contactForm = $('#contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const company = $('#company').value.trim();
            const message = $('#message').value.trim();

            const errors = validateForm({name,email,message});
            if(errors.length){
                showNotification(errors.join('. '),'error');
                return;
            }

            // Guardar en localStorage como "contactMessages"
            const saved = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            saved.push({name,email,company,message,ts:new Date().toISOString()});
            localStorage.setItem('contactMessages', JSON.stringify(saved));

            showNotification('¡Gracias por tu mensaje! Se ha guardado correctamente.','success');
            contactForm.reset();
        });
    }

    /* ---------- COOKIES (persistente) ---------- */
    const cookiesBanner = $('#cookiesBanner');
    const cookieAccept = $('#cookieAccept');
    const cookieSettings = $('#cookieSettings');

    setTimeout(() => {
        if(localStorage.getItem('cookiesAccepted') !== 'true'){
            // show banner (it starts hidden in HTML)
            cookiesBanner.classList.remove('hidden');
        }
    }, 900);

    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted','true');
        cookiesBanner.classList.add('hidden');
        showNotification('Preferencias de cookies guardadas','success');
    });
    cookieSettings.addEventListener('click', () => {
        showNotification('Panel de configuración (simulado)','info');
    });

    /* ---------- THEME from localStorage ---------- */
    const themeToggle = $('#themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'light'){ document.body.classList.add('light-mode'); themeIcon.classList.replace('fa-moon','fa-sun');}

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        if(isLight){ themeIcon.classList.replace('fa-moon','fa-sun'); localStorage.setItem('theme','light'); }
        else { themeIcon.classList.replace('fa-sun','fa-moon'); localStorage.setItem('theme','dark'); }
    });

    /* ---------- FLOATING BTN ---------- */
    const floatingBtn = $('#floatingBtn');
    floatingBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', () => {
        if(window.pageYOffset > 300){ floatingBtn.style.opacity = '1'; floatingBtn.style.visibility = 'visible'; }
        else { floatingBtn.style.opacity = '0'; floatingBtn.style.visibility = 'hidden'; }
    });

    /* ---------- ANIMACIONES ON SCROLL ---------- */
    function animateOnScroll(){
        $all('.skill-card, .script-card, .about-content, .contact-content').forEach(el => {
            const pos = el.getBoundingClientRect().top;
            const screen = window.innerHeight / 1.3;
            if(pos < screen){ el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
        });
    }
    $all('.skill-card, .script-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity .6s ease, transform .6s ease';
    });
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    /* ---------- FOOTER YEAR + CLOCK ---------- */
    // year auto update
    document.getElementById('year').textContent = new Date().getFullYear();
    startClock(); // inicializa reloj
});

/* ------------------- VALIDATION ------------------- */
function validateForm({name,email,message}){
    const errors = [];
    if(!name || name.length < 2) errors.push('El nombre debe tener al menos 2 caracteres');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email)) errors.push('Introduce un email válido');
    if(!message || message.length < 10) errors.push('El mensaje debe tener al menos 10 caracteres');
    return errors;
}

/* ------------------- NOTIFICATIONS ------------------- */
function showNotification(msg, type='info'){
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `position:fixed;top:18px;right:18px;padding:12px 18px;border-radius:8px;color:#fff;z-index:10050;font-weight:700;transform:translateX(100%);opacity:0;box-shadow:0 8px 30px rgba(0,0,0,0.25)`;
    n.style.background = type==='success' ? '#16a34a' : (type==='error' ? '#dc2626' : '#0ea5a4');
    document.body.appendChild(n);
    setTimeout(()=>{ n.style.transform='translateX(0)'; n.style.opacity='1'; }, 60);
    setTimeout(()=>{ n.style.transform='translateX(100%)'; n.style.opacity='0'; setTimeout(()=> n.remove(),320); }, 4200);
}

/* ------------------- CAROUSEL ------------------- */
function initCarousel(){
    const slides = $all('.carousel-slide');
    const dots = $all('.dot');
    const prev = $('#carouselPrev');
    const next = $('#carouselNext');
    let index = slides.findIndex(s => s.classList.contains('active'));
    if(index === -1) index = 0;
    let timer = null;

    function goTo(i){
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[i].classList.add('active');
        dots[i].classList.add('active');
        index = i;
    }

    function nextSlide(){
        const ni = (index + 1) % slides.length;
        goTo(ni);
    }
    function prevSlide(){
        const ni = (index - 1 + slides.length) % slides.length;
        goTo(ni);
    }

    next && next.addEventListener('click', () => { nextSlide(); resetTimer(); });
    prev && prev.addEventListener('click', () => { prevSlide(); resetTimer(); });
    dots.forEach(d => d.addEventListener('click', ()=>{ goTo(parseInt(d.dataset.slide)); resetTimer(); }));

    function startTimer(){ timer = setInterval(nextSlide, 8000); }
    function resetTimer(){ clearInterval(timer); startTimer(); }

    startTimer();
}

/* ------------------- CLOCK ------------------- */
function startClock(){
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    function tick(){
        const now = new Date();
        // timezone: Europe/Madrid -> use toLocaleString with 'es-ES' and timeZone
        const timeStr = now.toLocaleTimeString('es-ES',{hour12:false,timeZone:'Europe/Madrid'});
        const dateStr = now.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Madrid'});
        if(clockEl) clockEl.textContent = timeStr;
        if(dateEl) dateEl.textContent = dateStr.charAt(0).toUpperCase()+dateStr.slice(1);
    }
    tick();
    setInterval(tick,1000);
}

/* ------------------- PARTICLES (canvas) ------------------- */
function initParticles(){
    const canvas = document.getElementById('particleCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;

    const particles = [];
    const count = Math.max(40, Math.floor((w*h)/90000)); // density
    for(let i=0;i<count;i++) particles.push(randomParticle());

    function randomParticle(){
        return {
            x: Math.random()*w,
            y: Math.random()*h,
            r: 0.8 + Math.random()*2.2,
            vx: (Math.random()-0.5)*0.4,
            vy: (Math.random()-0.5)*0.4,
            alpha: 0.15 + Math.random()*0.5
        };
    }

    function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    addEventListener('resize', resize);

    function getColor(){
        return document.body.classList.contains('light-mode') ? 'rgba(13,148,136,': 'rgba(34,197,94,';
    }

    function draw(){
        ctx.clearRect(0,0,w,h);
        const base = getColor();
        for(const p of particles){
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < -50) p.x = w+50;
            if(p.x > w+50) p.x = -50;
            if(p.y < -50) p.y = h+50;
            if(p.y > h+50) p.y = -50;
            ctx.beginPath();
            ctx.fillStyle = base + (p.alpha) + ')';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
}
