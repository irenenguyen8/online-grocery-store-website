// Toast notification function to show a temporary popup message (toast) to the user
function showToast(message, type = 'info') {
    const toast = document.createElement('div');  // Create a new <div> element to represent the toast
    toast.className = `toast toast-${type}`;      // Set a class based on the type of toast (e.g., 'info', 'success', 'error')
    toast.textContent = message;                  // Set the text content of the toast
    document.body.appendChild(toast);             // Add the toast to the page

    setTimeout(() => {                            // Add a small delay before showing the toast (so the CSS transition can apply)
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {                            // After 3 seconds, hide the toast and then remove it from the DOM
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Global variables
let products = [];
let categories = [];
let cart = [];
let currentCategory = 'all';
let currentSubcategory = null;

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const productsContainer = document.getElementById('products-container');
const categoryList = document.getElementById('category-list');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const emptyCartBtn = document.getElementById('empty-cart');
const orderButton = document.getElementById('order-button');
const currentCategoryTitle = document.getElementById('current-category');

// Load categories from server
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/category');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        categories = data;
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
        
        // Fallback to mock categories if server request fails
        categories = [
            {
                id: 'all',
                name: 'All Products',
                subcategories: []
            },
            {
                id: 1,
                name: 'Beverages',
                subcategories: [
                    { id: 1, name: 'Coffee & Tea' },
                    { id: 2, name: 'Juices' },
                    { id: 3, name: 'Soda & Soft Drinks' }
                ]
            },
            {
                id: 2,
                name: 'Fresh Food',
                subcategories: [
                    { id: 4, name: 'Fruits' },
                    { id: 5, name: 'Vegetables' },
                    { id: 6, name: 'Dairy & Eggs' },
                    { id: 7, name: 'Meat & Poultry' }
                ]
            },
            {
                id: 3,
                name: 'Frozen Food',
                subcategories: [
                    { id: 8, name: 'Ice Cream' },
                    { id: 9, name: 'Frozen Meals' },
                    { id: 10, name: 'Frozen Vegetables' }
                ]
            },
        ];
        
        renderCategories();
    }
}

// Render categories to sidebar
function renderCategories() {
    // Clear the existing categories in the sidebar
    categoryList.innerHTML = '';
    
    // Loop through each category in the 'categories' array
    categories.forEach(category => {
        // Create a list item (li) for the category
        const li = document.createElement('li');
        li.className = 'category-item';
        li.dataset.category = category.id;
        
        // Create a header div for the category
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header'; 
        
        // Add the category name inside a span
        const nameSpan = document.createElement('span');
        nameSpan.className = 'category-name';
        nameSpan.textContent = category.name;
        categoryHeader.appendChild(nameSpan); // Add name to the header
        
        // Check if the category has subcategories
        if (category.subcategories && category.subcategories.length > 0) {
            // Create an arrow (expander) to show/hide subcategories
            const expander = document.createElement('span');
            expander.className = 'category-expander';
            expander.innerHTML = '&#9662;'; // Down arrow (can be changed to &#9656; for right arrow)
            categoryHeader.appendChild(expander); // Add arrow to header
            
            li.appendChild(categoryHeader); // Add header to list item
            
            // Create a list to hold subcategories
            const subcategoryUl = document.createElement('ul');
            subcategoryUl.className = 'subcategory-list';
            
             // Loop through each subcategory
            category.subcategories.forEach(subcategory => {
                const subLi = document.createElement('li');
                subLi.className = 'subcategory-item';
                subLi.dataset.category = category.id;
                subLi.dataset.subcategory = subcategory.id;
                subLi.textContent = subcategory.name;
                
                // When subcategory is clicked
                subLi.addEventListener('click', function(e) {
                    e.stopPropagation();  // Prevent click from bubbling to parent
                    // Remove 'active' class from all items
                    document.querySelectorAll('.category-item, .subcategory-item').forEach(item => item.classList.remove('active'));
                    this.classList.add('active'); // Mark clicked subcategory as active
                    filterProductsBySubcategory(category.id, subcategory.id); // Filter products
                    currentCategoryTitle.textContent = `${category.name} > ${subcategory.name}`; // Update the title above products
                    
                    // Save selections to localStorage
                    localStorage.setItem('selectedCategory', category.id);
                    localStorage.setItem('selectedSubcategory', subcategory.id);
                });

                subcategoryUl.appendChild(subLi);
            });
            
            li.appendChild(subcategoryUl);
            
                // Toggle subcategories on click
            categoryHeader.addEventListener('click', function(e) {
                const subcategoriesList = li.querySelector('.subcategory-list');
                const expanderIcon = this.querySelector('.category-expander');
                
                if (li.classList.contains('expanded')) {
                    li.classList.remove('expanded');
                    expanderIcon.innerHTML = '&#9662;'; // Down arrow
                } else {
                    li.classList.add('expanded');
                    expanderIcon.innerHTML = '&#9652;'; // Up arrow
                }
                
                // Also load all products from that category
                document.querySelectorAll('.category-item, .subcategory-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                filterProductsByCategory(category.id);
                currentCategoryTitle.textContent = category.name;
                
                // Save category to localStorage, clear subcategory
                localStorage.setItem('selectedCategory', category.id);
                localStorage.removeItem('selectedSubcategory');
            });
        } else {
            // For categories without subcategories
            li.appendChild(categoryHeader);
            
            categoryHeader.addEventListener('click', function() {
                document.querySelectorAll('.category-item, .subcategory-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                
                if (category.id === 'all') {
                    filterProductsByCategory('all');
                    currentCategoryTitle.textContent = 'All Products';
                } else {
                    filterProductsByCategory(category.id);
                    currentCategoryTitle.textContent = category.name;
                }
                
                // Save category to localStorage, clear subcategory
                localStorage.setItem('selectedCategory', category.id);
                localStorage.removeItem('selectedSubcategory');
            });
        }
        
        categoryList.appendChild(li);
    });
    
    // Set stored category/subcategory as active
    const savedCategory = localStorage.getItem('selectedCategory');
    const savedSubcategory = localStorage.getItem('selectedSubcategory');
    
    if (savedCategory) {
        if (savedSubcategory) {
            const subCatLi = document.querySelector(`li[data-category="${savedCategory}"][data-subcategory="${savedSubcategory}"]`);
            if (subCatLi) {
                // Expand parent category
                const parentLi = subCatLi.closest('.category-item');
                parentLi.classList.add('expanded');
                const expanderIcon = parentLi.querySelector('.category-expander');
                if (expanderIcon) {
                    expanderIcon.innerHTML = '&#9652;'; // Up arrow
                }
                
                // Set subcategory as active
                subCatLi.classList.add('active');
                
                // Filter products by this subcategory
                filterProductsBySubcategory(savedCategory, savedSubcategory);
                
                // Update title
                const categoryObj = categories.find(cat => cat.id === savedCategory);
                const subcategoryObj = categoryObj?.subcategories.find(sub => sub.id === savedSubcategory);
                if (categoryObj && subcategoryObj) {
                    currentCategoryTitle.textContent = `${categoryObj.name} > ${subcategoryObj.name}`;
                }
            }
        } else {
            const catLi = document.querySelector(`li.category-item[data-category="${savedCategory}"]:not([data-subcategory])`);
            if (catLi) {
                catLi.classList.add('active');
                filterProductsByCategory(savedCategory);
                
                // Update title
                const categoryObj = categories.find(cat => cat.id === savedCategory);
                if (categoryObj) {
                    currentCategoryTitle.textContent = categoryObj.name;
                }
            }
        }
    } else {
        // Set "All Products" as active by default
        const allCategory = categoryList.querySelector('[data-category="all"]');
        if (allCategory) {
            allCategory.classList.add('active');
        }
    }

    // Add CSS for indented subcategories style
    addCategoryStyles();
}

// Add CSS for categories and subcategories styling
function addCategoryStyles() {
    const styleElement = document.getElementById('category-styles') || document.createElement('style');
    styleElement.id = 'category-styles';
    
    styleElement.textContent = `
        .category-item {
            position: relative;
            list-style-type: none;
            margin-bottom: 5px;
            cursor: pointer;
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .category-item.active > .category-header {
            background-color: #e0e0e0;
            font-weight: bold;
        }
        
        .category-name {
            flex-grow: 1;
        }
        
        .category-expander {
            padding: 0 5px;
            transition: transform 0.2s ease;
        }
        
        .subcategory-list {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding-left: 20px;
            list-style-type: none;
        }
        
        .category-item.expanded .subcategory-list {
            max-height: 500px; /* Adjust as needed */
        }
        
        .subcategory-item {
            padding: 8px 10px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .subcategory-item:hover {
            background-color: #f0f0f0;
        }
        
        .subcategory-item.active {
            background-color: #e0e0e0;
            font-weight: bold;
        }
    `;
    
    if (!document.getElementById('category-styles')) {
        document.head.appendChild(styleElement);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        products = data;
        
        // Debug: Log the products we loaded
        console.log("Loaded products:", products);
    } catch (error) {
        console.error('Error loading products:', error);
        
        // Add more mock products with consistent structure
        products = [
            {
                id: 1,
                name: 'Apples (1kg)',
                price: 1.99,
                category_id: 2,
                subcategory_id: 4,
                unit: 'kg',
                image: '../images/apples.jpg',
                inStock: 15,
                active: true
            },
            {
                id: 2,
                name: 'Bananas (1kg)',
                price: 1.49,
                category_id: 2,
                subcategory_id: 4,
                unit: 'kg',
                image: '../images/bananas.jpg',
                inStock: 20,
                active: true
            },
            {
                id: 3,
                name: 'Orange Juice (1L)',
                price: 2.99,
                category_id: 1,
                subcategory_id: 2,
                unit: 'bottle',
                image: '../images/orange-juice-1l.jpg',
                inStock: 14,
                active: true
            }
        ];
        
        console.log("Using mock products:", products);
        renderProducts(products);
    }
}

// Filter products by category
function filterProductsByCategory(categoryId) {
    currentCategory = categoryId; // Set the current category
    currentSubcategory = null;
    
    let filteredProducts;
    
    if (categoryId === 'all') {
        filteredProducts = products;
    } else {
        // Handle both string and number id types
        filteredProducts = products.filter(product => {
            // Check both category_id and category properties
            const productCatId = product.category_id;
            return productCatId && productCatId.toString() === categoryId.toString();
        });
    }

    renderProducts(filteredProducts);
    console.log("Loaded products:", filteredProducts);
    // Update the category title
    const currentCategoryTitle = document.getElementById('current-category');
    if (currentCategoryTitle) {
        const categoryObj = categories.find(cat => cat.id.toString() === categoryId.toString());
        currentCategoryTitle.textContent = categoryId === 'all' ? 'All Products' : (categoryObj ? categoryObj.name : '');
    }

}

function filterProductsBySubcategory(categoryId, subcategoryId) {
    currentCategory = categoryId;
    currentSubcategory = subcategoryId;

    const filteredProducts = products.filter(product => {
        const productCatId = product.category_id ?? product.category;
        const productSubcatId = product.subcategory_id ?? product.subcategory;

        return (
            productCatId?.toString() === categoryId.toString() &&
            productSubcatId?.toString() === subcategoryId.toString()
        );
    });

    renderProducts(filteredProducts);

    // Update the category title
    const currentCategoryTitle = document.getElementById('current-category');
    if (currentCategoryTitle) {
        const categoryObj = categories.find(cat => cat.id.toString() === categoryId.toString());
        const subcategoryObj = categoryObj?.subcategories.find(sub => sub.id.toString() === subcategoryId.toString());

        if (categoryObj && subcategoryObj) {
            currentCategoryTitle.textContent = `${categoryObj.name} > ${subcategoryObj.name}`;
        }
    }
}

// Filter products by search term
function filterProductsBySearch(searchTerm) {
    const term = searchTerm.toLowerCase();
    let filteredProducts = products;
    
    if (currentCategory !== 'all' && currentSubcategory) {
        filteredProducts = filteredProducts.filter(
            product => product.category === currentCategory && product.subcategory === currentSubcategory
        );
    } else if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }
    
    if (term) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(term)
        );
    }
    
    renderProducts(filteredProducts);
    
    if (term) {
        currentCategoryTitle.textContent = `Search Results: "${searchTerm}"`;
    }
}

function renderProducts(productsToRender) {
    // Get the container
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.error("Products container not found!");
        return;
    }
    
    // Clear the container
    productsContainer.innerHTML = '';
    
    // Create a header for the current category if it doesn't exist
    let currentCategoryTitle = document.getElementById('current-category');
    if (!currentCategoryTitle) {
        currentCategoryTitle = document.createElement('h2');
        currentCategoryTitle.id = 'current-category';
        currentCategoryTitle.textContent = 'All Products';
        productsContainer.appendChild(currentCategoryTitle);
    }
    
    // Create a products grid container
    const grid = document.createElement('div');
    grid.className = 'products-grid';
    productsContainer.appendChild(grid);
    
    if (productsToRender.length === 0) {
        const noProducts = document.createElement('p');
        noProducts.textContent = 'No products found.';
        grid.appendChild(noProducts);
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Use unit_quantity to determine stock status
        const isInStock = product.inStock > 0;
        const stockClass = isInStock ? 'in-stock' : 'out-of-stock';
        const stockText = isInStock ? 'In stock' : 'Out of Stock';
        const buttonDisabled = !isInStock ? 'disabled' : '';
        
        // Check if product has an image property, use placeholder if not
        const productImage = product.image || 'https://via.placeholder.com/150';
        
        productCard.innerHTML = `
            <img src="${productImage}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-stock ${stockClass}">${stockText}</p>
            <p class="product-price">$${product.price ? product.price.toFixed(2) : '0.00'} / ${product.unit || 'unit'}</p>
            <button class="add-to-cart" data-id="${product.id}" ${buttonDisabled}>Add to Cart</button>
        `;
        
        grid.appendChild(productCard);
    });       
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        if (!button.hasAttribute('disabled')) {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        }
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            unit: product.unit,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartCount();
    saveCartToLocalStorage();
    showToast(`${product.name} added to cart!`, 'success');
}

// Update quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    if (isNaN(newQuantity) || newQuantity < 1) {
        showToast('Quantity must be a positive number', 'error');
        return;
    }

    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = newQuantity;
        renderCartItems();
        updateCartCount();
        saveCartToLocalStorage();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(item => item.id !== productId);
    renderCartItems();
    updateCartCount();
    saveCartToLocalStorage();
    if (item) showToast(`${item.name} removed from cart`, 'info');
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
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
                <p class="cart-item-price">$${item.price.toFixed(2)} / ${item.unit || 'unit'}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === id);
            if (item && item.quantity >= 1) updateCartItemQuantity(id, item.quantity - 1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === id);
            if (item) updateCartItemQuantity(id, item.quantity + 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity)) updateCartItemQuantity(id, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            removeFromCart(id);
        });
    });
}

// Check inventory before checkout
async function checkInventory() {
    try {
        const outOfStockItems = [];
        
        for (const cartItem of cart) {
            const product = products.find(p => p.id === cartItem.id);
            if (!product || product.inStock <= 0) {
                outOfStockItems.push({
                    id: cartItem.id,
                    name: cartItem.name
                });
            }
        }
        
        if (outOfStockItems.length > 0) {
            return { 
                success: false, 
                outOfStockItems 
            };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error checking inventory:', error);
        return { success: false };
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;

    if (count === 0) {
        orderButton.disabled = true;
        orderButton.classList.add('disabled');
    } else {
        orderButton.disabled = false;
        orderButton.classList.remove('disabled');
    }
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Empty cart
function emptyCart() {
    cart = [];
    renderCartItems();
    updateCartCount();
    saveCartToLocalStorage();
    showToast('Cart has been emptied', 'info');

}

// Place order
async function placeOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    try {
        proceedToCheckout();
    } catch (error) {
        console.error('Error placing order:', error);
        showToast('There was an error placing your order', 'error');
    }
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    loadCartFromLocalStorage();
    setupLogoNavigation();

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterProductsBySearch(searchInput.value);
    });

    cartButton.addEventListener('click', () => {
        renderCartItems();
        cartModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    emptyCartBtn.addEventListener('click', emptyCart);
    orderButton.addEventListener('click', placeOrder);
});