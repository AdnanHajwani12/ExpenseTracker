let expenses = [];
let totalAmount = 0;

const addBtn = document.getElementById('add-btn');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const chartCanvas = document.getElementById('expense-chart');

// Adding an expense
addBtn.addEventListener('click', () => {
    const category = document.getElementById('category-select').value;
    const amount = parseFloat(document.getElementById('amount-input').value);
    const date = document.getElementById('date-input').value;

    if (category && amount && date) {
        expenses.push({ category, amount, date });
        totalAmount += amount;
        updateTable();
    }
});

// Updating the expense table
function updateTable() {
    expenseTableBody.innerHTML = '';
    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td><button onclick="deleteExpense('${expense.date}', '${expense.category}')">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    totalAmountCell.textContent = totalAmount;
}

// Deleting an expense
function deleteExpense(date, category) {
    const index = expenses.findIndex(exp => exp.date === date && exp.category === category);
    if (index > -1) {
        totalAmount -= expenses[index].amount;
        expenses.splice(index, 1);
        updateTable();
    }
}

// Generating Pie Chart
generateBtn.addEventListener('click', () => {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    const categories = {};
    expenses.forEach(exp => {
        if (!categories[exp.category]) categories[exp.category] = 0;
        categories[exp.category] += exp.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF5733', '#FFC300', '#DAF7A6', '#581845'];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        }
    });
});

// Export everything to HTML
downloadBtn.addEventListener('click', () => {
    const content = `
        <html>
            <head>
                <title>Expense Report</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }
                    th { background-color: #f2f2f2; }
                    .chart-container { text-align: center; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>Expense Report</h1>

                <h2>Expense Table</h2>
                <table>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                    ${expenses.map(exp => `
                        <tr>
                            <td>${exp.category}</td>
                            <td>${exp.amount}</td>
                            <td>${exp.date}</td>
                        </tr>
                    `).join('')}
                </table>

                <div class="chart-container">
                    <h2>Expense Breakdown</h2>
                    <img src="${document.getElementById('expense-chart').toDataURL('image/png')}" width="400" />
                </div>
            </body>
        </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Expense_Report.html';
    link.click();
});
