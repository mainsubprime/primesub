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

    // ============================================
    // Shopping Cart Functionality
    // ============================================
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCountEl = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceEl = document.querySelector('.total-price');
    
    let cart = [];
    
    function updateCart() {
        cartCountEl.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            totalPriceEl.textContent = '$0.00';
        } else {
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price;
                itemsHTML += `
                    <div class="cart-item">
                        <p>${item.name}</p>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = itemsHTML;
            totalPriceEl.textContent = '$' + total.toFixed(2);
        }
    }
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
        
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.product-card .btn-outline');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            
            cart.push({ name: productName, price: productPrice });
            updateCart();
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#d4af37';
            this.style.color = '#ffffff';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1500);
        });
    });

    // ============================================
    // Wishlist Functionality
    // ============================================
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const wishlistSidebar = document.querySelector('.wishlist-sidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistOverlay = document.querySelector('.wishlist-overlay');
    const wishlistCountEl = document.querySelector('.wishlist-count');
    const wishlistItemsContainer = document.querySelector('.wishlist-items');
    
    let wishlist = [];
    
    function updateWishlist() {
        wishlistCountEl.textContent = wishlist.length;
        
        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<p class="wishlist-empty">Your wishlist is empty</p>';
        } else {
            let itemsHTML = '';
            
            wishlist.forEach(item => {
                itemsHTML += `
                    <div class="wishlist-item">
                        <p>${item.name}</p>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                `;
            });
            
            wishlistItemsContainer.innerHTML = itemsHTML;
        }
    }
    
    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.classList.add('active');
            wishlistOverlay.classList.add('active');
        });
        
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.classList.remove('active');
            wishlistOverlay.classList.remove('active');
        });
        
        wishlistOverlay.addEventListener('click', () => {
            wishlistSidebar.classList.remove('active');
            wishlistOverlay.classList.remove('active');
        });
    }

    // ============================================
    // Newsletter Popup
    // ============================================
    const newsletterPopup = document.querySelector('.newsletter-popup');
    const closeNewsletter = document.querySelector('.close-newsletter');
    
    if (newsletterPopup) {
        // Show popup after 3 seconds
        setTimeout(() => {
            newsletterPopup.classList.add('active');
        }, 3000);
        
        // Close popup
        if (closeNewsletter) {
            closeNewsletter.addEventListener('click', () => {
                newsletterPopup.classList.remove('active');
            });
        }
        
        // Close when clicking outside
        newsletterPopup.addEventListener('click', (e) => {
            if (e.target === newsletterPopup) {
                newsletterPopup.classList.remove('active');
            }
        });
        
        // Newsletter popup form
        const newsletterPopupForm = document.querySelector('.newsletter-popup-form');
        if (newsletterPopupForm) {
            newsletterPopupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for subscribing! You will receive 20% off your first order.');
                newsletterPopup.classList.remove('active');
            });
        }
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ============================================
    // Checkout Button
    // ============================================
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Thank you for your order! This is a demo website.');
            } else {
                alert('Your cart is empty!');
            }
        });
    }

});
