// MAIN SCRIPT mejorado: formulario funcional con EmailJS, partículas adaptativas, modo claro mejorado

/* Helpers */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

// Variable global para las partículas
let particleAnimation = null;

/* Wait DOM */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready - EmailJS loaded:', typeof emailjs !== 'undefined');
    
    // Verificar que EmailJS está cargado
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado correctamente');
    } else {
        console.log('EmailJS inicializado correctamente');
    }

    /* ---------- PARTICLES (mejorado y adaptativo) ---------- */
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
    const filterButtons = $all('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function(){
                $all('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                const scriptCards = $all('.script-card');
                
                scriptCards.forEach(card => {
                    if(filter === 'all' || card.dataset.category === filter){
                        card.style.display = 'block';
                        setTimeout(() => { 
                            card.style.opacity = '1'; 
                            card.style.transform = 'translateY(0)'; 
                        }, 40);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    /* ---------- FORMULARIO (funcional) ---------- */
    const contactForm = $('#contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = $('#submitBtn');
            const btnText = $('#btnText');
            const btnLoader = $('#btnLoader');
            
            if (!submitBtn || !btnText || !btnLoader) {
                showNotification('Error: Elementos del formulario no encontrados', 'error');
                return;
            }

            // Mostrar loading
            submitBtn.disabled = true;
            btnText.textContent = 'Enviando...';
            btnLoader.classList.remove('hidden');

            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const company = $('#company').value.trim();
            const message = $('#message').value.trim();

            const errors = validateForm({name, email, message});
            if(errors.length){
                showNotification(errors.join('. '), 'error');
                // Restaurar botón
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar Mensaje';
                btnLoader.classList.add('hidden');
                return;
            }

            try {
                console.log('Intentando enviar email...');
                
                // Guardar en localStorage como respaldo
                const saved = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                saved.push({
                    name,
                    email, 
                    company,
                    message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('contactMessages', JSON.stringify(saved));
                console.log('Mensaje guardado en localStorage');

                // Intentar enviar por EmailJS
                const result = await sendEmail({name, email, company, message});
                console.log('Email enviado correctamente:', result);
                
                showNotification('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Error completo:', error);
                console.error('Error status:', error.status);
                console.error('Error text:', error.text);
                
                let errorMessage = 'Mensaje guardado localmente. ';
                
                if (error.status === 0) {
                    errorMessage += 'Error de conexión. Verifica tu internet.';
                } else if (error.status === 400) {
                    errorMessage += 'Error en la configuración del email.';
                } else if (error.status === 401) {
                    errorMessage += 'Error de autenticación. Verifica tus credenciales de EmailJS.';
                } else if (error.status === 402) {
                    errorMessage += 'Límite de emails alcanzado.';
                } else {
                    errorMessage += 'Error al enviar email: ' + (error.text || error.message || 'Error desconocido');
                }
                
                showNotification(errorMessage, 'info');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar Mensaje';
                btnLoader.classList.add('hidden');
            }
        });
    }

    /* ---------- COOKIES (persistente) ---------- */
    const cookiesBanner = $('#cookiesBanner');
    const cookieAccept = $('#cookieAccept');
    const cookieSettings = $('#cookieSettings');

    if (cookiesBanner && cookieAccept && cookieSettings) {
        setTimeout(() => {
            if(localStorage.getItem('cookiesAccepted') !== 'true'){
                cookiesBanner.classList.remove('hidden');
            }
        }, 900);

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiesBanner.classList.add('hidden');
            showNotification('Preferencias de cookies guardadas', 'success');
        });
        
        cookieSettings.addEventListener('click', () => {
            showNotification('Panel de configuración de cookies (simulado)', 'info');
        });
    }

    /* ---------- THEME from localStorage ---------- */
    const themeToggle = $('#themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme');
        
        if(savedTheme === 'light'){ 
            document.body.classList.add('light-mode'); 
            if (themeIcon) {
                themeIcon.classList.replace('fa-moon','fa-sun');
            }
        }

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            if (themeIcon) {
                if(isLight){ 
                    themeIcon.classList.replace('fa-moon','fa-sun'); 
                    localStorage.setItem('theme','light'); 
                } else { 
                    themeIcon.classList.replace('fa-sun','fa-moon'); 
                    localStorage.setItem('theme','dark'); 
                }
            }
            
            // Reiniciar partículas cuando cambia el tema
            initParticles();
        });
    }

    /* ---------- FLOATING BTN ---------- */
    const floatingBtn = $('#floatingBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300){ 
                floatingBtn.style.opacity = '1'; 
                floatingBtn.style.visibility = 'visible'; 
            } else { 
                floatingBtn.style.opacity = '0'; 
                floatingBtn.style.visibility = 'hidden'; 
            }
        });
    }

    /* ---------- ANIMACIONES ON SCROLL ---------- */
    function animateOnScroll(){
        const elements = $all('.skill-card, .script-card, .about-content, .contact-content');
        elements.forEach(el => {
            if (el) {
                const rect = el.getBoundingClientRect();
                const screenPosition = window.innerHeight / 1.3;
                if(rect.top < screenPosition){ 
                    el.style.opacity = '1'; 
                    el.style.transform = 'translateY(0)'; 
                }
            }
        });
    }

    // Inicializar animaciones
    const animatedElements = $all('.skill-card, .script-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });

    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    /* ---------- FOOTER YEAR + CLOCK ---------- */
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    startClock();
});

/* ------------------- EMAIL FUNCTION ------------------- */
async function sendEmail(formData) {
    console.log('Iniciando envío de email...');
    console.log('Datos del formulario:', formData);
    
    // Solo intentar enviar email si EmailJS está disponible
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está definido');
        throw new Error('EmailJS no está cargado correctamente. Verifica que el script esté incluido.');
    }

    // Verificar que emailjs.send existe
    if (typeof emailjs.send !== 'function') {
        console.error('emailjs.send no es una función');
        throw new Error('EmailJS no está inicializado correctamente');
    }

    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'No especificada',
        message: formData.message,
        to_email: 'danielvargasdemiguel@gmail.com',
        reply_to: formData.email
    };

    console.log('Parámetros del template:', templateParams);
    console.log('Service ID:', 'service_0yae93w');
    console.log('Template ID:', 'template_z8fuguv');

    try {
        // USA TUS IDs REALES AQUÍ:
        const result = await emailjs.send(
            'service_0yae93w',     // Tu Service ID
            'template_z8fuguv',    // Template ID - cámbialo si es diferente
            templateParams
        );
        
        console.log('EmailJS response:', result);
        return result;
        
    } catch (error) {
        console.error('Error detallado de EmailJS:');
        console.error('Status:', error.status);
        console.error('Text:', error.text);
        console.error('Full error:', error);
        throw error;
    }
}

/* ------------------- VALIDATION ------------------- */
function validateForm({name, email, message}){
    const errors = [];
    if(!name || name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email)) {
        errors.push('Introduce un email válido');
    }
    
    if(!message || message.length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

/* ------------------- NOTIFICATIONS ------------------- */
function showNotification(msg, type = 'info'){
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = msg;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 18px;
        border-radius: 8px;
        color: #fff;
        z-index: 10050;
        font-weight: 700;
        transform: translateX(100%);
        opacity: 0;
        box-shadow: 0 8px 30px rgba(0,0,0,0.25);
        transition: all 0.3s ease;
    `;
    
    // Colores según el tipo
    switch(type) {
        case 'success':
            notification.style.background = '#16a34a';
            break;
        case 'error':
            notification.style.background = '#dc2626';
            break;
        default:
            notification.style.background = '#0ea5a4';
    }
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 50);
    
    // Animación de salida después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/* ------------------- CAROUSEL ------------------- */
function initCarousel(){
    const slides = $all('.carousel-slide');
    const dots = $all('.dot');
    const prev = $('#carouselPrev');
    const next = $('#carouselNext');
    
    if (slides.length === 0) return;
    
    let currentIndex = slides.findIndex(s => s.classList.contains('active'));
    if(currentIndex === -1) {
        currentIndex = 0;
        slides[0].classList.add('active');
        if (dots.length > 0) dots[0].classList.add('active');
    }
    
    let carouselTimer = null;

    function goToSlide(index){
        // Validar índice
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remover clase active de todos
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        // Añadir clase active al slide y dot actual
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
    }

    function nextSlide(){
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide(){
        goToSlide(currentIndex - 1);
    }

    // Event listeners para botones
    if (next) {
        next.addEventListener('click', () => {
            nextSlide();
            resetCarouselTimer();
        });
    }
    
    if (prev) {
        prev.addEventListener('click', () => {
            prevSlide();
            resetCarouselTimer();
        });
    }

    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetCarouselTimer();
        });
    });

    function startCarouselTimer(){ 
        carouselTimer = setInterval(nextSlide, 8000); 
    }
    
    function resetCarouselTimer(){ 
        clearInterval(carouselTimer); 
        startCarouselTimer(); 
    }

    startCarouselTimer();
}

/* ------------------- CLOCK ------------------- */
function startClock(){
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    
    function updateClock(){
        const now = new Date();
        
        // Formatear hora
        const timeStr = now.toLocaleTimeString('es-ES', {
            hour12: false,
            timeZone: 'Europe/Madrid'
        });
        
        // Formatear fecha
        const dateStr = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Madrid'
        });
        
        if(clockEl) clockEl.textContent = timeStr;
        if(dateEl) {
            dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* ------------------- PARTICLES (canvas mejorado) ------------------- */
function initParticles(){
    // Cancelar animación anterior si existe
    if (particleAnimation) {
        cancelAnimationFrame(particleAnimation);
    }
    
    const canvas = document.getElementById('particleCanvas');
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.max(40, Math.floor((width * height) / 90000));
    
    // Configuración basada en el tema
    const isLightMode = document.body.classList.contains('light-mode');
    
    // Colores diferentes para cada modo
    const darkModeColors = ['rgba(100, 255, 218,', 'rgba(138, 255, 223,', 'rgba(76, 201, 240,'];
    const lightModeColors = ['rgba(15, 118, 110,', 'rgba(13, 148, 136,', 'rgba(20, 184, 166,'];
    const currentColors = isLightMode ? lightModeColors : darkModeColors;

    // Crear partículas
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.8 + Math.random() * 2.2,
            velocityX: (Math.random() - 0.5) * 0.4,
            velocityY: (Math.random() - 0.5) * 0.4,
            alpha: 0.15 + Math.random() * 0.5,
            color: currentColors[Math.floor(Math.random() * currentColors.length)]
        });
    }

    function handleResize(){ 
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Recrear partículas al redimensionar
        particles.length = 0;
        for(let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.8 + Math.random() * 2.2,
                velocityX: (Math.random() - 0.5) * 0.4,
                velocityY: (Math.random() - 0.5) * 0.4,
                alpha: 0.15 + Math.random() * 0.5,
                color: currentColors[Math.floor(Math.random() * currentColors.length)]
            });
        }
    }

    window.addEventListener('resize', handleResize);

    function animateParticles(){
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar y actualizar partículas
        for(const particle of particles){
            // Actualizar posición
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            
            // Rebote en los bordes
            if(particle.x < -50) particle.x = width + 50;
            if(particle.x > width + 50) particle.x = -50;
            if(particle.y < -50) particle.y = height + 50;
            if(particle.y > height + 50) particle.y = -50;
            
            // Dibujar partícula
            ctx.beginPath();
            ctx.fillStyle = particle.color + particle.alpha + ')';
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Conexiones entre partículas cercanas
            for(const otherParticle of particles){
                const distanceX = particle.x - otherParticle.x;
                const distanceY = particle.y - otherParticle.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if(distance < 100){
                    ctx.beginPath();
                    ctx.strokeStyle = particle.color + (0.1 * (1 - distance/100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            }
        }
        
        particleAnimation = requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}