/**
 * Theme Toggle Functionality
 * Handles light/dark theme switching with localStorage persistence
 */

(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'contador-ia-theme';
    const THEME_ATTRIBUTE = 'data-theme';
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    /**
     * Get the current theme
     */
    function getCurrentTheme() {
        return htmlElement.getAttribute(THEME_ATTRIBUTE) || 'light';
    }

    /**
     * Set theme on the HTML element
     */
    function setTheme(theme) {
        htmlElement.setAttribute(THEME_ATTRIBUTE, theme);
    }

    /**
     * Save theme preference to localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Failed to save theme preference:', e);
        }
    }

    /**
     * Get saved theme from localStorage
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY);
        } catch (e) {
            console.warn('Failed to read theme preference:', e);
            return null;
        }
    }

    /**
     * Get system preference
     */
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Initialize theme on page load
     */
    function initTheme() {
        const savedTheme = getSavedTheme();
        const systemPreference = getSystemPreference();
        const theme = savedTheme || systemPreference;
        
        setTheme(theme);
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        setTheme(newTheme);
        saveTheme(newTheme);
    }

    /**
     * Listen for system theme changes
     */
    function watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only apply system preference if user hasn't set a preference
                const savedTheme = getSavedTheme();
                if (!savedTheme) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    setTheme(newTheme);
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            watchSystemTheme();
        });
    } else {
        initTheme();
        watchSystemTheme();
    }

    // Attach toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
})();

/**
 * Mobile Menu Toggle Functionality
 * Handles hamburger menu for mobile navigation
 */
(function() {
    'use strict';

    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-menu a');

    /**
     * Toggle menu visibility
     */
    function toggleMenu() {
        if (!menuToggle || !navMenu) return;

        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        menuToggle.setAttribute('aria-expanded', newState);
        navMenu.setAttribute('aria-hidden', !newState);

        // Prevent body scroll when menu is open
        if (newState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Close menu
     */
    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Handle clicks outside menu to close it
     */
    function handleClickOutside(event) {
        if (!navMenu || !menuToggle) return;

        const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
            closeMenu();
        }
    }

    /**
     * Handle escape key to close menu
     */
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    }

    // Initialize menu state
    function initMenu() {
        if (!menuToggle || !navMenu) return;

        // Set initial state
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');

        // Attach toggle handler
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow smooth transition
                setTimeout(closeMenu, 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', handleClickOutside);

        // Close menu on escape key
        document.addEventListener('keydown', handleEscapeKey);

        // Close menu on window resize (if resizing to desktop)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            }, 250);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
})();



