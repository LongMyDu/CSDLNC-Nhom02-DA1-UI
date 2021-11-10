/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/insertView.js":
/*!***************************!*\
  !*** ./src/insertView.js ***!
  \***************************/
/***/ (() => {

eval("const HtmlElements = {\r\n    customerIdInput: document.getElementById('customer-id-input'),\r\n    dateInput: document.getElementById('date-input'),\r\n    form: document.getElementById('insert-form'),\r\n    insertButton: document.getElementById('insert-row-button'),\r\n    detailList: document.getElementById('detail-list')\r\n};\r\n\r\n\r\nconst insertReceiptUrl = '/insert-receipt-post';\r\nlet id = 2;\r\n\r\nHtmlElements.insertButton.onclick = () => {\r\n    insertDetail(id);\r\n    id += 1;\r\n}\r\n\r\nHtmlElements.form.addEventListener(\"submit\", (e) => {\r\n    // Prevent reload after submit form \r\n    e. preventDefault();\r\n\r\n    // Get customer id and date and all detail-list\r\n    let customer_id = HtmlElements.customerIdInput.value;\r\n    let date = HtmlElements.dateInput.value;\r\n    let product_detail_list = getDetailList(); \r\n    data = `customer_id=${customer_id}&date=${date}&product_detail_list=` + JSON.stringify(product_detail_list);\r\n\r\n    console.log(`Insert view: customer_id=${customer_id}&date=${date}&product_detail_list=` + JSON.stringify(product_detail_list));\r\n\r\n    let request = new XMLHttpRequest();\r\n    request.open('POST', insertReceiptUrl, true);\r\n    request.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");\r\n\r\n    request.onreadystatechange = function() { \r\n        // Call a function when the state changes.\r\n        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {\r\n            // Request finished. Do processing here.\r\n            alert(request.responseText);\r\n        }\r\n    }\r\n    request.send(data);\r\n})\r\n\r\nconst insertDetail = (detail_id) => {\r\n    html = ` <li id=\"detail${detail_id}\" class=\"grid width-12col tb-margin-smaller\">\r\n    <div class=\"width-3col\">\r\n        <label>Mã sản phẩm ${detail_id}</label>\r\n        <input id=\"product${detail_id}-id-input\" type=\"text\" name= \"product_id\">\r\n    </div>\r\n    <div class=\"width-4col\">\r\n        <label>Số lượng</label>\r\n        <input id=\"product${detail_id}-number-input\" type=\"number\" min=1 name=\"product_number\">\r\n    </div>\r\n    <div class=\"width-4col\">\r\n        <label>Giá</label>\r\n        <input id=\"product${detail_id}-price-input\" type=\"number\" min=0 name=\"product_price\">\r\n    </div>\r\n    <div class=\"width-1col tb-center\">\r\n        <button detail-id =${detail_id} class=\"delete-button far fa-trash-alt\" type=\"button\"></button>\r\n    </div>\r\n</li>`\r\n    HtmlElements.detailList.insertAdjacentHTML('beforeend', html);\r\n    setUpDeleteButton(detail_id);\r\n}\r\n\r\nconst setUpDeleteButton = (detail_id) => {\r\n    new_delete_button = HtmlElements.detailList.querySelector(`#detail${detail_id} div button`);\r\n    console.log(new_delete_button);\r\n    new_delete_button.onclick = handleDeleteDetail;\r\n}\r\n\r\nconst handleDeleteDetail = (e) => {\r\n    detail_id = e.target.getAttribute(\"detail-id\");\r\n    delete_detail_node = HtmlElements.detailList.querySelector(`#detail${detail_id}`);\r\n    HtmlElements.detailList.removeChild(delete_detail_node);\r\n}\r\n\r\nconst getDetailList = () => {\r\n    product_detail_list = []\r\n    for (let i = 1; i < id; i++) {\r\n        product_id_input = document.getElementById(`product${i}-id-input`);\r\n        if (!product_id_input)\r\n            continue;\r\n        product_number_input = document.getElementById(`product${i}-number-input`);\r\n        product_price_input = document.getElementById(`product${i}-price-input`);\r\n\r\n        product_id = product_id_input.value;\r\n        product_number = product_number_input.value;\r\n        product_price = product_price_input.value;\r\n        product_detail_list.push({\r\n            product_id: product_id,\r\n            product_number: product_number,\r\n            product_price: product_price,\r\n        });\r\n\r\n    }\r\n    return product_detail_list;\r\n}\n\n//# sourceURL=webpack://qlhd_ui/./src/insertView.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/insertView.js"]();
/******/ 	
/******/ })()
;