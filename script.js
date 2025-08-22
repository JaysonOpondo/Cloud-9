document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('open');
        });

        // Close mobile menu when a nav link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('open');
            });
        });
    }

    // 2. Header Scroll Effect
    // This changes the header's appearance when the user scrolls down.
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Search Overlay
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsDiv = document.getElementById('search-results');

    
    const products = [
        { name: "Urban Joggers", price: "Ksh 3500", img: "https://placehold.co/300x300/e9e9e9/555?text=Urban+Joggers" },
        { name: "Classic Tee", price: "Ksh 1500", img: "https://placehold.co/300x300/e9e9e9/555?text=Classic+Tee" },
        { name: "Streetwear Hoodie", price: "Ksh 2800", img: "https://placehold.co/300x300/e9e9e9/555?text=Streetwear+Hoodie" },
        { name: "Denim Jacket", price: "Ksh 4200", img: "https://placehold.co/300x300/e9e9e9/555?text=Denim+Jacket" },
        { name: "Cargo Shorts", price: "Ksh 2100", img: "https://placehold.co/300x300/e9e9e9/555?text=Cargo+Shorts" },
        { name: "Minimalist Sweatshirt", price: "Ksh 2900", img: "https://placehold.co/300x300/e9e9e9/555?text=Minimalist+Sweatshirt" },
        { name: "Flowy Trousers", price: "Ksh 2700", img: "https://placehold.co/300x300/e9e9e9/555?text=Flowy+Trousers" },
        { name: "Relaxed Shirt", price: "Ksh 2500", img: "https://placehold.co/300x300/e9e9e9/555?text=Relaxed+Shirt" },
    ];

    searchIcon.addEventListener('click', (e) => {
        e.preventDefault(); 
        searchOverlay.classList.add('active');
        searchInput.focus(); 
        searchResultsDiv.innerHTML = ''; 
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        searchResultsDiv.innerHTML = ''; 

        if (query.trim() === '') {
            searchResultsDiv.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product-item');
                productElement.innerHTML = `
                    <img src="${product.img}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                `;
                searchResultsDiv.appendChild(productElement);
            });
        } else {
            searchResultsDiv.innerHTML = '<p>No products found matching your search.</p>';
        }
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 5. Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountSpan = document.querySelector('.cart-count');

    const updateCartCount = () => {
        cartCountSpan.textContent = cart.length;
    };

    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productName = productItem.dataset.name;
                const productPrice = parseFloat(productItem.dataset.price);
                const productImage = productItem.querySelector('img').src;

                const existingItemIndex = cart.findIndex(item => item.name === productName);

                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                alertMessage('Item added to cart!');
            }
        });
    });

    function alertMessage(message) {
        const alertBox = document.createElement('div');
        alertBox.classList.add('custom-alert');
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        alertBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;

        setTimeout(() => {
            alertBox.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.addEventListener('transitionend', () => alertBox.remove());
        }, 3000);
    }

    updateCartCount();
});