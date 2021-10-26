HtmlElements = {
    getButton: document.getElementById('get-receipt-list'),
    receiptList: document.getElementById('receipt-list')
};
const showReceipt = (receipt) => {
    html = `<div id="receipt-${receipt.id}" class="width-100 width-12col small-grid lr-center tb-padding-medium cart-item">
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


let request = new XMLHttpRequest();
request.open('GET', '/api/receipt-list');
request.onload = function() {
    receipt_list = JSON.parse(request.response).receipt_list;
    showReceiptList(receipt_list);
};

request.send();