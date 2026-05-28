document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle (Dark / Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check localStorage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'oscuro') {
        body.classList.add('oscuro');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('oscuro');
            
            if (body.classList.contains('oscuro')) {
                localStorage.setItem('theme', 'oscuro');
                themeToggleBtn.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'claro');
                themeToggleBtn.textContent = '🌙';
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        
        if (!cookiesAccepted) {
            // Show banner after a slight delay
            setTimeout(() => {
                cookieBanner.style.display = 'flex';
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }
});
