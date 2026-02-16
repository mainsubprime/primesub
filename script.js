// ============================================
// Prime Hair Brand - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ============================================
    // Smooth Scrolling for Navigation Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.product-card, .service-card, .testimonial-card, .about-image, .about-text');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Product Card Animation on Hover
    // ============================================
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // Add to Cart Button Animation
    // ============================================
    const addToCartButtons = document.querySelectorAll('.btn-outline');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store original text
            const originalText = this.textContent;
            
            // Change to added message
            this.textContent = 'Added!';
            this.style.backgroundColor = '#d4af37';
            this.style.color = '#ffffff';
            this.style.borderColor = '#d4af37';
            
            // Revert after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
            }, 2000);
        });
    });

    // ============================================
    // Contact Form Submission
    // ============================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('0'); // This won't work properly, let's use querySelector
            
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const messageTextarea = this.querySelector('textarea');
            
            // Simple validation
            if (nameInput.value && emailInput.value && messageTextarea.value) {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            }
        });
    }

    // ============================================
    // Newsletter Form Submission
    // ============================================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    });

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // Parallax Effect for Hero Section
    // ============================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }

    // ============================================
    // Counter Animation for Stats (if needed)
    // ============================================
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Initialize counters when they come into view
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target, 2000);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ============================================
    // Staggered Animation for Product Cards
    // ============================================
    const productCardsAll = document.querySelectorAll('.product-card');
    productCardsAll.forEach((card, index) => {
        card.style.transitionDelay = (index * 0.1) + 's';
    });

    // ============================================
    // Form Input Focus Effect
    // ============================================
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // ============================================
    // Scroll to Top Button
    // ============================================
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #d4af37;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    });

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to scroll top button
    scrollTopButton.addEventListener('mouseenter', () => {
        scrollTopButton.style.transform = 'translateY(-5px)';
    });

    scrollTopButton.addEventListener('mouseleave', () => {
        scrollTopButton.style.transform = 'translateY(0)';
    });

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c Welcome to Prime Hair Brand! ', 'background: #d4af37; color: #1a1a1a; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Thank you for visiting our website! ', 'background: #1a1a1a; color: #d4af37; font-size: 14px; padding: 5px;');

});
