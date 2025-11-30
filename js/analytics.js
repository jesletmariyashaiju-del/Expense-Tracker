// Analytics and Charts
const Analytics = {
    pieChart: null,
    barChart: null,

    // Initialize charts
    init() {
        this.updateCharts();
    },

    // Update all charts
    updateCharts() {
        let expenses = Storage.getExpenses();
        
        // Apply date range filter if set
        const dateFrom = ExpenseManager.dateFrom;
        const dateTo = ExpenseManager.dateTo;
        if (dateFrom) {
            expenses = expenses.filter(exp => exp.date >= dateFrom);
        }
        if (dateTo) {
            expenses = expenses.filter(exp => exp.date <= dateTo);
        }
        
        this.updateStats(expenses);
        this.updatePieChart(expenses);
        this.updateBarChart(expenses);
        this.updateBudgets(expenses);
    },

    // Update statistics
    updateStats(expenses) {
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
        const count = expenses.length;
        
        // Calculate average daily expense
        const dates = [...new Set(expenses.map(exp => exp.date))];
        const averageDaily = dates.length > 0 ? total / dates.length : 0;
        
        document.getElementById('totalExpenses').textContent = CurrencyManager.format(total);
        document.getElementById('averageDaily').textContent = CurrencyManager.format(averageDaily);
        document.getElementById('expenseCount').textContent = count;
    },

    // Update pie chart (category breakdown)
    updatePieChart(expenses) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        // Calculate totals by category
        const categoryTotals = {};
        expenses.forEach(exp => {
            const category = exp.category || 'Other';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(exp.amount || 0);
        });

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);

        // Category colors (darker theme)
        const colors = {
            'Food': '#ff7a9a',
            'Transportation': '#5ab3ff',
            'Shopping': '#ffd966',
            'Bills': '#6bddd6',
            'Entertainment': '#b399ff',
            'Other': '#ffb366'
        };

        const backgroundColors = categories.map(cat => colors[cat] || '#CCCCCC');

        if (this.pieChart) {
            this.pieChart.destroy();
        }

        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#1e1e2e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b0b0c0'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 30, 46, 0.9)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#e0e0e0',
                        borderColor: '#3a3a4e',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${CurrencyManager.format(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // Update bar chart (daily trends)
    updateBarChart(expenses) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        // Group expenses by date
        const dateTotals = {};
        expenses.forEach(exp => {
            const date = exp.date;
            dateTotals[date] = (dateTotals[date] || 0) + parseFloat(exp.amount || 0);
        });

        // Sort dates and get last 30 days or all dates
        const sortedDates = Object.keys(dateTotals).sort();
        const recentDates = sortedDates.slice(-30); // Last 30 days
        const amounts = recentDates.map(date => dateTotals[date]);

        // Format dates for display
        const formattedDates = recentDates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        if (this.barChart) {
            this.barChart.destroy();
        }

        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: formattedDates,
                datasets: [{
                    label: 'Daily Expenses',
                    data: amounts,
                    backgroundColor: '#8b7fd9',
                    borderColor: '#8b7fd9',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        ticks: {
                            color: '#b0b0c0'
                        },
                        grid: {
                            color: '#3a3a4e'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#b0b0c0',
                            callback: function(value) {
                                return CurrencyManager.format(value);
                            }
                        },
                        grid: {
                            color: '#3a3a4e'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 30, 46, 0.9)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#e0e0e0',
                        borderColor: '#3a3a4e',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return CurrencyManager.format(context.parsed.y);
                            }
                        }
                    }
                }
            }
        });
    },
    
    // Update budget display
    updateBudgets(expenses) {
        const budgets = Storage.getBudgets();
        const budgetContainer = document.getElementById('budgetContainer');
        if (!budgetContainer) return;
        
        const categories = ['Food', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Other'];
        
        // Calculate spending per category
        const spending = {};
        expenses.forEach(exp => {
            const category = exp.category || 'Other';
            spending[category] = (spending[category] || 0) + parseFloat(exp.amount || 0);
        });
        
        // Render budget items
        let hasBudgets = false;
        let html = '';
        
        categories.forEach(category => {
            const budget = budgets[category] || 0;
            if (budget > 0) {
                hasBudgets = true;
                const spent = spending[category] || 0;
                const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                const remaining = Math.max(0, budget - spent);
                
                // Determine status color
                let statusClass = 'budget-ok';
                if (percentage >= 100) {
                    statusClass = 'budget-exceeded';
                } else if (percentage >= 80) {
                    statusClass = 'budget-warning';
                }
                
                html += `
                    <div class="budget-item">
                        <div class="budget-header">
                            <span class="budget-category">${category}</span>
                            <div class="budget-actions">
                                <input type="number" class="budget-input" value="${budget.toFixed(2)}" 
                                       data-category="${category}" placeholder="Set budget" step="0.01" min="0">
                                <button class="btn-icon delete-budget" data-category="${category}" title="Remove budget">🗑️</button>
                            </div>
                        </div>
                        <div class="budget-progress">
                            <div class="budget-bar">
                                <div class="budget-fill ${statusClass}" style="width: ${Math.min(100, percentage)}%"></div>
                            </div>
                            <div class="budget-info">
                                <span>${CurrencyManager.format(spent)} / ${CurrencyManager.format(budget)}</span>
                                <span class="budget-remaining">Remaining: ${CurrencyManager.format(remaining)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        // Add button to add new budget if no budgets exist
        if (!hasBudgets) {
            html += `
                <div class="budget-item">
                    <div class="budget-header">
                        <select class="budget-category-select" id="newBudgetCategory">
                            <option value="">Select category</option>
                            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                        <div class="budget-actions">
                            <input type="number" class="budget-input" id="newBudgetAmount" 
                                   placeholder="Budget amount" step="0.01" min="0">
                            <button class="btn btn-primary btn-sm" id="addBudgetBtn">Add Budget</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Add option to add more budgets
            html += `
                <div class="budget-item budget-add">
                    <div class="budget-header">
                        <select class="budget-category-select" id="newBudgetCategory">
                            <option value="">Add budget for category...</option>
                            ${categories.filter(cat => !budgets[cat] || budgets[cat] === 0).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                        <div class="budget-actions">
                            <input type="number" class="budget-input" id="newBudgetAmount" 
                                   placeholder="Budget amount" step="0.01" min="0">
                            <button class="btn btn-primary btn-sm" id="addBudgetBtn">Add</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        budgetContainer.innerHTML = html;
        
        // Attach event listeners
        this.attachBudgetListeners();
    },
    
    // Attach budget event listeners
    attachBudgetListeners() {
        // Add budget button
        const addBtn = document.getElementById('addBudgetBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const category = document.getElementById('newBudgetCategory').value;
                const amount = document.getElementById('newBudgetAmount').value;
                if (category && amount && parseFloat(amount) > 0) {
                    Storage.setBudget(category, amount);
                    this.updateCharts();
                }
            });
        }
        
        // Update budget inputs
        document.querySelectorAll('.budget-input[data-category]').forEach(input => {
            input.addEventListener('change', (e) => {
                const category = e.target.dataset.category;
                const amount = e.target.value;
                if (amount && parseFloat(amount) >= 0) {
                    Storage.setBudget(category, amount);
                    this.updateCharts();
                }
            });
        });
        
        // Delete budget buttons
        document.querySelectorAll('.delete-budget').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (confirm(`Remove budget for ${category}?`)) {
                    Storage.deleteBudget(category);
                    this.updateCharts();
                }
            });
        });
    }
};

