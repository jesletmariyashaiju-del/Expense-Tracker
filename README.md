# Expense Tracker Web Application

A modern, responsive expense tracking web application built with vanilla HTML, CSS, and JavaScript. Track your daily expenses by category with beautiful analytics and visualizations.

## Features

- ✅ **Add Expenses**: Track expenses with amount, description, category, and date
- ✅ **Category Management**: Organize expenses into categories (Food, Transportation, Shopping, Bills, Entertainment, Other)
- ✅ **Multiple Views**: Switch between card view and table view
- ✅ **Filter & Sort**: Filter by category and sort by date or amount
- ✅ **Edit & Delete**: Update or remove expenses easily
- ✅ **Analytics Dashboard**: 
  - Pie chart showing expense breakdown by category
  - Bar chart displaying daily expense trends
  - Summary statistics (total expenses, average daily, expense count)
- ✅ **Local Storage**: All data is saved in your browser's local storage
- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Getting Started

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - No installation or build process required!

2. **Start Tracking**
   - Fill in the expense form with amount, description, category, and date
   - Click "Add Expense" to save
   - View your expenses in cards or table format
   - Check the analytics section for insights

## Usage

### Adding an Expense
1. Enter the amount (must be greater than 0)
2. Add a description
3. Select a category
4. Choose a date (defaults to today)
5. Click "Add Expense"

### Editing an Expense
- Click the edit icon (✏️) on any expense card or table row
- Modify the fields in the form
- Click "Add Expense" to save changes
- Click "Cancel" to discard changes

### Deleting an Expense
- Click the delete icon (🗑️) on any expense
- Confirm the deletion

### View Options
- **Cards View**: Visual card layout with category badges
- **Table View**: Detailed table with all information
- Toggle between views using the buttons at the top

### Filtering & Sorting
- **Filter**: Select a category from the dropdown to show only expenses in that category
- **Sort**: Choose sorting option:
  - Date (Newest/Oldest)
  - Amount (High to Low/Low to High)

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Vanilla JavaScript with modules
- **Chart.js**: Beautiful charts and visualizations
- **Local Storage API**: Client-side data persistence

## File Structure

```
projcursor/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles
├── js/
│   ├── app.js         # Main application logic
│   ├── expense.js     # Expense management functions
│   ├── storage.js     # Local storage utilities
│   └── analytics.js   # Charts and analytics
└── README.md          # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## License

This project is open source and available for personal use.

