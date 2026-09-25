// Toy Haven uses one shared script. Each page runs only its own setup function.
// JSON converts arrays to text for localStorage and back again when the page loads.
function readList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return []; // A damaged saved value should not stop the website loading.
    }
}

function saveList(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        showMessage('Your browser could not save this change. Please allow site storage.');
        return false;
    }
}

// Keep the original cart structure: each entry represents one unit of a product.
let cart = readList('toyCart').filter(item => item && inventory.some(p => p.id === item.id));
let wishlist = readList('toyWish').filter(item => item && inventory.some(p => p.id === item.id));
let messageTimer;
const money = amount => '$' + amount.toFixed(2);

function showMessage(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => { toast.textContent = ''; }, 4000);
}

function updateCounters() {
    document.getElementById('cart-count').textContent = cart.length;
    document.getElementById('wish-count').textContent = wishlist.length;
}

function addToCart(id) {
    const product = inventory.find(item => item.id === id);
    if (!product) return;
    const nextCart = [...cart, product];
    if (!saveList('toyCart', nextCart)) return;
    cart = nextCart;
    updateCounters();
    showMessage(product.name + ' added to cart.');
}

function addToWishlist(id) {
    if (wishlist.some(item => item.id === id)) {
        showMessage('This product is already in your wishlist.');
        return;
    }
    const product = inventory.find(item => item.id === id);
    if (!product) return;
    const nextWish = [...wishlist, { id, status: 'Interested' }];
    if (!saveList('toyWish', nextWish)) return;
    wishlist = nextWish;
    updateCounters();
    showMessage(product.name + ' saved to your wishlist.');
}

// Reused on the home, products and wishlist pages.
function generateCards(products, containerId, isWishlist = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!products.length) {
        container.innerHTML = `<div class="empty"><h2>${isWishlist ? 'Your collection starts here.' : 'No products found.'}</h2><p>${isWishlist ? 'Save something you love from our products page.' : 'Try another name or category.'}</p><a href="products.html" class="btn">Explore products</a></div>`;
        return;
    }
    // Home cards sit below a section heading; listing cards sit below the page heading.
    const headingTag = containerId === 'featured-products' ? 'h3' : 'h2';
    // Only our fixed inventory is inserted into HTML. Form values are never inserted here.
    container.innerHTML = products.map(item => `<article class="card">
        <button class="card-image" data-action="details" data-id="${item.id}" aria-label="View details for ${item.name}"><img src="${item.img}" alt="Product photo of ${item.name}" width="400" height="380" loading="lazy"></button>
        <div class="card-body"><p class="category">${item.category}</p><${headingTag}>${item.name}</${headingTag}><p class="price">${money(item.price)}</p>
        <div class="card-btns"><button class="btn-cart" data-action="cart" data-id="${item.id}">Add to cart</button><button class="btn-wish" data-action="${isWishlist ? 'remove-wish' : 'wish'}" data-id="${item.id}">${isWishlist ? 'Remove' : 'Wishlist +'}</button></div>
        ${isWishlist ? `<label for="status-${item.id}">Collection status</label><select id="status-${item.id}" data-wish-id="${item.id}">${['Interested','Owned','Not Interested'].map(status => `<option${(wishlist.find(p => p.id === item.id).status || 'Interested') === status ? ' selected' : ''}>${status}</option>`).join('')}</select>` : ''}</div></article>`).join('');
}

function showProduct(id) {
    const product = inventory.find(item => item.id === id);
    if (!product) return;
    document.getElementById('modal-content').innerHTML = `<img src="${product.img}" alt="Product photo of ${product.name}"><p class="eyebrow">${product.category}</p><h2 id="modal-title">${product.name}</h2><p>${product.description}</p><p class="price">${money(product.price)}</p><div class="card-btns"><button class="btn" data-action="cart" data-id="${id}">Add to cart</button><button class="secondary" data-action="wish" data-id="${id}">Save to wishlist</button></div>`;
    document.getElementById('product-dialog').showModal();
}

function setupProducts() {
    const search = document.getElementById('search-catalog');
    if (!search) return;
    const category = document.getElementById('category-filter');
    const requestedCategory = new URLSearchParams(location.search).get('category');
    if ([...category.options].some(option => option.value === requestedCategory)) category.value = requestedCategory;
    function filterProducts() {
        const result = inventory.filter(item => item.name.toLowerCase().includes(search.value.trim().toLowerCase()) && (category.value === 'All' || item.category === category.value));
        generateCards(result, 'all-products');
        document.getElementById('result-count').textContent = result.length + ' products found';
    }
    search.addEventListener('input', filterProducts);
    category.addEventListener('change', filterProducts);
    document.getElementById('catalog-form').addEventListener('submit', event => event.preventDefault());
    filterProducts();
}

function renderWishlist() {
    generateCards(inventory.filter(product => wishlist.some(item => item.id === product.id)), 'wishlist-products', true);
}

// Group identical products to display quantity, while keeping simple saved data.
function cartRows() {
    return inventory.map(product => ({ ...product, quantity: cart.filter(item => item.id === product.id).length })).filter(product => product.quantity > 0);
}
function cartTotal() {
    return cartRows().reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0) / 100;
}
function summaryHTML() {
    return cartRows().map(item => `<div class="summary-line"><span>${item.name} &times; ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join('') + `<div class="summary-line"><span>Delivery</span><span>Free (demo)</span></div><div class="total-line"><span>Total</span><span>${money(cartTotal())}</span></div>`;
}
function renderCart() {
    const container = document.getElementById('cart-content');
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = '<div class="empty"><h2>Your cart is empty.</h2><p>Find a little something that makes you smile.</p><a class="btn" href="products.html">Explore products</a></div>';
        return;
    }
    container.innerHTML = `<div class="two-columns"><section class="panel" aria-label="Cart items">${cartRows().map(item => `<article class="cart-row"><img src="${item.img}" alt="Product photo of ${item.name}"><div class="cart-details"><h2>${item.name}</h2><p>${money(item.price)} each</p><button class="remove" data-action="remove-cart" data-id="${item.id}" aria-label="Remove ${item.name}">Remove</button></div><div class="quantity"><button data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">&minus;</button><span>${item.quantity}</span><button data-action="increase" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button></div><strong>${money(item.price * item.quantity)}</strong></article>`).join('')}<button class="remove" data-action="clear">Clear cart</button></section><aside class="panel"><h2>Cart summary</h2>${summaryHTML()}<a class="btn" href="checkout.html">Proceed to checkout &rarr;</a><a href="products.html">Continue shopping</a></aside></div>`;
}

function changeCart(action, id) {
    let nextCart = [...cart];
    if (action === 'increase') nextCart.push(inventory.find(item => item.id === id));
    if (action === 'decrease') {
        const index = nextCart.findIndex(item => item.id === id);
        if (index !== -1) nextCart.splice(index, 1);
    }
    if (action === 'remove-cart') nextCart = nextCart.filter(item => item.id !== id);
    if (action === 'clear') nextCart = [];
    if (!saveList('toyCart', nextCart)) return;
    cart = nextCart;
    updateCounters();
    renderCart();
    const nextButton = document.querySelector(`[data-action="${action}"][data-id="${id}"]`) || document.querySelector('#cart-content a');
    if (nextButton) nextButton.focus();
    showMessage('Cart updated. Total: ' + money(cartTotal()));
}

// Use HTML validity rules plus trimmed text checks for readable custom feedback.
function validateForm(form, messageId) {
    const message = document.getElementById(messageId);
    for (const field of form.querySelectorAll('input, textarea, select')) {
        field.value = field.value.trim();
        field.removeAttribute('aria-invalid');
    }
    for (const field of form.querySelectorAll('input, textarea, select')) {
        if (!field.checkValidity() || (field.minLength > 0 && field.value.length < field.minLength)) {
            message.className = 'error';
            message.textContent = field.type === 'email' ? 'Please enter a valid email address.' : 'Please complete ' + (field.labels[0]?.textContent || 'this field').toLowerCase() + (field.minLength > 0 ? ' (at least ' + field.minLength + ' characters).' : '.');
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', messageId);
            field.focus();
            return false;
        }
    }
    message.className = '';
    message.textContent = '';
    return true;
}

function setupForms() {
    const newsletter = document.getElementById('newsletter-form');
    newsletter.addEventListener('submit', event => {
        event.preventDefault();
        if (!validateForm(newsletter, 'newsletter-status')) return;
        const email = newsletter.elements.email.value.toLowerCase();
        const emails = readList('toyNewsletter');
        if (!emails.includes(email)) emails.push(email);
        if (!saveList('toyNewsletter', emails)) return;
        document.getElementById('newsletter-status').textContent = 'You are subscribed! Saved on this device.';
        newsletter.reset();
    });
    const support = document.getElementById('support-form');
    if (support) support.addEventListener('submit', event => {
        event.preventDefault();
        if (!validateForm(support, 'support-status')) return;
        const feedback = readList('toyFeedback');
        feedback.push({ name:support.elements.name.value, email:support.elements.email.value, message:support.elements.message.value, date:new Date().toISOString() });
        if (!saveList('toyFeedback', feedback)) return;
        document.getElementById('support-status').textContent = 'Thank you! Your feedback has been saved on this device.';
        support.reset();
    });
    const checkout = document.getElementById('checkout-form');
    if (!checkout) return;
    document.getElementById('order-summary').innerHTML = summaryHTML();
    if (!cart.length) {
        checkout.querySelector('button[type="submit"]').disabled = true;
        document.getElementById('checkout-message').textContent = 'Your cart is empty. Add a product before checking out.';
    }
    checkout.addEventListener('submit', event => {
        event.preventDefault();
        if (!cart.length || !validateForm(checkout, 'checkout-message')) return;
        const order = { id:Date.now(), date:new Date().toISOString(), customer:checkout.elements.fullName.value, email:checkout.elements.email.value, address:checkout.elements.address.value, payment:checkout.elements.payment.value, items:cartRows(), total:cartTotal() };
        const orders = readList('toyOrders');
        orders.push(order);
        if (!saveList('toyOrders', orders)) return;
        // Clear the cart only after saving the order successfully.
        if (!saveList('toyCart', [])) return;
        cart = [];
        updateCounters();
        document.getElementById('checkout-layout').hidden = true;
        document.getElementById('order-reference').textContent = 'Order TH-' + order.id + ' | Total ' + money(order.total);
        const success = document.getElementById('order-success');
        success.hidden = false;
        success.focus();
    });
}

function setupHome() {
    if (!document.getElementById('featured-products')) return;
    generateCards(inventory.slice(0, 4), 'featured-products');
    // The day number selects one product and changes only at local midnight.
    const now = new Date();
    const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    const pick = inventory[dayNumber % inventory.length];
    document.getElementById('daily-product').innerHTML = `<img src="${pick.img}" alt="Product photo of ${pick.name}" width="120" height="120"><div><h3>${pick.name}</h3><p>${money(pick.price)}</p><button class="btn" data-action="details" data-id="${pick.id}">Take a closer look</button></div>`;
    const banners = [
        ['Bring joy home.', 'Find your next favourite figurine and give your shelf a little character.', 'Figurines', 'iron-man'],
        ['Big ideas. Little bricks.', 'Make room for imagination with toys for everyday adventures.', 'Toys', 'classic-bricks'],
        ['Let game night begin.', 'Gather your favourite people. Discover your next favourite board game.', 'Board Games', 'catan'],
        ['Your dream garage, smaller.', 'Explore diecast cars and find the next addition to your collection.', 'Diecast Cars', 'tesla']
    ];
    let current = 0;
    let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function displayBanner() {
        const [title, text, category, picture] = banners[current];
        document.getElementById('hero-title').textContent = title;
        document.getElementById('hero-text').textContent = text;
        document.getElementById('hero-image').src = 'images/products/' + picture + '.webp';
        document.getElementById('hero-image').alt = category + ' product photograph';
        document.getElementById('hero-link').href = 'products.html?category=' + encodeURIComponent(category);
        document.getElementById('banner-count').textContent = (current + 1) + ' / 4';
    }
    function moveBanner(step) { current = (current + step + banners.length) % banners.length; displayBanner(); }
    document.getElementById('previous-banner').addEventListener('click', () => moveBanner(-1));
    document.getElementById('next-banner').addEventListener('click', () => moveBanner(1));
    const pause = document.getElementById('pause-banner');
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.addEventListener('click', () => { paused = !paused; pause.textContent = paused ? 'Play' : 'Pause'; });
    setInterval(() => { if (!paused && !document.hidden && !document.querySelector('.hero').contains(document.activeElement)) moveBanner(1); }, 6000);
    displayBanner();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCounters();
    setupHome();
    setupProducts();
    renderCart();
    renderWishlist();
    setupForms();
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
        const open = document.getElementById('nav-links').classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(open));
    });
    document.getElementById('close-dialog').addEventListener('click', () => document.getElementById('product-dialog').close());
    // One listener handles product buttons, even when cards are generated later.
    document.addEventListener('click', event => {
        const button = event.target.closest('[data-action]');
        if (button) {
            const id = Number(button.dataset.id);
            const action = button.dataset.action;
            if (action === 'cart') addToCart(id);
            if (action === 'wish') addToWishlist(id);
            if (action === 'details') showProduct(id);
            if (['increase','decrease','remove-cart','clear'].includes(action)) changeCart(action, id);
            if (action === 'remove-wish') {
                const nextWish = wishlist.filter(item => item.id !== id);
                if (!saveList('toyWish', nextWish)) return;
                wishlist = nextWish;
                updateCounters();
                renderWishlist();
                showMessage('Product removed from wishlist.');
            }
        }
        const faq = event.target.closest('.faq-toggle');
        if (faq) {
            const expanded = faq.getAttribute('aria-expanded') !== 'true';
            faq.setAttribute('aria-expanded', String(expanded));
            document.getElementById(faq.getAttribute('aria-controls')).hidden = !expanded;
            faq.querySelector('span').textContent = expanded ? '-' : '+';
        }
    });
    document.addEventListener('change', event => {
        if (!event.target.matches('[data-wish-id]')) return;
        const nextWish = wishlist.map(item => item.id === Number(event.target.dataset.wishId) ? { ...item, status:event.target.value } : item);
        if (saveList('toyWish', nextWish)) { wishlist = nextWish; showMessage('Collection status saved.'); }
    });
    // Content stays visible if this optional animation API is unavailable.
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
        }), { threshold:0.1 });
        document.querySelectorAll('main > section').forEach(section => observer.observe(section));
    }
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Offline support unavailable:', error));
    }
});
