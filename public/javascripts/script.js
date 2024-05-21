async function searchPrices() {
    const query = document.getElementById('search-query').value;
    const response = await fetch(`/prices?query=${query}`);
    const prices = await response.json();

    const tableBody = document.getElementById('prices-table').querySelector('tbody');
    tableBody.innerHTML = '';
    prices.forEach(price => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.item_name}</td>
            <td>${price.date}</td>
            <td>${price.price}</td>
        `;
        tableBody.appendChild(row);
    });
}
