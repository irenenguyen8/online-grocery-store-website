function validateLoginForm() {
    let isValid = true;

    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    const passwordInput = document.getElementById('password');
    if (passwordInput.value.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    return isValid;
}

function handleLogin(e) {
    e.preventDefault();

    if (!validateLoginForm()) return;

    const loginButton = document.getElementById('login-button');
    const originalText = loginButton.textContent;
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    setTimeout(() => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        console.log('Login attempt:', { email, password, remember });

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        loginButton.disabled = false;
        loginButton.textContent = originalText;

        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            window.location.href = 'frontend\index.html';
        }
    }, 1000);
}

function setupLogoNavigation() {
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPage = window.location.pathname;
            if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    setupLogoNavigation();
});