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

    // Carrossel de diplomas (rolagem contínua + modal)
    const diplomaTrack = document.querySelector('.diploma-track');
    const diplomaPrev = document.querySelector('.diploma-nav.prev');
    const diplomaNext = document.querySelector('.diploma-nav.next');

    if (diplomaTrack) {
        // Duplicar itens para looping suave
        const originalCards = Array.from(diplomaTrack.children);
        if (diplomaTrack.children.length === originalCards.length) {
            originalCards.forEach(card => diplomaTrack.appendChild(card.cloneNode(true)));
        }

        const getStep = () => {
            const card = diplomaTrack.querySelector('.diploma-card');
            return card ? card.getBoundingClientRect().width + 14 : diplomaTrack.clientWidth * 0.8;
        };

        const maxHalf = () => diplomaTrack.scrollWidth / 2;

        const scrollToNext = () => {
            stopLoop();
            const step = getStep();
            if (diplomaTrack.scrollLeft + step >= maxHalf() - 4) {
                diplomaTrack.scrollLeft = 0;
            } else {
                diplomaTrack.scrollLeft += step;
            }
            setTimeout(startLoop, 400);
        };

        const scrollToPrev = () => {
            stopLoop();
            const step = getStep();
            if (diplomaTrack.scrollLeft - step <= 0) {
                diplomaTrack.scrollLeft = maxHalf();
            } else {
                diplomaTrack.scrollLeft -= step;
            }
            setTimeout(startLoop, 400);
        };

        diplomaNext?.addEventListener('click', scrollToNext);
        diplomaPrev?.addEventListener('click', scrollToPrev);

        // Rolagem contínua usando requestAnimationFrame
        let rafId = null;
        let speed = window.matchMedia('(max-width: 900px)').matches ? 1.6 : 2.4; // px/frame
        const loop = () => {
            diplomaTrack.scrollLeft += speed;
            const limit = diplomaTrack.scrollWidth / 2;
            if (diplomaTrack.scrollLeft >= limit) {
                diplomaTrack.scrollLeft = 0;
            }
            rafId = requestAnimationFrame(loop);
        };
        const startLoop = () => { if (!rafId) rafId = requestAnimationFrame(loop); };
        const stopLoop = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };
        startLoop();

        // Modal de zoom
        const modal = document.querySelector('.diploma-modal');
        const modalImg = modal?.querySelector('img');
        const modalClose = modal?.querySelector('.diploma-modal__close');

        const openModal = (src, alt) => {
            if (!modal || !modalImg) return;
            modalImg.src = src;
            modalImg.alt = alt || 'Diploma';
            modal.classList.add('open');
            document.body.classList.add('modal-open');
            stopLoop();
        };

        const closeModal = () => {
            if (!modal) return;
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
            startLoop();
        };

        diplomaTrack.querySelectorAll('.diploma-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const imgEl = card.querySelector('img');
                if (imgEl) openModal(imgEl.src, imgEl.alt);
            });
        });

        modal?.addEventListener('click', (e) => {
            if (e.target.classList.contains('diploma-modal__backdrop') || e.target === modal) {
                closeModal();
            }
        });
        modalClose?.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
        });

        // Reajusta velocidade ao mudar viewport
        window.addEventListener('resize', () => {
            speed = window.matchMedia('(max-width: 900px)').matches ? 0.9 : 0.65;
        });
    }
});
