import {clearReceiptList, sendGetReceiptListRequest, showReceiptList} from './getReceipts'
const Pagination = require('./tui-pagination/dist/tui-pagination');

const HtmlElements = {
    paginationContainer: document.getElementById('pagination-container')
};

const showData = (totalItems, receipt_list) => {
    clearReceiptList();
    showReceiptList(receipt_list);
}

const initPage = (totalItems, receipt_list) => {
    console.log(totalItems, receipt_list);
    const pagination = new Pagination(HtmlElements.paginationContainer, { 
        totalItems: totalItems,
        itemsPerPage: 10,
        visiblePages: 5,
        centerAlign: true
    });
    showData(totalItems, receipt_list);
    pagination.on('beforeMove', (eventData) => {
        sendGetReceiptListRequest(null, null, eventData.page, showData);
    });
}

sendGetReceiptListRequest(null, null, 1, initPage);





