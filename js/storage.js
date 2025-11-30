// Local Storage Utilities
const Storage = {
    // Get all expenses from local storage
    getExpenses() {
        const expenses = localStorage.getItem('expenses');
        return expenses ? JSON.parse(expenses) : [];
    },

    // Save expenses to local storage
    saveExpenses(expenses) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    },

    // Add a new expense
    addExpense(expense) {
        const expenses = this.getExpenses();
        const newExpense = {
            id: Date.now().toString(),
            ...expense,
            date: expense.date || new Date().toISOString().split('T')[0]
        };
        expenses.push(newExpense);
        this.saveExpenses(expenses);
        return newExpense;
    },

    // Update an existing expense
    updateExpense(id, updatedExpense) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(exp => exp.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...updatedExpense };
            this.saveExpenses(expenses);
            return expenses[index];
        }
        return null;
    },

    // Delete an expense
    deleteExpense(id) {
        const expenses = this.getExpenses();
        const filtered = expenses.filter(exp => exp.id !== id);
        this.saveExpenses(filtered);
        return filtered;
    },

    // Get expense by ID
    getExpenseById(id) {
        const expenses = this.getExpenses();
        return expenses.find(exp => exp.id === id);
    },

    // Budget Management
    getBudgets() {
        const budgets = localStorage.getItem('budgets');
        return budgets ? JSON.parse(budgets) : {};
    },

    setBudget(category, amount) {
        const budgets = this.getBudgets();
        budgets[category] = parseFloat(amount) || 0;
        localStorage.setItem('budgets', JSON.stringify(budgets));
        return budgets;
    },

    deleteBudget(category) {
        const budgets = this.getBudgets();
        delete budgets[category];
        localStorage.setItem('budgets', JSON.stringify(budgets));
        return budgets;
    },

    // Theme preference
    getTheme() {
        return localStorage.getItem('theme') || 'dark';
    },

    setTheme(theme) {
        localStorage.setItem('theme', theme);
    },

    // Currency Management
    getCurrency() {
        return localStorage.getItem('currency') || 'INR';
    },

    setCurrency(currency) {
        localStorage.setItem('currency', currency);
    }
};

