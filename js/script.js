// ===== PARTICLES BACKGROUND =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuración de partículas
const particles = [];
const particleCount = 80;

// Colores para modo oscuro y claro
const darkModeColors = ['#64ffda', '#8affdf', '#a8fff0', '#ccd6f6'];
const lightModeColors = ['#0f766e', '#0d9488', '#14b8a6', '#475569'];

// Clase para partículas
class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = document.body.classList.contains('light-mode') 
            ? lightModeColors[Math.floor(Math.random() * lightModeColors.length)]
            : darkModeColors[Math.floor(Math.random() * darkModeColors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebotar en los bordes
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        
        // Cambiar opacidad para efecto de parpadeo
        this.opacity += (Math.random() - 0.5) * 0.05;
        this.opacity = Math.max(0.2, Math.min(0.8, this.opacity));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

// Inicializar partículas
function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animación de partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar conexiones entre partículas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = document.body.classList.contains('light-mode') 
                    ? 'rgba(15, 118, 110, 0.1)' 
                    : 'rgba(100, 255, 218, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.3 * (1 - distance / 150);
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

// Redimensionar canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

// ===== TOGGLE MODO CLARO/OSCURO =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Verificar preferencia del usuario
if (localStorage.getItem('theme') === 'light' || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.body.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Alternar tema
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    
    // Actualizar colores de partículas
    particles.forEach(particle => {
        particle.color = document.body.classList.contains('light-mode') 
            ? lightModeColors[Math.floor(Math.random() * lightModeColors.length)]
            : darkModeColors[Math.floor(Math.random() * darkModeColors.length)];
    });
});

// ===== CARRUSEL =====
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
let currentSlide = 0;

// Inicializar puntos del carrusel
function initCarouselDots() {
    carouselDots.innerHTML = '';
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
}

// Ir a slide específico
function goToSlide(slideIndex) {
    carouselSlides[currentSlide].classList.remove('active');
    carouselDots.children[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    carouselSlides[currentSlide].classList.add('active');
    carouselDots.children[currentSlide].classList.add('active');
}

// Event listeners para controles del carrusel
carouselPrev.addEventListener('click', () => {
    let newSlide = currentSlide - 1;
    if (newSlide < 0) newSlide = carouselSlides.length - 1;
    goToSlide(newSlide);
});

carouselNext.addEventListener('click', () => {
    let newSlide = currentSlide + 1;
    if (newSlide >= carouselSlides.length) newSlide = 0;
    goToSlide(newSlide);
});

// Autoavance del carrusel
let carouselInterval = setInterval(() => {
    let newSlide = currentSlide + 1;
    if (newSlide >= carouselSlides.length) newSlide = 0;
    goToSlide(newSlide);
}, 5000);

// Pausar autoavance al interactuar
carouselPrev.addEventListener('mouseenter', () => clearInterval(carouselInterval));
carouselNext.addEventListener('mouseenter', () => clearInterval(carouselInterval));
carouselDots.addEventListener('mouseenter', () => clearInterval(carouselInterval));

// Reanudar autoavance al salir
carouselPrev.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
        let newSlide = currentSlide + 1;
        if (newSlide >= carouselSlides.length) newSlide = 0;
        goToSlide(newSlide);
    }, 5000);
});

carouselNext.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
        let newSlide = currentSlide + 1;
        if (newSlide >= carouselSlides.length) newSlide = 0;
        goToSlide(newSlide);
    }, 5000);
});

carouselDots.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
        let newSlide = currentSlide + 1;
        if (newSlide >= carouselSlides.length) newSlide = 0;
        goToSlide(newSlide);
    }, 5000);
});

// ===== FILTRO DE SCRIPTS =====
const filterButtons = document.querySelectorAll('.filter-btn');
const scriptCards = document.querySelectorAll('.script-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Quitar clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Añadir clase active al botón clickeado
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        scriptCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar loader
    btnText.textContent = 'Enviando...';
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;
    
    // Obtener datos del formulario
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    };
    
    // Enviar email usando EmailJS
    emailjs.send('service_cybershield', 'template_contact', formData)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Mostrar mensaje de éxito
            btnText.textContent = '¡Mensaje Enviado!';
            btnLoader.classList.add('hidden');
            
            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                contactForm.reset();
                btnText.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }, 2000);
        }, function(error) {
            console.log('FAILED...', error);
            
            // Mostrar mensaje de error
            btnText.textContent = 'Error, intenta de nuevo';
            btnLoader.classList.add('hidden');
            
            // Restaurar después de 2 segundos
            setTimeout(() => {
                btnText.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }, 2000);
        });
});

// ===== RELOJ EN FOOTER =====
function updateClock() {
    const now = new Date();
    
    // Formatear hora
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Formatear fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('es-ES', options);
}

// ===== BOTÓN FLOTANTE =====
const floatingBtn = document.getElementById('floatingBtn');

floatingBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mostrar/ocultar botón flotante al hacer scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        floatingBtn.style.opacity = '1';
        floatingBtn.style.visibility = 'visible';
    } else {
        floatingBtn.style.opacity = '0';
        floatingBtn.style.visibility = 'hidden';
    }
});

// ===== BANNER DE COOKIES =====
const cookiesBanner = document.getElementById('cookiesBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieSettings = document.getElementById('cookieSettings');

// Mostrar banner si no se ha aceptado
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookiesBanner.classList.remove('hidden');
    }, 2000);
}

// Aceptar cookies
cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookiesBanner.classList.add('hidden');
});

// Configurar cookies
cookieSettings.addEventListener('click', () => {
    alert('Configuración de cookies: Esta página utiliza cookies esenciales para el funcionamiento del sitio.');
});

// ===== NAVEGACIÓN SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ANIMACIÓN DE ELEMENTOS AL HACER SCROLL =====
function checkScroll() {
    const elements = document.querySelectorAll('.skill-card, .script-card, .certification-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Aplicar estilos iniciales para animación
document.querySelectorAll('.skill-card, .script-card, .certification-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    initParticles();
    animateParticles();
    
    // Inicializar carrusel
    initCarouselDots();
    
    // Inicializar reloj
    updateClock();
    setInterval(updateClock, 1000);
    
    // Inicializar año en copyright
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Comprobar scroll para animaciones
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Comprobar al cargar
    
    // Redimensionar canvas al cambiar tamaño de ventana
    window.addEventListener('resize', resizeCanvas);
    
    // Efecto de escritura para el subtítulo del héroe
    const subtitle = document.querySelector('.hero .subtitle');
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Iniciar efecto de escritura después de un breve retraso
    setTimeout(typeWriter, 1000);
});

// Efecto de partículas en el card del héroe
const heroCard = document.getElementById('heroCard');
if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        heroCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}
// ===== CARRUSEL DE SCRIPTS =====
const scriptsCarousel = document.getElementById('scriptsCarousel');
const scriptsPrev = document.getElementById('scriptsPrev');
const scriptsNext = document.getElementById('scriptsNext');
const scriptsDots = document.getElementById('scriptsDots');
let currentScriptSlide = 0;
const scriptCardsElements = document.querySelectorAll('#scriptsCarousel .script-card');
let scriptsPerView = 3;

// Inicializar puntos del carrusel de scripts
function initScriptsDots() {
    scriptsDots.innerHTML = '';
    const totalSlides = Math.ceil(scriptCardsElements.length / scriptsPerView);
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('scripts-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', () => goToScriptSlide(i));
        scriptsDots.appendChild(dot);
    }
}

// Ir a slide específico de scripts
function goToScriptSlide(slideIndex) {
    const totalSlides = Math.ceil(scriptCardsElements.length / scriptsPerView);
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    currentScriptSlide = slideIndex;
    const cardWidth = scriptCardsElements[0].offsetWidth + 30; // Ancho + gap
    const scrollPosition = currentScriptSlide * cardWidth * scriptsPerView;
    
    scriptsCarousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    // Actualizar puntos
    document.querySelectorAll('.scripts-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentScriptSlide);
    });
}

// Event listeners para controles del carrusel de scripts
scriptsPrev.addEventListener('click', () => {
    goToScriptSlide(currentScriptSlide - 1);
});

scriptsNext.addEventListener('click', () => {
    goToScriptSlide(currentScriptSlide + 1);
});

// Ajustar scripts por vista según el tamaño de pantalla
function adjustScriptsPerView() {
    if (window.innerWidth < 768) {
        scriptsPerView = 1;
    } else if (window.innerWidth < 1200) {
        scriptsPerView = 2;
    } else {
        scriptsPerView = 3;
    }
    initScriptsDots();
    goToScriptSlide(0);
}

// Inicializar carrusel de scripts al cargar
document.addEventListener('DOMContentLoaded', function() {
    adjustScriptsPerView();
    window.addEventListener('resize', adjustScriptsPerView);
});