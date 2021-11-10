
const HtmlElements = {
    receiptList: document.getElementById('receipt-list'),
};

export const clearReceiptList = () => {
    HtmlElements.receiptList.innerHTML = '';
}

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

export const showReceiptList = (receipt_list) => {
    for (let receipt of receipt_list) {
        showReceipt(receipt);
    }
}

export const sendGetReceiptListRequest = (month, year, page = 1, callback) => {
    let params = ``;
    params += month ? `month=${month}&`: ``;
    params += year ? `year=${year}&`: ``;
    params += page ? `page=${page}`: ``;

    let request = new XMLHttpRequest();
    request.open('GET', `/api/receipt-list?${params}`);

    request.onload = function() {
        let message_received = JSON.parse(request.response);
        //console.log("Message received: ", message_received);
        //console.log("Call back func: ", callback);
        callback(message_received.totalItems, message_received.receipt_list);
    };
    request.send();
}
