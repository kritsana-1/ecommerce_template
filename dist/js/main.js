/**
 * Amerce Premium Template - Core JavaScript
 * Version: 1.0.0
 * Description: Controls Sliders, Animations, Popups, and Tabs.
 */

document.addEventListener("DOMContentLoaded", function () {
    
    // This section initializes the Hero Slider on the homepage using Swiper.js with a fade effect and autoplay.
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // This section adds effects to the text in the Hero Section using GSAP to make it look smoother and more vibrant.
    // The effect gently bounces and expands the text smoothly when the webpage successfully loads.
    gsap.from(".hero-content h5", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out"
    });

    gsap.from(".hero-content h1", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.8,
        ease: "power2.out"
    });

    gsap.from(".hero-content a", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out"
    });

    // This section controls the opening and closing of the search popup on the Shop page using GSAP for smoother display.
    const openSearchBtn = document.getElementById('open-search');
    const closeSearchBtn = document.getElementById('close-search');
    const searchPopup = document.getElementById('searchPopup');

    if (openSearchBtn && closeSearchBtn && searchPopup) {
        // Open the search window.
        openSearchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            searchPopup.classList.add('open');
            
            // Use GSAP to pull the Input box up so it pops up nicely when opened.
            gsap.fromTo(".search-popup .container", 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power3.out" }
            );
        });

        // Close the search window.
        closeSearchBtn.addEventListener('click', function () {
            searchPopup.classList.remove('open');
        });
    }

    // This section controls the opening and closing of the shopping cart drawer on the Shop page using GSAP for smoother display.
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('drawerBackdrop');

    // Function to open/close the cart drawer
    function toggleCart(show) {
        if (!cartDrawer || !backdrop) return;
        
        if (show) {
            cartDrawer.classList.add('open');
            backdrop.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevents the main webpage from scrolling while the shopping cart is open.
        } else {
            cartDrawer.classList.remove('open');
            backdrop.classList.remove('show');
            document.body.style.overflow = ''; // Restores the main webpage's scrolling functionality
        }
    }

    if (openCartBtn) {
        openCartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleCart(true);
        });
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', function () { toggleCart(false); });
    if (backdrop) backdrop.addEventListener('click', function () { toggleCart(false); });

    // This is the product tab section on the Shop page (using GSAP to add a beautiful gradual appearance to each product card when switching tabs).
    const tabButtons = document.querySelectorAll('.nav-tabs-custom button');
    
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function (event) {
            // Find specific product cards in the currently open tab.
            const activeItems = document.querySelectorAll('.tab-pane.active .product-item');
            
            if (activeItems.length > 0) {
                // The effect gently fades in and slides up each product card (Stagger) with a premium style
                gsap.fromTo(activeItems, 
                    { 
                        opacity: 0, 
                        y: 30 
                    }, 
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        stagger: 0.1, // There's a 0.1-second delay between each card, allowing them to appear in a wave-like sequence.
                        ease: "power2.out" 
                    }
                );
            }
        });
    });

    // The product filtering section on the Shop page (Price Range + Category Filter)
    const priceRange = document.getElementById('priceRange');
    const priceRangeLabel = document.getElementById('priceRangeLabel');
    const categoryButtons = document.querySelectorAll('.filter-category button');
    const shopProducts = Array.from(document.querySelectorAll('.shop-grid .product-item'));

    function formatCurrency(value) {
        return `$${Math.round(value)}`;
    }

    // This function filters the products in the shop based on the selected price range and category. It checks if each product's price and category match the selected filters and shows or hides them accordingly, with a smooth animation using GSAP.
    function filterShopProducts() {
        if (!priceRange || shopProducts.length === 0) return;

        const [min, max] = priceRange.noUiSlider.get().map(Number);
        const activeCategory = document.querySelector('.filter-category button.active')?.dataset.category || 'all';

        shopProducts.forEach(product => {
            const productPrice = Number(product.dataset.price) || 0;
            const productCategory = product.dataset.category || 'all';
            const fitsPrice = productPrice >= min && productPrice <= max;
            const fitsCategory = activeCategory === 'all' || productCategory === activeCategory;

            if (fitsPrice && fitsCategory) {
                product.style.display = '';
                gsap.to(product, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            } else {
                gsap.to(product, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.out', onComplete() {
                    product.style.display = 'none';
                }});
            }
        });
    }

    // This section initializes the price range slider using noUiSlider and updates the product display based on the selected price range.
    if (priceRange && typeof noUiSlider !== 'undefined') {
        noUiSlider.create(priceRange, {
            start: [25, 220],
            connect: true,
            range: {
                min: 10,
                max: 250
            },
            step: 5,
            tooltips: [true, true],
            format: {
                to: value => `$${Math.round(value)}`,
                from: value => Number(value.replace('$', ''))
            }
        });

        priceRange.noUiSlider.on('update', function (values) {
            priceRangeLabel.textContent = `${values[0]} — ${values[1]}`;
        });

        priceRange.noUiSlider.on('change', function () {
            filterShopProducts();
        });
    }

    // This section adds an active class to the selected category button and filters the products accordingly when a category button is clicked.
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterShopProducts();
        });
    });

    // This section explains how to add effects to the slides in the Shop Hero Slider using GSAP.
    const heroSlideItems = document.querySelectorAll('.shop-hero-slider .swiper-slide');

    if (heroSlideItems.length) {
        gsap.from('.shop-hero-slider .hero-slide', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }

});