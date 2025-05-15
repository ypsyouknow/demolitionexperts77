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

            if (this.items.length <= 1) {
                this.nav.style.display = 'none';
            }

            this.init();
        }

        init() {
            this.items.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'nav-dot';
                dot.setAttribute('aria-label', `Go to item ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goTo(index));
                this.nav.appendChild(dot);
            });

            this.startAutoSwipe();

            this.carousel.addEventListener('mouseenter', () => {
                this.isPaused = true;
            });
            this.carousel.addEventListener('mouseleave', () => {
                this.isPaused = false;
            });

            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                this.isPaused = true;
            });

            this.carousel.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
                touchEndY = e.touches[0].clientY;
            });

            this.carousel.addEventListener('touchend', (e) => {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                console.log(`Carousel Swipe: deltaX=${deltaX}, deltaY=${deltaY}`);

                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                    if (deltaX > 0) {
                        this.prev();
                    } else {
                        this.next();
                    }
                    e.preventDefault();
                }

                this.isPaused = false;
            });

            this.carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    this.next();
                }
            });

            this.carousel.setAttribute('tabindex', '0');
        }

        startAutoSwipe() {
            if (this.items.length > 1) {
                this.interval = setInterval(() => {
                    if (!this.isPaused) {
                        this.next();
                    }
                }, 5000);
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
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            const dots = this.nav.querySelectorAll('.nav-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    const carousels = Array.from(document.querySelectorAll('.image-carousel')).map(
        (carousel) => new ImageCarousel(carousel)
    );

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
            modal.addEventListener('click', () => modal.remove());
            document.body.appendChild(modal);
        });
    });

    document.querySelectorAll('.image-carousel .carousel-item video').forEach(video => {
        video.style.cursor = 'pointer';

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isTap = true;

        video.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isTap = true;
        });

        video.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                isTap = false;
            }
            // Allow all swipes to pass through (vertical for scrolling, horizontal ignored)
        });

        video.addEventListener('touchend', (e) => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            console.log(`Video Touch: deltaX=${deltaX}, deltaY=${deltaY}, isTap=${isTap}`);

            if (isTap && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                // Handle tap
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
                e.preventDefault();
            }
            // No swipe handling; vertical swipes scroll the page
        });

        video.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent native video controls
        });
    });

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
