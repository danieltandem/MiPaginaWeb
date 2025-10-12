// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initTheme();
    initParticles();
    initCarousel();
    initScriptsFilter();
    initContactForm();
    initFloatingButton();
    initCookiesBanner();
    initClock();
    initScrollAnimations();
    initMobileMenu();
});

// ===== TEMA CLARO/OSCURO =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ===== FONDO DE PARTÍCULAS MEJORADO =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuración de partículas
    const particles = [];
    const particleCount = 80;
    
    // Colores para modo oscuro y claro
    const darkColors = ['#64ffda', '#8affdf', '#a8fff0', '#ccd6f6'];
    const lightColors = ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'];
    
    // Crear partículas
    function createParticles() {
        particles.length = 0;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1,
                speedY: (Math.random() - 0.5) * 1,
                color: document.body.classList.contains('light-mode') 
                    ? lightColors[Math.floor(Math.random() * lightColors.length)]
                    : darkColors[Math.floor(Math.random() * darkColors.length)]
            });
        }
    }
    
    // Dibujar partículas
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar colores si cambia el tema
        const isLightMode = document.body.classList.contains('light-mode');
        const colors = isLightMode ? lightColors : darkColors;
        
        particles.forEach(particle => {
            // Actualizar posición
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebotar en los bordes
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Actualizar color si es necesario
            if (isLightMode && darkColors.includes(particle.color)) {
                particle.color = colors[Math.floor(Math.random() * colors.length)];
            } else if (!isLightMode && lightColors.includes(particle.color)) {
                particle.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            // Dibujar partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = document.body.classList.contains('light-mode') ? 0.9 : 0.7;
            ctx.fill();
            
            // Dibujar conexiones
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = particle.color;
                    ctx.globalAlpha = 0.2 * (1 - distance / 100);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    createParticles();
    drawParticles();
    
    // Recrear partículas al cambiar de tema
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                createParticles();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });
}

// ===== CARRUSEL MEJORADO =====
function initCarousel() {
    const carousel = document.getElementById('aboutCarousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Mostrar slide específico
    function showSlide(index) {
        // Ocultar todos los slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Ajustar índice si está fuera de rango
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        // Mostrar slide actual
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Iniciar autoplay
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 4000);
    }
    
    // Detener autoplay
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', function() {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    prevBtn.addEventListener('click', function() {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    // Navegación por puntos
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Pausar autoplay al interactuar con el carrusel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Iniciar
    showSlide(0);
    startAutoPlay();
}

// ===== FILTRO DE SCRIPTS =====
function initScriptsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const scriptCards = document.querySelectorAll('.script-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Obtener filtro
            const filter = this.getAttribute('data-filter');
            
            // Filtrar scripts
            scriptCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
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
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
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
        
        // Enviar con EmailJS
        emailjs.send('service_cybershield', 'template_contact', formData)
            .then(function(response) {
                // Éxito
                btnText.textContent = '¡Mensaje Enviado!';
                btnLoader.classList.add('hidden');
                
                // Resetear formulario después de un tiempo
                setTimeout(() => {
                    contactForm.reset();
                    btnText.textContent = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                }, 3000);
                
                // Mostrar notificación de éxito
                showNotification('Mensaje enviado correctamente. Te contactaré pronto.', 'success');
            }, function(error) {
                // Error
                btnText.textContent = 'Error al Enviar';
                btnLoader.classList.add('hidden');
                
                // Restaurar después de un tiempo
                setTimeout(() => {
                    btnText.textContent = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                }, 3000);
                
                // Mostrar notificación de error
                showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
            });
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'rgba(100, 255, 218, 0.9)' : 'rgba(255, 100, 100, 0.9)'};
        color: var(--primary-dark);
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== BOTÓN FLOTANTE =====
function initFloatingButton() {
    const floatingBtn = document.getElementById('floatingBtn');
    
    floatingBtn.addEventListener('click', function() {
        // Scroll al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            floatingBtn.style.display = 'flex';
        } else {
            floatingBtn.style.display = 'none';
        }
    });
}

// ===== BANNER DE COOKIES =====
function initCookiesBanner() {
    const cookiesBanner = document.getElementById('cookiesBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieSettings = document.getElementById('cookieSettings');
    
    // Verificar si ya se aceptaron las cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        // Mostrar banner después de 2 segundos
        setTimeout(() => {
            cookiesBanner.classList.remove('hidden');
        }, 2000);
    }
    
    // Aceptar cookies
    cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiesBanner.classList.add('hidden');
    });
    
    // Configurar cookies
    cookieSettings.addEventListener('click', function() {
        // Aquí iría la lógica para configuraciones más detalladas
        alert('Configuración de cookies: Esta página utiliza cookies esenciales para su funcionamiento.');
    });
}

// ===== RELOJ EN FOOTER =====
function initClock() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    
    function updateClock() {
        const now = new Date();
        
        // Formatear hora
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Formatear fecha
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('es-ES', options);
        
        // Actualizar elementos
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        dateElement.textContent = dateString;
    }
    
    // Actualizar cada segundo
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    const elementsToAnimate = document.querySelectorAll('.skill-card, .script-card, .about-text, .contact-info');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== MENÚ MÓVIL =====
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
    
    // Ajustar menú al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });
}

// ===== ACTUALIZAR AÑO EN FOOTER =====
document.getElementById('year').textContent = new Date().getFullYear();
