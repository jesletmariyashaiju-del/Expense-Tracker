// Theme Management
const ThemeManager = {
    currentTheme: 'dark',

    // Initialize theme
    init() {
        this.currentTheme = Storage.getTheme();
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
    },

    // Apply theme
    applyTheme(theme) {
        document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
        this.currentTheme = theme;
        Storage.setTheme(theme);
        this.updateToggleButton();
    },

    // Toggle theme
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    },

    // Update toggle button icon
    updateToggleButton() {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            // 🌑 = new moon (dark) for dark theme
            // 🌕 = full moon (light) for light theme
            btn.textContent = this.currentTheme === 'dark' ? '🌑' : '🌕';
        }
    }
};

