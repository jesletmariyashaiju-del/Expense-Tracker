// Currency Management
const CurrencyManager = {
    currentCurrency: 'INR',
    
    symbols: {
        'INR': '₹'
    },
    
    init() {
        this.currentCurrency = 'INR';
        this.updateCurrencyDisplay();
    },
    
    format(amount) {
        return `₹${parseFloat(amount).toFixed(2)}`;
    },
    
    updateCurrencyDisplay() {
        // Update form label
        const amountLabel = document.querySelector('label[for="amount"]');
        if (amountLabel) {
            amountLabel.textContent = `Amount (₹)`;
        }
    }
};

