import {clearReceiptList, showReceiptList, sendGetReceiptListRequest} from './getReceipts'
const Pagination = require('./tui-pagination/dist/tui-pagination');

const HtmlElements = {
    total: document.getElementById('total'),
    statisticInfoForm: document.getElementById('statistic-info-form'),
    statisticMonthInput: document.getElementById('statistic-month-input'),
    statisticYearInput: document.getElementById('statistic-year-input'),
    paginationContainer: document.getElementById('pagination-container')
};


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
        total += parseInt(receipt.total);
    }
    console.log("Total: ", total);
    return total;
}

const showData = (totalItems, receipt_list) => {
    console.log("aloalo");
    console.log("Receipt list: ", receipt_list);
    // Clear UI
    clearReceiptList();
    clearTotal();

    let total = calculateTotal(receipt_list);
    showReceiptList(receipt_list);
    showTotal(total);
}

HtmlElements.statisticInfoForm.addEventListener("submit", (e) => {
    // Prevent reload after submit form 
    e. preventDefault();

    // Get month and year
    let month = HtmlElements.statisticMonthInput.value;
    let year = HtmlElements.statisticYearInput.value;
    console.log(`Statistic view: month=${month}, year=${year}`)
    
    sendGetReceiptListRequest(month, year, 1, initPage);
})



const initPage = (totalItems, receipt_list) => {
    const pagination = new Pagination(HtmlElements.paginationContainer, { 
        totalItems: totalItems,
        itemsPerPage: 10,
        visiblePages: 5,
        centerAlign: true
    });
    pagination.on('beforeMove', (eventData) => {
        sendGetReceiptListRequest(null, null, eventData.page, showData);
    });
}


