/**
 * Laboratory 6 - DOM Scripting
 * E-commerce Application with Vanilla JavaScript
 * 
 * Name: [Your Name]
 * Section: [Your Section]
 * Date: [Current Date]
 * 
 * This JavaScript makes the e-commerce website work.
 * It handles products, shopping cart, checkout, and account pages.
 */

// ========================================
// TASK 1: PRODUCT DATA (Make products dynamic)
// ========================================

/**
 * Product Class - Like a blueprint to create product objects
 * 
 * Instead of hardcoding HTML, we create a blueprint for each product
 */
class Product {
    constructor(id, name, price, image, description, category) {
        this.id = id;           // Product number (1, 2, 3...)
        this.name = name;       // Product name
        this.price = price;     // Price (number only, CSS adds ₱ sign)
        this.image = image;     // Image filename
        this.description = description;  // Product description
        this.category = category;        // Type: spray, lotion, or wipes
    }
}

/**
 * Products Array - Contains all products
 * 
 * Required: Must have 10 products
 * Each product is created using the Product class above
 */
const products = [
    new Product(1, "OFF!® Overtime", 12.99, "download.jpg", 
        "Long-lasting protection for outdoor activities. Provides up to 8 hours of mosquito protection.",
        "spray"),
    
    new Product(2, "OFF!® Baby", 9.99, "download1.jpg",
        "Gentle formula for babies and sensitive skin. Safe for the whole family.",
        "lotion"),
    
    new Product(3, "OFF!® FamilyCare", 14.99, "download2.jpg",
        "Family-friendly protection for all ages. Perfect for family outings.",
        "spray"),
    
    new Product(4, "OFF!® Sakura-No-Hana Lotion", 8.99, "download4.jpg",
        "Plant-based protection with a gentle formula. Pleasant scent.",
        "lotion"),
    
    new Product(5, "OFF!® Sakura-No-Hana Spritz", 7.99, "download5.jpg",
        "Refreshing spray with plant-based ingredients. Light fragrance.",
        "spray"),
    
    new Product(6, "OFF!® Active Sport", 11.99, "download.jpg",
        "Sweat-resistant formula for active individuals. Great for sports.",
        "spray"),
    
    new Product(7, "OFF!® Kids", 10.99, "download1.jpg",
        "Formulated for children ages 2 and up. Gentle protection.",
        "lotion"),
    
    new Product(8, "OFF!® Family Wipes", 6.99, "download2.jpg",
        "Convenient wipes for on-the-go protection. Easy to apply.",
        "wipes"),
    
    new Product(9, "OFF!® Deep Woods", 13.99, "download4.jpg",
        "Maximum protection for camping and hiking. Long-lasting.",
        "spray"),
    
    new Product(10, "OFF!® Sensitive Skin", 12.49, "download5.jpg",
        "Fragrance-free for sensitive skin. Gentle yet effective.",
        "lotion")
];

// ========================================
// TASK 3: SHOPPING CART (Shopping functionality)
// ========================================

// Cart array - Stores items added to cart
let cart = [];

// Load cart - Gets saved cart so it doesn't disappear after refresh
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart - Saves cart to use on other pages
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show message - Displays notification (ex: "Added to cart!")
function showMessage(message, type) {
    // Create message container if it doesn't exist
    let container = document.getElementById('message-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'message-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Create the message element
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.padding = '12px 20px';
    msg.style.borderRadius = '8px';
    msg.style.marginTop = '10px';
    msg.style.cursor = 'pointer';
    msg.style.fontFamily = 'Arial, sans-serif';
    msg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // Color depends on message type
    if (type === 'success') {
        msg.style.backgroundColor = '#28a745';  // Green - success
        msg.style.color = 'white';
    } else if (type === 'error') {
        msg.style.backgroundColor = '#d9534f';  // Red - error
        msg.style.color = 'white';
    } else {
        msg.style.backgroundColor = '#ff6600';  // Orange - info
        msg.style.color = 'white';
    }
    
    container.appendChild(msg);
    
    // Disappears after 3 seconds
    setTimeout(() => msg.remove(), 3000);
    msg.onclick = () => msg.remove();  // Click to remove immediately
}

// Add to cart - Adds product to cart
function addToCart(productId, productName, productPrice, quantity = 1) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // If already in cart, just increase quantity
        existingItem.quantity += quantity;
        showMessage(productName + ' quantity updated!', 'success');
    } else {
        // If not in cart, add as new item
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
        });
        showMessage(productName + ' added to cart!', 'success');
    }
    
    saveCart();
    updateCartCount();
}

// Remove from cart - Removes product from cart
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        // filter() - creates new array without the removed item
        cart = cart.filter(item => item.id !== productId);
        showMessage(item.name + ' removed from cart', 'info');
        saveCart();
        updateCartCount();
        
        // If on cart page, refresh the display
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
        // If on checkout page, refresh the summary
        if (window.location.pathname.includes('checkout')) {
            updateCheckoutSummary();
        }
    }
}

// Update quantity - Changes quantity of product
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        // If quantity is 0, remove the item
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            
            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
            if (window.location.pathname.includes('checkout')) {
                updateCheckoutSummary();
            }
        }
    }
}

/**
 * Calculate totals - Calculates total price
 * 
 * reduce() method - Used to add all item prices in cart
 * Like a for loop but shorter
 */
function calculateTotals() {
    // reduce() - starts at 0, then adds price × quantity for each item
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 0 ? 50 : 0;  // ₱50 shipping if cart not empty
    const tax = subtotal * 0.08;              // 8% tax
    const total = subtotal + shipping + tax;   // Grand total
    
    return { subtotal, shipping, tax, total };
}

// Update cart count - Shows number of items in cart badge
function updateCartCount() {
    // Count total items in cart
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const cartLinks = document.querySelectorAll('nav a[href="cart.html"]');
    
    cartLinks.forEach(link => {
        if (cartCount > 0) {
            // Create badge if it doesn't exist
            let badge = link.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.backgroundColor = '#ff6600';
                badge.style.color = 'white';
                badge.style.borderRadius = '50%';
                badge.style.padding = '2px 6px';
                badge.style.fontSize = '0.7rem';
                badge.style.marginLeft = '5px';
                link.appendChild(badge);
            }
            badge.textContent = cartCount;  // Set the count
        } else {
            // Remove badge if cart is empty
            const badge = link.querySelector('.cart-badge');
            if (badge) badge.remove();
        }
    });
}

// ========================================
// TASK 2: PRODUCTS PAGE (products.html)
// ========================================

/**
 * Render products - Shows all products on products.html
 * 
 * This is the most important function for Task 2
 * 
 * Steps:
 * 1. Find the container (products-container)
 * 2. Clear the container
 * 3. Loop through each product (using forEach)
 * 4. Create elements for each product (createElement)
 * 5. Add elements to the page (appendChild)
 */
function renderProducts() {
    // Step 1: Find the container where products will go
    const productContainer = document.querySelector('.products-container');
    if (!productContainer) return;
    
    // Step 2: Clear the container (to avoid duplicates)
    productContainer.innerHTML = '';
    
    // Step 3: Loop through each product (forEach method)
    products.forEach(product => {
        // Step 4: Create elements for the product card
        const productCard = document.createElement('article');
        productCard.className = 'product-card';
        
        // Product image
        const productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.alt = product.name;
        
        // Product name
        const productTitle = document.createElement('h2');
        productTitle.textContent = product.name;
        
        // Product description (shorten if too long)
        const productDesc = document.createElement('p');
        productDesc.className = 'product-description';
        productDesc.textContent = product.description.length > 80 
            ? product.description.substring(0, 80) + '...' 
            : product.description;
        
        // Product price
        const productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        productPrice.textContent = product.price.toFixed(2);
        
        // View Details button
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Details';
        viewBtn.className = 'view-details';
        viewBtn.setAttribute('data-id', product.id);
        
        // Add to Cart button (has data attributes to get info)
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add to Cart';
        addBtn.className = 'add-to-cart-btn';
        addBtn.setAttribute('data-id', product.id);
        addBtn.setAttribute('data-name', product.name);
        addBtn.setAttribute('data-price', product.price);
        
        // Step 5: Add elements to product card (appendChild)
        productCard.appendChild(productImg);
        productCard.appendChild(productTitle);
        productCard.appendChild(productDesc);
        productCard.appendChild(productPrice);
        productCard.appendChild(viewBtn);
        productCard.appendChild(addBtn);
        
        // Add product card to container
        productContainer.appendChild(productCard);
    });
    
    // Add event listeners to buttons
    attachProductEventListeners();
    attachFilterEventListeners();
}

// Event listeners for product buttons
function attachProductEventListeners() {
    // View Details buttons - go to detail page
    const viewButtons = document.querySelectorAll('.view-details');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            sessionStorage.setItem('selectedProductId', productId);  // Save ID
            window.location.href = 'detail.html';  // Go to detail page
        });
    });
    
    // Add to Cart buttons - add to cart
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            addToCart(productId, productName, productPrice);
            
            // Task 6: Animation effect - card flashes when clicked
            const productCard = this.closest('.product-card');
            if (productCard) {
                productCard.classList.add('fade-in');
                setTimeout(() => {
                    productCard.classList.remove('fade-in');
                }, 500);
            }
        });
    });
}

// Filter functionality - filters products by price and category
function attachFilterEventListeners() {
    const filterForm = document.querySelector('.sidebar form');
    if (!filterForm) return;
    
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();  // So page doesn't reload
        
        // Get selected filters
        const priceFilter = document.querySelector('input[name="price"]:checked');
        const categoryFilter = document.querySelector('input[name="category"]:checked');
        
        let filteredProducts = [...products];
        
        // Filter by category
        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
        }
        
        // Filter by price
        if (priceFilter) {
            filteredProducts = filteredProducts.filter(p => {
                if (priceFilter.value === 'under-10') return p.price < 10;
                if (priceFilter.value === '10-15') return p.price >= 10 && p.price <= 15;
                if (priceFilter.value === 'above-15') return p.price > 15;
                return true;
            });
        }
        
        // Show filtered products
        renderFilteredProducts(filteredProducts);
    });
}

// Show filtered products
function renderFilteredProducts(filteredProducts) {
    const productContainer = document.querySelector('.products-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    // If no matches, show message
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = '<div class="no-products">No products match your filters.</div>';
        return;
    }
    
    // Show matched products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('article');
        productCard.className = 'product-card';
        
        const productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.alt = product.name;
        
        const productTitle = document.createElement('h2');
        productTitle.textContent = product.name;
        
        const productDesc = document.createElement('p');
        productDesc.className = 'product-description';
        productDesc.textContent = product.description.length > 80 
            ? product.description.substring(0, 80) + '...' 
            : product.description;
        
        const productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        productPrice.textContent = product.price.toFixed(2);
        
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Details';
        viewBtn.className = 'view-details';
        viewBtn.setAttribute('data-id', product.id);
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add to Cart';
        addBtn.className = 'add-to-cart-btn';
        addBtn.setAttribute('data-id', product.id);
        addBtn.setAttribute('data-name', product.name);
        addBtn.setAttribute('data-price', product.price);
        
        productCard.appendChild(productImg);
        productCard.appendChild(productTitle);
        productCard.appendChild(productDesc);
        productCard.appendChild(productPrice);
        productCard.appendChild(viewBtn);
        productCard.appendChild(addBtn);
        
        productContainer.appendChild(productCard);
    });
    
    attachProductEventListeners();
}

// ========================================
// TASK 3: CART PAGE (cart.html)
// ========================================

// Show cart items on cart.html
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    // If cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-message">Your cart is currently empty</div>';
        updateCartSummary();
        return;
    }
    
    // Show each item in cart
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <img src="${product ? product.image : 'download.jpg'}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <label>Qty:</label>
                <input type="number" min="1" value="${item.quantity}" class="quantity-input">
            </div>
            <div class="item-total">${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" data-id="${item.id}">×</button>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    // When quantity changes
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            updateCartQuantity(productId, newQuantity);
        });
    });
    
    // When remove button is clicked
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    updateCartSummary();
}

// Update cart summary (subtotal, tax, total)
function updateCartSummary() {
    const totals = calculateTotals();
    
    const subtotalEl = document.querySelector('.summary-row:first-child span:last-child');
    const totalEl = document.querySelector('.summary-total span:last-child');
    
    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;
    
    const summaryRows = document.querySelectorAll('.summary-row');
    if (summaryRows.length >= 2) {
        const shippingRow = summaryRows[0];
        const taxRow = summaryRows[1];
        if (shippingRow) shippingRow.querySelector('span:last-child').textContent = `₱${totals.shipping.toFixed(2)}`;
        if (taxRow) taxRow.querySelector('span:last-child').textContent = `₱${totals.tax.toFixed(2)}`;
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            if (cart.length > 0) {
                window.location.href = 'checkout&shipping.html';
            } else {
                showMessage('Your cart is empty!', 'error');
            }
        };
    }
}

// ========================================
// TASK 4: CHECKOUT PAGE (checkout&shipping.html)
// ========================================

// Initialize checkout form with validation
function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    updateCheckoutSummary();
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // PREVENT DEFAULT: stop page from reloading
        
        // SELECTION: get all form fields using querySelector
        const name = document.getElementById('name');
        const address = document.getElementById('address');
        const city = document.getElementById('municipality');
        const province = document.getElementById('province');
        const zip = document.getElementById('zip');
        const country = document.getElementById('country');
        const payment = document.querySelector('input[name="payment"]:checked');
        
        let isValid = true;
        
        // Clear old errors
        const oldErrors = document.querySelectorAll('.error-message');
        oldErrors.forEach(err => err.remove());
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        // Helper function to show error
        function showError(input, message) {
            if (!input) return;
            input.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            input.parentNode.appendChild(errorSpan);
            isValid = false;
        }
        
        // VALIDATION: check if fields are empty
        if (!name.value.trim()) showError(name, 'Full name is required');
        if (!address.value.trim()) showError(address, 'Street address is required');
        if (!city.value.trim()) showError(city, 'City is required');
        if (!province.value.trim()) showError(province, 'Province is required');
        if (!zip.value.trim()) showError(zip, 'Postal code is required');
        if (!country.value) showError(country, 'Please select a country');
        if (!payment) showError(document.querySelector('.payment-options'), 'Please select a payment method');
        if (cart.length === 0) {
            showMessage('Your cart is empty!', 'error');
            isValid = false;
        }
        
        // If all fields are valid
        if (isValid) {
            console.log('=== ORDER PLACED SUCCESSFULLY ===');
            console.log('Customer:', name.value);
            console.log('Address:', address.value, city.value, province.value);
            console.log('Payment:', payment.value);
            console.log('Items:', cart);
            console.log('Total:', calculateTotals().total);
            
            showMessage('Order placed successfully! Thank you for shopping!', 'success');
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
            
            // Go back to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 2000);
        }
    });
}

// Update checkout summary with cart items
function updateCheckoutSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item-cart';
            itemDiv.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₱${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(itemDiv);
        });
    }
    
    const totals = calculateTotals();
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `₱${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₱${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;
}

// ========================================
// TASK 5: USER ACCOUNT (account.html)
// ========================================

// Mock user data with orderHistory array
const currentUser = {
    name: "Lyndel Carpio",
    orderHistory: [
        { id: 1001, date: "Feb. 13, 2026", total: 520.00, items: ["Lotion", "Shampoo"], status: "Delivered" },
        { id: 1000, date: "Jan. 25, 2026", total: 320.00, items: ["OFF! Baby"], status: "Delivered" },
        { id: 999, date: "Dec. 12, 2025", total: 150.00, items: ["OFF! FamilyCare"], status: "Delivered" }
    ]
};

// Initialize account page
function initAccountPage() {
    // DYNAMIC GREETING: update welcome message with user's name
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentUser.name}!`;
    }
    
    // EXPANDING ORDERS: add click listeners to summary elements
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        if (summary && !details.hasAttribute('data-listener')) {
            details.setAttribute('data-listener', 'true');
            summary.addEventListener('click', function() {
                if (!details.hasAttribute('data-expanded')) {
                    details.setAttribute('data-expanded', 'true');
                    
                    const orderId = details.id.replace('order-', '');
                    const order = currentUser.orderHistory.find(o => o.id == orderId);
                    
                    // DYNAMIC INJECTION: add order details using innerHTML
                    if (order && !details.querySelector('.dynamic-details')) {
                        const dynamicContent = document.createElement('div');
                        dynamicContent.className = 'dynamic-details';
                        dynamicContent.style.marginTop = '15px';
                        dynamicContent.style.padding = '15px';
                        dynamicContent.style.backgroundColor = '#f9f9f9';
                        dynamicContent.style.borderRadius = '8px';
                        dynamicContent.innerHTML = `
                            <p><strong>Order #${order.id}</strong></p>
                            <p>Date: ${order.date}</p>
                            <p>Total: ₱${order.total.toFixed(2)}</p>
                            <p>Items: ${order.items.join(', ')}</p>
                            <p>Status: ${order.status}</p>
                        `;
                        details.appendChild(dynamicContent);
                    }
                }
            });
        }
    });
    
    // Update order history list
    const orderHistoryList = document.getElementById('order-history-list');
    if (orderHistoryList && currentUser.orderHistory) {
        orderHistoryList.innerHTML = '';
        currentUser.orderHistory.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `Order #${order.id} — ₱${order.total.toFixed(2)} — ${order.date}`;
            orderHistoryList.appendChild(li);
        });
    }
}

// ========================================
// TASK 6: PRODUCT DETAIL PAGE (detail.html)
// ========================================

// Show product details
function renderProductDetail() {
    const productId = sessionStorage.getItem('selectedProductId');
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    // Update page with product info
    const titleEl = document.getElementById('product-title');
    const imgEl = document.getElementById('product-img');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');
    
    if (titleEl) titleEl.textContent = product.name;
    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
    }
    if (priceEl) priceEl.textContent = product.price.toFixed(2);
    if (descEl) descEl.textContent = product.description;
    
    // Add to Cart form
    const addForm = document.getElementById('add-to-cart-form');
    if (addForm) {
        addForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const qtyInput = document.getElementById('quantity');
            const quantity = parseInt(qtyInput.value) || 1;
            
            addToCart(product.id, product.name, product.price, quantity);
            
            // TASK 6: Animation feedback
            const container = document.getElementById('product-detail-container');
            if (container) {
                container.classList.add('fade-in');
                setTimeout(() => {
                    container.classList.remove('fade-in');
                }, 500);
            }
            
            qtyInput.value = 1;
        });
    }
    
    // Review form
    const ratingSlider = document.getElementById('rating');
    const ratingValue = document.getElementById('rating-value');
    if (ratingSlider && ratingValue) {
        ratingSlider.addEventListener('input', function() {
            ratingValue.textContent = this.value;
        });
    }
    
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const reviewText = document.getElementById('review-text');
            const rating = document.getElementById('rating');
            
            if (reviewText.value.trim()) {
                const reviewsContainer = document.getElementById('reviews-container');
                const newReview = document.createElement('div');
                newReview.className = 'review-item';
                newReview.innerHTML = `
                    <p><strong>${currentUser.name}</strong>: <span>${reviewText.value}</span></p>
                    <p>Rating: ${rating ? rating.value : 0}/5 ★</p>
                    <small>${new Date().toLocaleDateString()}</small>
                `;
                reviewsContainer.appendChild(newReview);
                reviewText.value = '';
                if (rating) rating.value = 0;
                if (ratingValue) ratingValue.textContent = '0';
                showMessage('Thank you for your review!', 'success');
            } else {
                showMessage('Please write a review first', 'error');
            }
        });
    }
}

// ========================================
// TASK 6: LANDING PAGE (landing.html)
// ========================================

// Show products on landing page
function renderLandingPage() {
    const featuredContainer = document.querySelector('.featured-products .product-list');
    const discountedContainer = document.querySelector('.discounted-products .product-list');
    
    // Show featured products (first 3)
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        const featuredProducts = products.slice(0, 3);
        featuredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                <span class="price">${product.price.toFixed(2)}</span>
                <button class="view-details" data-id="${product.id}">View Details</button>
            `;
            
            const viewBtn = card.querySelector('.view-details');
            viewBtn.addEventListener('click', function() {
                sessionStorage.setItem('selectedProductId', product.id);
                window.location.href = 'detail.html';
            });
            
            featuredContainer.appendChild(card);
        });
    }
    
    // Show discounted products (next 3)
    if (discountedContainer) {
        discountedContainer.innerHTML = '';
        const discountedProducts = products.slice(3, 6);
        discountedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                <span class="price">${product.price.toFixed(2)}</span>
                <span class="discount">SALE</span>
                <button class="view-details" data-id="${product.id}">View Details</button>
            `;
            
            const viewBtn = card.querySelector('.view-details');
            viewBtn.addEventListener('click', function() {
                sessionStorage.setItem('selectedProductId', product.id);
                window.location.href = 'detail.html';
            });
            
            discountedContainer.appendChild(card);
        });
    }
    
    // Shop Now button (if exists)
    const shopNowBtn = document.querySelector('.hero button');
    if (shopNowBtn) {
        shopNowBtn.onclick = () => window.location.href = 'products.html';
    }
}

// ========================================
// ADD CSS ANIMATION STYLES (TASK 6)
// ========================================

// Add animation styles to page
function addAnimationStyles() {
    if (!document.getElementById('lab6-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'lab6-animation-styles';
        style.textContent = `
            .fade-in {
                animation: fadeIn 0.5s ease;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .error {
                border-color: #d9534f !important;
                background-color: rgba(217,83,79,0.08) !important;
            }
            
            .error-message {
                color: #d9534f;
                font-size: 0.85rem;
                margin-top: 5px;
                display: block;
                animation: fadeIn 0.3s ease;
            }
            
            .empty-cart-message {
                text-align: center;
                padding: 40px;
                color: #666;
                font-size: 1.1rem;
            }
            
            .cart-badge {
                transition: all 0.3s ease;
            }
            
            .no-products {
                text-align: center;
                padding: 60px;
                font-size: 1.2rem;
                color: #666;
                grid-column: 1 / -1;
            }
            
            .order-item-cart {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            
            button:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// INITIALIZATION - STARTS EVERYTHING
// ========================================

// When page loads, start everything
document.addEventListener('DOMContentLoaded', function() {
    loadCart();              // Load saved cart
    addAnimationStyles();    // Add animations
    updateCartCount();       // Update cart badge
    
    const path = window.location.pathname;
    
    // Run the right function for each page
    if (path.includes('products.html')) {
        renderProducts();           // TASK 2: Products page
    } 
    else if (path.includes('cart.html')) {
        renderCart();               // TASK 3: Cart page
    }
    else if (path.includes('detail.html')) {
        renderProductDetail();      // TASK 6: Product detail page
    }
    else if (path.includes('checkout')) {
        initCheckoutForm();         // TASK 4: Checkout page
    }
    else if (path.includes('account.html')) {
        initAccountPage();          // TASK 5: Account page
    }
    else if (path.includes('landing.html') || path === '/' || path === '/index.html') {
        renderLandingPage();        // TASK 6: Landing page
    }
    
    // Sync cart across tabs (if user opens multiple tabs)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            loadCart();
            updateCartCount();
            if (path.includes('cart.html')) renderCart();
            if (path.includes('checkout')) updateCheckoutSummary();
        }
    });
});