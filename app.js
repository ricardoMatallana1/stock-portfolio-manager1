document.addEventListener('DOMContentLoaded', () => {
    console.log("Stock Portfolio Manager Initialized");

    const form = document.getElementById('add-stock-form');
    const portfolioTable = document.getElementById('portfolio-table');

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form refresh

        const stockName = document.getElementById('stock-name').value;
        const stockShares = parseInt(document.getElementById('stock-shares').value);
        const stockPrice = parseFloat(document.getElementById('stock-price').value);

        if (stockName && stockShares > 0 && stockPrice > 0) {
            // Add a new row to the portfolio table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stockName}</td>
                <td>${stockShares}</td>
                <td>$${stockPrice.toFixed(2)}</td>
                <td>$${(stockShares * stockPrice).toFixed(2)}</td>
            `;
            portfolioTable.appendChild(row);

            // Clear the form inputs
            form.reset();
        } else {
            alert("Please enter valid stock details.");
        }
    });

    // Example: Populate portfolio table dynamically
    const exampleStocks = [
        { name: "AAPL", shares: 10, price: 150 },
        { name: "MSFT", shares: 5, price: 250 }
    ];

    exampleStocks.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stock.name}</td>
            <td>${stock.shares}</td>
            <td>$${stock.price.toFixed(2)}</td>
            <td>$${(stock.shares * stock.price).toFixed(2)}</td>
        `;
        portfolioTable.appendChild(row);
    });

    // Fetch stock data (placeholder for future API integration)
    async function fetchStockData(symbol) {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=YOUR_API_KEY`);
        const data = await response.json();
        console.log(data);
    }
    fetchStockData('AAPL');
    
});
