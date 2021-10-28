const HtmlElements = {
    receiptList: document.getElementById('receipt-list'),
    total: document.getElementById('total'),
    statisticInfoForm: document.getElementById('statistic-info-form'),
    statisticMonthInput: document.getElementById('statistic-month-input'),
    statisticYearInput: document.getElementById('statistic-year-input'),
};

const showReceipt = (receipt) => {
    let html = `<div id="receipt-${receipt.id}" class="width-100 width-12col small-grid lr-center tb-padding-medium cart-item">
    <h3 class="width-3col">${receipt.id}</h3>
    <p class="width-3col">${receipt.customer_id}</p>
    <p class="width-3col">${receipt.date}</p>
    <p class="price-tag-medium width-3col">${receipt.total}</p>
</div>
<hr class="width-12col">`;
    HtmlElements.receiptList.insertAdjacentHTML('beforeend', html);
}

const showReceiptList = (receipt_list) => {
    for (let receipt of receipt_list) {
        showReceipt(receipt);
    }
}

const clearReceiptList = () => {
    HtmlElements.receiptList.innerHTML = '';
}

const showTotal = (total) => {
    let html = `<div class="width-6col"></div>
    <div class="width-6col flex f-row f-spacebetween">
        <h4 class="tb-center">Tổng: </h4>
        <p class="price-tag-large">${total}</p>
    </div>`;
    HtmlElements.total.innerHTML = html;
}

const clearTotal = () => {
    HtmlElements.total.innerHTML = '';
}

const calculateTotal = (receipt_list) => {
    let total = 0;
    for (let receipt of receipt_list) {
        total += receipt.total;
    }
    return total;
}

HtmlElements.statisticInfoForm.addEventListener("submit", (e) => {
    // Prevent reload after submit form 
    e. preventDefault();

    // Clear UI
    clearReceiptList();
    clearTotal();

    // Get month and year
    let month = HtmlElements.statisticMonthInput.value;
    let year = HtmlElements.statisticYearInput.value;
    console.log(`Statistic view: month=${month}, year=${year}`)
    
    // TODO: Validate month and year

    let request = new XMLHttpRequest();
    request.open('GET', `/api/receipt-list?month=${month}&year=${year}`);
    request.onload = function() {
        let receipt_list = JSON.parse(request.response).receipt_list;
        let total = calculateTotal(receipt_list);
        showReceiptList(receipt_list);
        showTotal(total);
    };

    request.send();
})


