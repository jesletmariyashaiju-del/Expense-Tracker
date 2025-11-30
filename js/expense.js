// Expense Management Functions
const ExpenseManager = {
    currentView: 'cards', // 'cards' or 'table'
    currentEditId: null,
    expenses: [],
    searchQuery: '',
    dateFrom: null,
    dateTo: null,

    // Initialize expenses from storage
    init() {
        this.expenses = Storage.getExpenses();
        this.render();
    },

    // Add or update expense
    saveExpense(expenseData) {
        if (this.currentEditId) {
            // Update existing expense
            Storage.updateExpense(this.currentEditId, expenseData);
            this.currentEditId = null;
            document.getElementById('cancelEdit').style.display = 'none';
        } else {
            // Add new expense
            Storage.addExpense(expenseData);
        }
        this.expenses = Storage.getExpenses();
        this.render();
        Analytics.updateCharts();
        this.resetForm();
    },

    // Delete expense
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            Storage.deleteExpense(id);
            this.expenses = Storage.getExpenses();
            this.render();
            Analytics.updateCharts();
        }
    },

    // Edit expense
    editExpense(id) {
        const expense = Storage.getExpenseById(id);
        if (expense) {
            this.currentEditId = id;
            document.getElementById('amount').value = expense.amount;
            document.getElementById('description').value = expense.description;
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;
            document.getElementById('cancelEdit').style.display = 'inline-block';
            document.getElementById('expenseForm').scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Reset form
    resetForm() {
        document.getElementById('expenseForm').reset();
        this.currentEditId = null;
        document.getElementById('cancelEdit').style.display = 'none';
    },

    // Filter expenses
    filterExpenses(category) {
        let filtered = [...this.expenses];
        
        // Filter by category
        if (category) {
            filtered = filtered.filter(exp => exp.category === category);
        }
        
        // Filter by search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(exp => 
                exp.description.toLowerCase().includes(query)
            );
        }
        
        // Filter by date range
        if (this.dateFrom) {
            filtered = filtered.filter(exp => exp.date >= this.dateFrom);
        }
        if (this.dateTo) {
            filtered = filtered.filter(exp => exp.date <= this.dateTo);
        }
        
        return filtered;
    },
    
    // Set search query
    setSearchQuery(query) {
        this.searchQuery = query;
        this.render();
    },
    
    // Set date range
    setDateRange(from, to) {
        this.dateFrom = from || null;
        this.dateTo = to || null;
        this.render();
        Analytics.updateCharts();
    },
    
    // Clear date range
    clearDateRange() {
        this.dateFrom = null;
        this.dateTo = null;
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        this.render();
        Analytics.updateCharts();
    },

    // Sort expenses
    sortExpenses(expenses, sortBy) {
        const [field, order] = sortBy.split('-');
        const sorted = [...expenses];
        
        sorted.sort((a, b) => {
            let aVal, bVal;
            
            if (field === 'date') {
                aVal = new Date(a.date);
                bVal = new Date(b.date);
            } else if (field === 'amount') {
                aVal = parseFloat(a.amount);
                bVal = parseFloat(b.amount);
            }
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        return sorted;
    },

    // Render expenses based on current view
    render() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const sortBy = document.getElementById('sortBy').value;
        
        let filtered = this.filterExpenses(categoryFilter);
        filtered = this.sortExpenses(filtered, sortBy);
        
        const container = document.getElementById('expensesContainer');
        
        // Update container class for styling
        container.className = 'expenses-container ' + this.currentView + '-view';
        
        if (this.currentView === 'cards') {
            container.innerHTML = this.renderCards(filtered);
        } else {
            container.innerHTML = this.renderTable(filtered);
        }
        
        // Attach event listeners
        this.attachEventListeners();
    },
    
    // Export to CSV
    exportToCSV() {
        const expenses = this.expenses;
        if (expenses.length === 0) {
            alert('No expenses to export');
            return;
        }
        
        // CSV headers
        const headers = ['Date', 'Category', 'Description', 'Amount'];
        const rows = expenses.map(exp => [
            exp.date,
            exp.category,
            `"${exp.description.replace(/"/g, '""')}"`, // Escape quotes
            exp.amount
        ]);
        
        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Render cards view
    renderCards(expenses) {
        if (expenses.length === 0) {
            return '<div class="empty-state">No expenses found. Add your first expense above!</div>';
        }
        
        return expenses.map(expense => `
            <div class="expense-card" data-id="${expense.id}">
                <div class="card-header">
                    <span class="category-badge category-${expense.category.toLowerCase()}">${expense.category}</span>
                    <div class="card-actions">
                        <button class="btn-icon edit-btn" onclick="ExpenseManager.editExpense('${expense.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="btn-icon delete-btn" onclick="ExpenseManager.deleteExpense('${expense.id}')" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="expense-amount">${CurrencyManager.format(expense.amount)}</h3>
                    <p class="expense-description">${expense.description}</p>
                    <p class="expense-date">${this.formatDate(expense.date)}</p>
                </div>
            </div>
        `).join('');
    },

    // Render table view
    renderTable(expenses) {
        if (expenses.length === 0) {
            return '<div class="empty-state">No expenses found. Add your first expense above!</div>';
        }
        
        const tableRows = expenses.map(expense => `
            <tr data-id="${expense.id}">
                <td>${this.formatDate(expense.date)}</td>
                <td><span class="category-badge category-${expense.category.toLowerCase()}">${expense.category}</span></td>
                <td>${expense.description}</td>
                <td class="amount-cell">${CurrencyManager.format(expense.amount)}</td>
                <td class="actions-cell">
                    <button class="btn-icon edit-btn" onclick="ExpenseManager.editExpense('${expense.id}')" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon delete-btn" onclick="ExpenseManager.deleteExpense('${expense.id}')" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
        
        return `
            <table class="expenses-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    // Attach event listeners to rendered elements
    attachEventListeners() {
        // Event listeners are attached via onclick in the HTML strings
        // This method can be extended if needed
    },

    // Set view mode
    setView(view) {
        this.currentView = view;
        const cardBtn = document.getElementById('cardViewBtn');
        const tableBtn = document.getElementById('tableViewBtn');
        
        // Bootstrap active class handling
        if (view === 'cards') {
            cardBtn.classList.add('active');
            tableBtn.classList.remove('active');
        } else {
            tableBtn.classList.add('active');
            cardBtn.classList.remove('active');
        }
        
        this.render();
    }
};

