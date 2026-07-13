document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBIEL MENU ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navMenu.classList.remove('active');
        });
    });

    // --- SCROLL ANIMATIES ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .product-row, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `.fade-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(styleSheet);
    
    // --- CONTACT FORMULIER ---
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const naam = document.getElementById('name').value;
            alert(`Bedankt ${naam}! We hebben je bericht ontvangen. We nemen zo snel mogelijk contact op.`);
            contactForm.reset();
        });
    }

    // --- WINKELWAGEN LOGICA (CART) ---
    
    // 1. Initialiseer winkelwagen data
    let cart = JSON.parse(localStorage.getItem('auralisCart')) || [];
    updateCartCount();

    // 2. Toevoegen aan winkelwagen (Productpagina)
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(product);
        });
    });

    function addToCart(product) {
        // Check of product al in cart zit
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            alert("Dit product zit al in je winkelwagen.");
        } else {
            cart.push(product);
            localStorage.setItem('auralisCart', JSON.stringify(cart));
            updateCartCount();
            alert("Product toegevoegd aan winkelwagen!");
        }
    }

    function updateCartCount() {
        const countSpan = document.getElementById('cart-count');
        if(countSpan) {
            countSpan.innerText = cart.length;
        }
    }

    // 3. Render winkelwagen (Winkelwagen pagina)
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartSummary = document.getElementById('cart-summary');

    if (cartContainer) {
        renderCartPage();
    }

    function renderCartPage() {
        cartContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
            cartSummary.style.display = 'none';
        } else {
            emptyMsg.style.display = 'none';
            cartSummary.style.display = 'block';

            cart.forEach((item, index) => {
                total += item.price;
                const itemHTML = `
                    <div class="cart-item fade-in">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-details">
                            <h4>${item.name}</h4>
                            <p>€ ${item.price.toFixed(2)}</p>
                        </div>
                        <button class="btn btn-danger" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartContainer.innerHTML += itemHTML;
            });

            // Update prijzen
            document.getElementById('subtotal-price').innerText = '€ ' + total.toFixed(2);
            document.getElementById('total-price').innerText = '€ ' + total.toFixed(2);
        }
    }

    // Functie global beschikbaar maken zodat de HTML onclick hem kan vinden
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('auralisCart', JSON.stringify(cart));
        updateCartCount();
        renderCartPage();
    }

    window.checkout = function() {
        if(cart.length > 0) {
            alert("Bedankt voor je bestelling! We sturen je door naar de betaalpagina (Demo).");
            cart = [];
            localStorage.setItem('auralisCart', JSON.stringify(cart));
            updateCartCount();
            renderCartPage();
        }
    }
});