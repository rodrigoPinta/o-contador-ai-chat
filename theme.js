/**
 * Theme Toggle Functionality
 * Handles light/dark theme switching with localStorage persistence
 */

(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'contador-ia-theme';
    const THEME_ATTRIBUTE = 'data-theme';
    const htmlElement = document.documentElement;

    /**
     * Get the current theme
     */
    function getCurrentTheme() {
        return htmlElement.getAttribute(THEME_ATTRIBUTE) || 'dark';
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
     * Initialize theme on page load
     */
    function initTheme() {
        const savedTheme = getSavedTheme();
        // Default to dark theme if no saved preference
        const theme = savedTheme || 'dark';
        
        setTheme(theme);
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log('Toggle theme:', currentTheme, '->', newTheme); // Debug
        
        setTheme(newTheme);
        saveTheme(newTheme);
        
        console.log('Theme set to:', htmlElement.getAttribute(THEME_ATTRIBUTE)); // Debug
    }

    /**
     * Initialize theme toggle button
     * Retries if element not found (for robustness)
     */
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            console.log('Theme toggle button found'); // Debug
            
            // Use a named function to allow proper removal if needed
            function handleToggleClick(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme(e);
            }
            
            // Remove any existing listener first (if it exists)
            themeToggle.removeEventListener('click', handleToggleClick);
            
            // Add the listener
            themeToggle.addEventListener('click', handleToggleClick);
            
            console.log('Theme toggle listener attached'); // Debug
            return true;
        }
        console.warn('Theme toggle button not found'); // Debug
        return false;
    }

    /**
     * Initialize everything
     */
    function init() {
        initTheme();
        
        // Try to initialize toggle button
        if (!initThemeToggle()) {
            // Retry after a short delay if button not found
            setTimeout(() => {
                if (!initThemeToggle()) {
                    console.warn('Theme toggle button not found after retry');
                }
            }, 100);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
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
        const isMobile = window.innerWidth <= 768;

        menuToggle.setAttribute('aria-expanded', newState);
        
        // Only use aria-hidden on mobile
        // On desktop, keep aria-hidden="false" to allow interaction with buttons
        if (isMobile) {
            navMenu.setAttribute('aria-hidden', !newState ? 'true' : 'false');
        } else {
            navMenu.setAttribute('aria-hidden', 'false');
        }

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

        const isMobile = window.innerWidth <= 768;

        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Only set aria-hidden on mobile
        // On desktop, keep aria-hidden="false" to allow interaction
        if (isMobile) {
            navMenu.setAttribute('aria-hidden', 'true');
        } else {
            navMenu.setAttribute('aria-hidden', 'false');
        }
        
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

        // Check if we're on mobile or desktop
        const isMobile = window.innerWidth <= 768;

        // Set initial state
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Only set aria-hidden on mobile (where menu can be hidden)
        // On desktop, menu is always visible, so aria-hidden should be false
        // This prevents blocking interaction with buttons inside nav-menu (like theme-toggle)
        if (isMobile) {
            navMenu.setAttribute('aria-hidden', 'true');
        } else {
            navMenu.setAttribute('aria-hidden', 'false');
        }

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
                const isMobileNow = window.innerWidth <= 768;
                
                // Update aria-hidden based on screen size
                if (isMobileNow) {
                    // On mobile, use aria-hidden to control visibility
                    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                    navMenu.setAttribute('aria-hidden', !isExpanded ? 'true' : 'false');
                } else {
                    // On desktop, menu is always visible - set aria-hidden to false
                    // This allows interaction with buttons inside nav-menu
                    navMenu.setAttribute('aria-hidden', 'false');
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



