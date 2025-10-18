// ===== PARTICLES BACKGROUND MEJORADO =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuración de partículas MEJORADA
const particles = [];
const particleCount = 120; // Aumentado de 80 a 120 para más densidad

// Colores para modo oscuro y claro MEJORADOS
const darkModeColors = ['#64ffda', '#8affdf', '#a8fff0', '#ccd6f6'];
const lightModeColors = ['#0f766e', '#0d9488', '#14b8a6', '#1e40af', '#dc2626']; // Más colores y más vibrantes

// Clase Partícula MEJORADA
class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = document.body.classList.contains('light-mode') 
            ? lightModeColors[Math.floor(Math.random() * lightModeColors.length)]
            : darkModeColors[Math.floor(Math.random() * darkModeColors.length)];
        // MEJORA: Partículas más visibles en modo claro
        this.opacity = document.body.classList.contains('light-mode') 
            ? Math.random() * 0.8 + 0.6  // Más opacas en modo claro
            : Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseDirection = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        
        this.opacity += this.pulseSpeed * this.pulseDirection;
        // MEJORA: Rango de opacidad mayor en modo claro
        if (document.body.classList.contains('light-mode')) {
            if (this.opacity > 0.9 || this.opacity < 0.5) {
                this.pulseDirection *= -1;
            }
        } else {
            if (this.opacity > 0.8 || this.opacity < 0.3) {
                this.pulseDirection *= -1;
            }
        }
        
        if (document.body.classList.contains('light-mode') && Math.random() < 0.002) {
            this.color = lightModeColors[Math.floor(Math.random() * lightModeColors.length)];
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // MEJORA: Sombras más pronunciadas en modo claro
        if (document.body.classList.contains('light-mode')) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 20; // Más blur
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}

// Inicializar partículas
function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animación de partículas MEJORADA - MODO CLARO MÁS VISIBLE
function animateParticles() {
    // MEJORA: Fondo más transparente en modo claro para ver partículas
    if (document.body.classList.contains('light-mode')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // ELIMINAR FONDO GRIS
        // Solo un gradiente muy sutil
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(248, 250, 252, 0.3)'); // Más transparente
        gradient.addColorStop(1, 'rgba(241, 245, 249, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // MEJORA: Partículas más brillantes en modo claro
    particles.forEach(particle => {
        if (document.body.classList.contains('light-mode')) {
            // Aumentar brillo y contraste en modo claro
            particle.opacity = Math.min(particle.opacity + 0.2, 0.9); // Más opacas
        }
        particle.update();
        particle.draw();
    });
    
    // MEJORA: Conexiones más visibles en modo claro
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                
                if (document.body.classList.contains('light-mode')) {
                    // Conexiones más visibles en modo claro
                    ctx.strokeStyle = `rgba(15, 118, 110, ${0.6 * (1 - distance / 120)})`; // Más opaco
                    ctx.lineWidth = 2; // Más grueso
                    ctx.shadowColor = 'rgba(15, 118, 110, 0.3)';
                    ctx.shadowBlur = 5;
                } else {
                    ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
                    ctx.lineWidth = 0.5;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
                
                ctx.globalAlpha = 0.6 * (1 - distance / 120);
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                
                // Resetear sombras
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// Redimensionar canvas MEJORADO
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // MEJORA: Recrear partículas con nueva distribución
    const oldParticles = [...particles];
    particles.length = 0;
    
    for (let i = 0; i < particleCount; i++) {
        if (oldParticles[i]) {
            particles.push(oldParticles[i]);
            // Ajustar posición si es necesario
            if (particles[i].x > canvas.width) particles[i].x = canvas.width;
            if (particles[i].y > canvas.height) particles[i].y = canvas.height;
        } else {
            particles.push(new Particle());
        }
    }
}

// ===== TOGGLE MODO CLARO/OSCURO MEJORADO =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// FORZAR MODO OSCURO COMO PRINCIPAL - ELIMINAR DETECCIÓN AUTOMÁTICA
// Siempre empezar en modo oscuro
document.body.classList.remove('light-mode');
themeIcon.classList.remove('fa-sun');
themeIcon.classList.add('fa-moon');
localStorage.setItem('theme', 'dark');

// Alternar tema MEJORADO
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
    
    // MEJORA: Actualizar partículas inmediatamente con nuevos colores
    particles.forEach(particle => {
        particle.color = document.body.classList.contains('light-mode') 
            ? lightModeColors[Math.floor(Math.random() * lightModeColors.length)]
            : darkModeColors[Math.floor(Math.random() * darkModeColors.length)];
        particle.opacity = document.body.classList.contains('light-mode') 
            ? Math.random() * 0.8 + 0.4
            : Math.random() * 0.6 + 0.2;
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

// ===== FORMULARIO DE CONTACTO CORREGIDO =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

if (contactForm) {
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
        
        // Validación básica
        if (!formData.name || !formData.email || !formData.message) {
            alert('Por favor, completa todos los campos obligatorios.');
            btnText.textContent = 'Enviar Mensaje';
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
            return;
        }
        
        // Enviar email usando EmailJS con tus datos reales
        emailjs.send('service_0yae93w', 'template_z8fuguv', formData)
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
}

// ===== RELOJ EN FOOTER =====
function updateClock() {
    const now = new Date();
    
    // Formatear hora
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Formatear fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// ===== BOTÓN FLOTANTE =====
const floatingBtn = document.getElementById('floatingBtn');

if (floatingBtn) {
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
}

// ===== BANNER DE COOKIES =====
const cookiesBanner = document.getElementById('cookiesBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieSettings = document.getElementById('cookieSettings');

// Mostrar banner si no se ha aceptado
if (cookiesBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookiesBanner.classList.remove('hidden');
    }, 2000);
}

// Aceptar cookies
if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiesBanner.classList.add('hidden');
    });
}

// Configurar cookies
if (cookieSettings) {
    cookieSettings.addEventListener('click', () => {
        alert('Configuración de cookies: Esta página utiliza cookies esenciales para el funcionamiento del sitio.');
    });
}

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

// ===== MENÚ HAMBURGUESA - CÓDIGO CORREGIDO =====
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenu || !navLinks) return;
    
    console.log('Inicializando menú hamburguesa...'); // Debug
    
    // Función para alternar el menú
    function toggleMobileMenu() {
        console.log('Toggle menu clicked'); // Debug
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Cambiar el icono del menú
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.innerHTML = '✕';
        } else {
            mobileMenu.innerHTML = '☰';
        }
    }
    
    // Event listener para el menú hamburguesa
    mobileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Cerrar menú al redimensionar la ventana si es mayor a 768px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// ===== CARRUSEL DE SCRIPTS - MEJORADO PARA MÓVILES =====
function initScriptsCarousel() {
    const scriptsCarousel = document.getElementById('scriptsCarousel');
    const scriptsPrev = document.getElementById('scriptsPrev');
    const scriptsNext = document.getElementById('scriptsNext');
    const scriptsDots = document.getElementById('scriptsDots');
    
    if (!scriptsCarousel || !scriptsPrev || !scriptsNext || !scriptsDots) return;
    
    let currentScriptSlide = 0;
    const scriptCardsElements = document.querySelectorAll('#scriptsCarousel .script-card');
    let scriptsPerView = getScriptsPerView();

    // Función para determinar cuántos scripts mostrar según el ancho
    function getScriptsPerView() {
        if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth < 1200) {
            return 2;
        } else {
            return 3;
        }
    }

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
        
        // Calcular posición de scroll
        const card = scriptCardsElements[0];
        if (!card) return;
        
        const cardWidth = card.offsetWidth + 30; // Ancho + gap
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
        scriptsPerView = getScriptsPerView();
        initScriptsDots();
        goToScriptSlide(0);
    }

    // Swipe para móviles
    let startX = 0;
    let endX = 0;
    
    scriptsCarousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    scriptsCarousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe izquierda - siguiente
                goToScriptSlide(currentScriptSlide + 1);
            } else {
                // Swipe derecha - anterior
                goToScriptSlide(currentScriptSlide - 1);
            }
        }
    }

    // Inicializar carrusel de scripts
    adjustScriptsPerView();
    window.addEventListener('resize', adjustScriptsPerView);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado'); // Debug
    initNewsCarousel();
    // Inicializar partículas
    initParticles();
    animateParticles();
    
    // Inicializar carrusel
    initCarouselDots();
    
    // Inicializar reloj
    updateClock();
    setInterval(updateClock, 1000);
    
    // Inicializar año en copyright
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Comprobar scroll para animaciones
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Comprobar al cargar
    
    // Redimensionar canvas al cambiar tamaño de ventana
    window.addEventListener('resize', resizeCanvas);
    
    // Inicializar menú hamburguesa
    initMobileMenu();
    
    // Inicializar carrusel de scripts
    initScriptsCarousel();
    
    // Efecto de escritura para el subtítulo del héroe
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle) {
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
    }
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
// ===== CARRUSEL DE NOTICIAS =====
function initNewsCarousel() {
    const newsCarousel = document.getElementById('newsCarousel');
    const newsPrev = document.getElementById('newsPrev');
    const newsNext = document.getElementById('newsNext');
    const newsDots = document.getElementById('newsDots');
    
    if (!newsCarousel || !newsPrev || !newsNext || !newsDots) return;
    
    let currentNewsSlide = 0;
    const newsCards = document.querySelectorAll('#newsCarousel .news-card');
    let newsPerView = getNewsPerView();

    function getNewsPerView() {
        if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth < 1200) {
            return 2;
        } else {
            return 3;
        }
    }

    function initNewsDots() {
        newsDots.innerHTML = '';
        const totalSlides = Math.ceil(newsCards.length / newsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('news-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => goToNewsSlide(i));
            newsDots.appendChild(dot);
        }
    }

    function goToNewsSlide(slideIndex) {
        const totalSlides = Math.ceil(newsCards.length / newsPerView);
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;
        
        currentNewsSlide = slideIndex;
        
        const card = newsCards[0];
        if (!card) return;
        
        const cardWidth = card.offsetWidth + 30;
        const scrollPosition = currentNewsSlide * cardWidth * newsPerView;
        
        newsCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        document.querySelectorAll('.news-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentNewsSlide);
        });
    }

    newsPrev.addEventListener('click', () => {
        goToNewsSlide(currentNewsSlide - 1);
    });

    newsNext.addEventListener('click', () => {
        goToNewsSlide(currentNewsSlide + 1);
    });

    function adjustNewsPerView() {
        newsPerView = getNewsPerView();
        initNewsDots();
        goToNewsSlide(0);
    }

    // Swipe para móviles
    let startX = 0;
    let endX = 0;
    
    newsCarousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    newsCarousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleNewsSwipe();
    });
    
    function handleNewsSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNewsSlide(currentNewsSlide + 1);
            } else {
                goToNewsSlide(currentNewsSlide - 1);
            }
        }
    }

    // Inicializar
    adjustNewsPerView();
    window.addEventListener('resize', adjustNewsPerView);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    
    // Inicializar partículas
    initParticles();
    animateParticles();
    
    // Inicializar carrusel
    initCarouselDots();
    
    // Inicializar reloj
    updateClock();
    setInterval(updateClock, 1000);
    
    // Inicializar año en copyright
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Comprobar scroll para animaciones
    window.addEventListener('scroll', checkScroll);
    checkScroll();
    
    // Redimensionar canvas al cambiar tamaño de ventana
    window.addEventListener('resize', resizeCanvas);
    
    // Inicializar menú hamburguesa
    initMobileMenu();
    
    // Inicializar carrusel de scripts
    initScriptsCarousel();
    
    // INICIALIZAR CARRUSEL DE NOTICIAS
    initNewsCarousel();
    
    // Efecto de escritura para el subtítulo del héroe
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle) {
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
        
        setTimeout(typeWriter, 1000);
    }
});
