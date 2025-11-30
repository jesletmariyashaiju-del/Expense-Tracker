// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Initialize theme
    ThemeManager.init();

    // Initialize currency manager
    CurrencyManager.init();

    // Initialize expense manager
    ExpenseManager.init();

    // Initialize analytics
    Analytics.init();

    // Form submission
    document.getElementById('expenseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        // Validation
        if (!amount || !description || !category || !date) {
            alert('Please fill in all fields');
            return;
        }

        if (parseFloat(amount) <= 0) {
            alert('Amount must be greater than 0');
            return;
        }

        ExpenseManager.saveExpense({
            amount: parseFloat(amount),
            description: description.trim(),
            category: category,
            date: date
        });
    });

    // Cancel edit button
    document.getElementById('cancelEdit').addEventListener('click', function() {
        ExpenseManager.resetForm();
    });

    // View toggle buttons
    document.getElementById('cardViewBtn').addEventListener('click', function() {
        ExpenseManager.setView('cards');
    });

    document.getElementById('tableViewBtn').addEventListener('click', function() {
        ExpenseManager.setView('table');
    });

    // Filter and sort changes
    document.getElementById('filterCategory').addEventListener('change', function() {
        ExpenseManager.render();
    });

    document.getElementById('sortBy').addEventListener('change', function() {
        ExpenseManager.render();
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        ExpenseManager.setSearchQuery(query);
        clearSearch.style.display = query ? 'inline-block' : 'none';
    });
    
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        ExpenseManager.setSearchQuery('');
        this.style.display = 'none';
    });

    // Date range filtering
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const clearDateFilter = document.getElementById('clearDateFilter');
    
    dateFrom.addEventListener('change', function() {
        ExpenseManager.setDateRange(this.value, dateTo.value);
        clearDateFilter.style.display = (this.value || dateTo.value) ? 'inline-block' : 'none';
    });
    
    dateTo.addEventListener('change', function() {
        ExpenseManager.setDateRange(dateFrom.value, this.value);
        clearDateFilter.style.display = (dateFrom.value || this.value) ? 'inline-block' : 'none';
    });
    
    clearDateFilter.addEventListener('click', function() {
        ExpenseManager.clearDateRange();
        this.style.display = 'none';
    });

    // Export CSV
    document.getElementById('exportCSV').addEventListener('click', function() {
        ExpenseManager.exportToCSV();
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        ThemeManager.toggle();
    });
});

