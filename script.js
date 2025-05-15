function openWhatsApp(serviceName) {
    const phoneNumber = "919898905024";
    const message = `I need more details about ${serviceName} service. Please provide information.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    navbar.insertBefore(menuToggle, navbar.querySelector('.nav-links'));

    menuToggle.addEventListener('click', function () {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
        this.innerHTML = navLinks.classList.contains('show') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            document.querySelector('.nav-links').classList.remove('show');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Carousel Functionality
    class ImageCarousel {
        constructor(carouselElement) {
            this.carousel = carouselElement;
            this.track = carouselElement.querySelector('.carousel-track');
            this.items = Array.from(this.track.querySelectorAll('.carousel-item'));
            this.nav = carouselElement.querySelector('.carousel-nav');
            this.currentIndex = 0;
            this.interval = null;
            this.isPaused = false;

            // Hide navigation if only one image
            if (this.items.length <= 1) {
                this.nav.style.display = 'none';
            }

            this.init();
        }

        init() {
            // Create navigation dots
            this.items.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'nav-dot';
                dot.setAttribute('aria-label', `Go to image ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goTo(index));
                this.nav.appendChild(dot);
            });

            // Start auto-swiping
            this.startAutoSwipe();

            // Pause on hover
            this.carousel.addEventListener('mouseenter', () => {
                this.isPaused = true;
            });
            this.carousel.addEventListener('mouseleave', () => {
                this.isPaused = false;
            });

            // Touch events for mobile
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            this.track.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                this.isPaused = true;
            });

            this.track.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
                touchEndY = e.touches[0].clientY;
            });

            this.track.addEventListener('touchend', (e) => {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // Determine if the swipe is primarily horizontal or vertical
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    // Horizontal swipe - navigate carousel
                    if (deltaX > 0) {
                        this.prev();
                    } else {
                        this.next();
                    }
                    e.preventDefault(); // Prevent default only for horizontal swipes
                }
                // Vertical swipe - allow default scrolling behavior
                this.isPaused = false;
            });

            // Keyboard navigation
            this.carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    this.next();
                }
            });

            // Make carousel focusable
            this.carousel.setAttribute('tabindex', '0');
        }

        startAutoSwipe() {
            // Only auto-swipe if there are multiple images
            if (this.items.length > 1) {
                this.interval = setInterval(() => {
                    if (!this.isPaused) {
                        this.next();
                    }
                }, 5000); // 5 seconds
            }
        }

        goTo(index) {
            this.currentIndex = index;
            this.update();
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.update();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            this.update();
        }

        update() {
            // Update track position
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            // Update active dot
            const dots = this.nav.querySelectorAll('.nav-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    // Initialize carousels
    const carousels = Array.from(document.querySelectorAll('.image-carousel')).map(
        (carousel) => new ImageCarousel(carousel)
    );

    // Lightbox Functionality for Gallery
    document.querySelectorAll('.image-carousel .carousel-item img').forEach(img => {
        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: zoom-out;
            `;

            modal.innerHTML = `
                <img src="${img.src}" alt="${img.alt}" 
                     style="max-width: 90vw; max-height: 90vh; object-fit: contain;">
            `;

            modal.addEventListener('click', () => {
                modal.remove();
            });

            document.body.appendChild(modal);
        });
    });

    // Lightbox for Videos
    document.querySelectorAll('.image-carousel .carousel-item video').forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: zoom-out;
            `;
            modal.innerHTML = `
                <video src="${video.src}" alt="${video.alt}" style="max-width: 90vw; max-height: 90vh; object-fit: contain;" autoplay loop muted controls></video>
            `;
            modal.addEventListener('click', () => modal.remove());
            document.body.appendChild(modal);
        });
    });

    // Auto-hide navbar on scroll (mobile only)
    let lastScrollTop = 0;
    let isMobile = window.innerWidth <= 992;

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 992;
    });

    window.addEventListener('scroll', () => {
        if (!isMobile) return;

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll <= 100) {
            navbar.classList.remove('navbar-hidden');
            return;
        }

        if (currentScroll > lastScrollTop && currentScroll > 100) {
            navbar.classList.add('navbar-hidden');
            document.querySelector('.nav-links').classList.remove('show');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        } else if (currentScroll < lastScrollTop) {
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});
