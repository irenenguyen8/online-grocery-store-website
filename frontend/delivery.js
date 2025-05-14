// Load cart from local storage
let cart = [];

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && JSON.parse(savedCart).length > 0) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    
    // Disable submit button if cart is empty
    const submitButton = document.getElementById('submit-order');
    if (count === 0) {
        submitButton.classList.add('disabled');
        submitButton.disabled = true;
    } else {
        submitButton.classList.remove('disabled');
        submitButton.disabled = false;
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    const form = document.getElementById('delivery-form');
    
    // Reset all error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate name
    const nameInput = document.getElementById('recipient-name');
    if (!nameInput.value.trim()) {
        document.getElementById('name-error').textContent = 'Recipient name is required';
        isValid = false;
    }
    
    // Validate email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate mobile
    const mobileInput = document.getElementById('mobile');
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileInput.value)) {
        document.getElementById('mobile-error').textContent = 'Please enter a valid 10-digit mobile number';
        isValid = false;
    }
    
    // Validate street
    const streetInput = document.getElementById('street');
    if (!streetInput.value.trim()) {
        document.getElementById('street-error').textContent = 'Street address is required';
        isValid = false;
    }
    
    // Validate city
    const cityInput = document.getElementById('city');
    if (!cityInput.value.trim()) {
        document.getElementById('city-error').textContent = 'City/Suburb is required';
        isValid = false;
    }
    
    // Validate state
    const stateInput = document.getElementById('state');
    if (!stateInput.value) {
        document.getElementById('state-error').textContent = 'Please select a state/territory';
        isValid = false;
    }
    
    // Validate postcode
    const postcodeInput = document.getElementById('postcode');
    const postcodeRegex = /^[0-9]{4}$/;
    if (!postcodeRegex.test(postcodeInput.value)) {
        document.getElementById('postcode-error').textContent = 'Please enter a valid 4-digit postcode';
        isValid = false;
    }
    
    return isValid;
}

async function checkInventory() {
    try {
      const encodedCart = encodeURIComponent(JSON.stringify(cart));
  
      const response = await fetch(`http://localhost:3000/api/checkInventory?cart=${encodedCart}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error checking inventory:', error);
      return { 
        success: false, 
        error: 'Failed to connect to server',
        outOfStockItems: []
      };
    }
  }
  
async function placeOrder(formData) {
    try {
        // Send order to server and update inventory
        const response = await fetch('http://localhost:3000/api/update-inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });        
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error placing order:', error);
        return { success: false, error: 'Failed to connect to server' };
    }
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('cart-total').textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} / unit</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Empty cart
function emptyCart() {
    cart = [];
    renderCartItems();
    updateCartCount();
    localStorage.removeItem('cart');
}

// Submit delivery form
async function submitDeliveryForm(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submit-order');
    const originalText = submitButton.textContent;

    // Validate form
    if (!validateForm()) {
        return;
    }    
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Check inventory before proceeding
    const inventoryCheck = await checkInventory();

    if (!inventoryCheck.success) {
        // Show out of stock messa
        if (!inventoryCheck.success) {
            if (inventoryCheck.outOfStockItems) {
                const stockMessages = inventoryCheck.outOfStockItems.map(item => {
                    return `${item.name} (only ${item.remainingStock} left)`;
                }).join(", ");
                alert(`Sorry, the following items are insufficient in stock: ${stockMessages}. You will be redirected to your cart.`);
            } else {
                alert('Some items in your cart are no longer available. You will be redirected to your cart.');
            }
            
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            // Redirect to cart
            window.location.href = 'index.html';
            return;
        }        

    }

    // Collect form data
    const formData = {
        name: document.getElementById('recipient-name').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postcode: document.getElementById('postcode').value
    };
    
    // Place order
    const result = await placeOrder(formData);
    
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
    
    if (result.success) {
        // Clear cart
        emptyCart();
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    } else {
        // Show error
        alert(result.error || 'There was an error processing your order. Please try again.');
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkCartNotEmpty()) return;

    loadCartFromLocalStorage();
    setupLogoNavigation();

    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', submitDeliveryForm);
    }

    const backButton = document.getElementById('back-to-cart');
    if (backButton) {
        backButton.addEventListener('click', () => window.location.href = 'index.html');
    }

    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');

    if (cartButton && cartModal && closeModal) {
        cartButton.addEventListener('click', () => {
            renderCartItems();
            cartModal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => cartModal.style.display = 'none');

        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    const emptyCartBtn = document.getElementById('empty-cart');
    if (emptyCartBtn) emptyCartBtn.addEventListener('click', emptyCart);

    const checkoutButton = document.getElementById('proceed-to-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                cartModal.style.display = 'none';
            } else {
                alert('Your cart is empty');
            }
        });
    }
});

// Redirect if cart is empty
function checkCartNotEmpty() {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart || JSON.parse(savedCart).length === 0) {
        // Cart is empty, redirect to homepage
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Function to handle logo click
function setupLogoNavigation() {
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check current page
            const currentPage = window.location.pathname;
            
            // If we're on the index page, go to login
            if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
                window.location.href = 'login.html';
            } else {
                // Otherwise, go to homepage
                window.location.href = 'index.html';
            }
        });
    }
}

