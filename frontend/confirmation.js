document.addEventListener('DOMContentLoaded', () => {
    
    // Reset cart count to zero
    document.getElementById('cart-count').textContent = '0';
});

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

// Call this function in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {    
    // Setup logo navigation
    setupLogoNavigation();
    
});