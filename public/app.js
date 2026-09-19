let currentUser = null;
let cart = [];

// --- VIEW NAVIGATION (SPA Logic) ---
function navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.style.display = 'none'; });
    document.getElementById(viewId).style.display = 'block';
    window.scrollTo(0, 0); 
}

function requireAuthTo(viewId) {
    if (currentUser) navigateTo(viewId);
    else navigateTo('view-login');
}

window.slideImages = function(btn, direction) {
    const wrapper = btn.parentElement.querySelector('.slider-wrapper');
    const scrollAmount = wrapper.clientWidth;
    wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// --- FETCH PRODUCTS ---
// --- INITIALIZE APP & EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    // Listen for the "Enter" key on the login inputs
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            login();
        }
    };

    if (usernameInput) usernameInput.addEventListener('keypress', handleEnterPress);
    if (passwordInput) passwordInput.addEventListener('keypress', handleEnterPress);
});

async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const productList = document.getElementById('product-list');
        
        productList.innerHTML = products.map(p => `
            <div class="product-card">
                <h3>${p.name}</h3>
                <div class="product-desc">${p.description}</div>
                <div class="price">$${p.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-gray" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
                    <button class="btn-blue" onclick="buyNow(${p.id}, '${p.name}', ${p.price})">Buy</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error fetching products.", err);
    }
}

// --- AUTHENTICATION ---
async function register() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(!u || !p) return alert("Enter username and password");

    const res = await fetch('/api/register', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
    });
    if(res.ok) alert("Registered successfully. Please sign in.");
    else alert("Registration failed or username exists.");
}

async function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(!u || !p) return alert("Enter username and password");

    const res = await fetch('/api/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
    });
    
    if(res.ok) {
        const data = await res.json();
        currentUser = data.user;
        
        document.getElementById('nav-auth-link').innerText = "Sign Out";
        document.getElementById('nav-auth-link').onclick = logout;
        document.getElementById('nav-cart-link').style.display = 'inline-block';
        document.getElementById('nav-orders-link').style.display = 'inline-block';
        
        navigateTo('view-shop');
    } else alert("Invalid login credentials.");
}

function logout() {
    currentUser = null;
    cart = []; updateCart();
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('nav-auth-link').innerText = "Account";
    document.getElementById('nav-auth-link').onclick = function() { navigateTo('view-login'); };
    document.getElementById('nav-cart-link').style.display = 'none';
    document.getElementById('nav-orders-link').style.display = 'none';
    
    navigateTo('view-home');
}

// --- ORDERS LOGIC ---
// --- ORDERS LOGIC ---
async function showOrders() {
    if (!currentUser) return navigateTo('view-login');
    navigateTo('view-orders');
    
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = "<p>Loading your orders...</p>";
    
    try {
        const res = await fetch(`/api/orders/${currentUser.id}`);
        const orders = await res.json();
        
        if(orders.length === 0) {
            ordersList.innerHTML = "<p style='color:#86868b; text-align:center;'>You have no previous orders.</p>";
        } else {
            ordersList.innerHTML = orders.map(o => {
                
                // Safely parse the items JSON stored in the database
                let itemsHTML = '';
                try {
                    let items = [];
                    if (o.items) {
                        items = JSON.parse(o.items);
                    }
                    
                    if (items && items.length > 0) {
                        itemsHTML = items.map(item => `
                            <div class="order-item-detail">
                                <div>
                                    <strong style="color: #fff;">${item.name}</strong>
                                    <div class="order-item-desc">${item.desc || 'Premium Apple Product'}</div>
                                </div>
                                <span>$${item.price.toFixed(2)}</span>
                            </div>
                        `).join('');
                    } else {
                        itemsHTML = "<p style='color:#86868b; font-size: 14px;'>Item details not recorded for this order.</p>";
                    }
                } catch(e) { 
                    itemsHTML = "<p style='color:#86868b;'>Details unavailable.</p>"; 
                }

                return `
                    <li class="order-card">
                        <div class="order-header">
                            <div>
                                <div class="order-id">Order #${o.id}</div>
                                <div class="order-total">$${o.total.toFixed(2)}</div>
                            </div>
                            <div class="order-status">${o.status}</div>
                        </div>
                        <button class="btn-text link-blue view-details-btn" onclick="toggleOrderDetails(${o.id})">View Order Details ⌄</button>
                        <div class="order-details" id="order-details-${o.id}" style="display: none;">
                            ${itemsHTML}
                        </div>
                    </li>
                `;
            }).join('');
        }
    } catch (err) {
        ordersList.innerHTML = "<p style='color:red'>Error loading orders.</p>";
    }
}
// Global function to show/hide order details
window.toggleOrderDetails = function(orderId) {
    const detailsDiv = document.getElementById(`order-details-${orderId}`);
    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.style.display = 'none';
    }
}

// --- CART LOGIC ---

// Helper function to create short description for order receipts
function getShortDesc(name) {
    if(name.includes('Macbook')) return "A18 Pro, 8GB RAM, 512GB SSD";
    if(name.includes('iPhone')) return "White, 256GB Storage, Super Retina XDR";
    if(name.includes('AirPods')) return "True Wireless Earbuds, Spatial Audio";
    return "Premium Apple Product";
}

function addToCart(id, name, price) {
    const desc = getShortDesc(name);
    cart.push({ id, name, price, desc });
    updateCart();
    alert(`${name} added to your bag.`);
}

function buyNow(id, name, price) {
    const desc = getShortDesc(name);
    cart.push({ id, name, price, desc });
    updateCart();
    navigateTo('view-cart');
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    document.getElementById('cart-count').innerText = cart.length;
    
    if(cart.length === 0) {
        cartItems.innerHTML = "<li><span style='color:#86868b'>Your bag is empty.</span></li>";
    } else {
        cartItems.innerHTML = cart.map(item => `<li><span>${item.name}</span> <span>$${item.price.toFixed(2)}</span></li>`).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total.toFixed(2);
}

async function checkout() {
    if (cart.length === 0) return alert("Your bag is empty.");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const res = await fetch('/api/orders', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        // UPDATED: Now sending the `cart` array as `items` to the backend!
        body: JSON.stringify({ userId: currentUser.id, total: total, items: cart }) 
    });
    
    if (res.ok) {
        alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
        cart = [];
        updateCart();
        showOrders(); // Auto-redirect to orders page to see receipt
    } else {
        alert("Error processing order.");
    }
}

updateCart();