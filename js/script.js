// Script premium para comportamento moderno, animações e UX avançada
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const progress = document.getElementById('scroll-progress');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Smooth scroll on page sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (navLinksContainer.classList.contains('open')) {
                navLinksContainer.classList.remove('open');
            }
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('open');
            const expanded = navLinksContainer.classList.contains('open');
            mobileToggle.setAttribute('aria-expanded', expanded);
        });
    }

    // Botão flutuante: voltar ao topo com animação suave
    const topFloat = document.querySelector('.top-float');
    if (topFloat) {
        topFloat.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll progress bar
    const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percentage = (scrollTop / docHeight) * 100;
        if (progress) progress.style.width = `${percentage}%`;
    };
    window.addEventListener('scroll', updateProgress);
    updateProgress();

    // Scroll reveal cards
    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.service-card, .testimonial-card, .price-card, .faq-item');
    cards.forEach(card => {
        card.classList.add('hidden-card');
        observer.observe(card);
    });
});
