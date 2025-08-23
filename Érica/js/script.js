
    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a.nav-link, .cta-button, .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('header').offsetHeight),
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // --- Header Shrink/Color Change on Scroll ---
    const header = document.querySelector('header');
    const heroSection = document.getElementById('hero');
    const headerHeight = header.offsetHeight;

    const changeHeader = () => {
        if (window.scrollY > headerHeight) {
            header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)'; // Slightly transparent dark
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.backgroundColor = 'var(--dark-color)';
            header.style.padding = '20px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    };

    window.addEventListener('scroll', changeHeader);
    changeHeader(); // Call on load to set initial state

    // --- Active Navigation Link on Scroll (GSAP ScrollTrigger for better accuracy) ---
    // Make sure GSAP and ScrollTrigger are loaded before this part.
    // (You already have gsap.min.js in your HTML)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('section').forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onToggle: self => {
                    const id = section.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (navLink) {
                        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                        if (self.isActive) {
                            navLink.classList.add('active');
                        }
                    }
                }
            });
        });
    }


    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.createElement('div');
    mobileNavToggle.classList.add('mobile-nav-toggle');
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    header.querySelector('.container').appendChild(mobileNavToggle);

    const mobileNav = document.createElement('nav');
    mobileNav.classList.add('mobile-nav');
    mobileNav.innerHTML = header.querySelector('.desktop-nav').innerHTML;
    document.body.appendChild(mobileNav);

    mobileNavToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll'); // Prevent scrolling when mobile nav is open
        mobileNavToggle.querySelector('i').classList.toggle('fa-bars');
        mobileNavToggle.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileNavToggle.querySelector('i').classList.remove('fa-times');
            mobileNavToggle.querySelector('i').classList.add('fa-bars');
        });
    });


    // --- Video Lightbox ---
const videoLightbox = document.createElement('div');
videoLightbox.classList.add('video-lightbox');
document.body.appendChild(videoLightbox);


    // --- Image Lightbox ---
    const imageLightbox = document.createElement('div');
    imageLightbox.classList.add('image-lightbox');
    document.body.appendChild(imageLightbox);

    window.openLightbox = (imageSrc, imageTitle) => {
        imageLightbox.innerHTML = `
            <div class="image-lightbox-content">
                <span class="image-lightbox-close">&times;</span>
                <img src="${imageSrc}" alt="${imageTitle}">
                <h3 class="image-lightbox-title">${imageTitle}</h3>
            </div>
        `;
        imageLightbox.classList.add('open');
        document.body.classList.add('no-scroll'); // Prevent background scroll
    };

    imageLightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('image-lightbox') || e.target.classList.contains('image-lightbox-close')) {
            imageLightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    });

    // --- GSAP Animations (examples, you can add more!) ---
    // Hero section text animation
    if (typeof gsap !== 'undefined') {
        gsap.from(".hero-text", { duration: 1.5, y: 50, opacity: 0, ease: "power3.out" });
        gsap.from(".cta-button", { duration: 1.5, y: 50, opacity: 0, ease: "power3.out", delay: 0.5 });

        // Section titles fade in
        gsap.utils.toArray(".section-title").forEach(title => {
            gsap.from(title, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // About section content animation
        gsap.from(".sobre-texto", {
            opacity: 0,
            x: -50,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#sobre",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
        gsap.from(".sobre-imagem", {
            opacity: 0,
            x: 50,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: "#sobre",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Gallery items fade in
        gsap.utils.toArray(".video-item, .photo-item").forEach(item => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power1.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // --- Prevent body scroll when mobile nav or lightbox is open ---
    document.body.style.overflow = 'auto'; // Default state

    const updateBodyScroll = () => {
        const isMobileNavOpen = mobileNav.classList.contains('open');
        const isVideoLightboxOpen = videoLightbox.classList.contains('open');
        const isImageLightboxOpen = imageLightbox.classList.contains('open');

        if (isMobileNavOpen || isVideoLightboxOpen || isImageLightboxOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };
