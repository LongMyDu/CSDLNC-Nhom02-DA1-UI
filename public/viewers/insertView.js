const HtmlElements = {
    customerIdInput: document.getElementById('customer-id-input'),
    dateInput: document.getElementById('date-input'),
    form: document.getElementById('insert-form'),
    insertButton: document.getElementById('insert-row-button'),
    detailList: document.getElementById('detail-list')
};


const insertReceiptUrl = '/insert-receipt-post';
let id = 2;

HtmlElements.insertButton.onclick = () => {
    insertDetail(id);
    id += 1;
}

HtmlElements.form.addEventListener("submit", (e) => {
    // Prevent reload after submit form 
    e. preventDefault();

    // Get customer id and date and all detail-list
    let customer_id = HtmlElements.customerIdInput.value;
    let date = HtmlElements.dateInput.value;
    let product_detail_list = getDetailList(); 
    data = `customer_id=${customer_id}&date=${date}&product_detail_list=` + JSON.stringify(product_detail_list);

    console.log(`Insert view: customer_id=${customer_id}&date=${date}&product_detail_list=` + JSON.stringify(product_detail_list));

    let request = new XMLHttpRequest();
    request.open('POST', insertReceiptUrl, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() { 
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            alert(request.responseText);
        }
    }
    request.send(data);
})

const insertDetail = (detail_id) => {
    html = ` <li id="detail${detail_id}" class="grid width-12col tb-margin-smaller">
    <div class="width-3col">
        <label>Mã sản phẩm ${detail_id}</label>
        <input id="product${detail_id}-id-input" type="text" name= "product_id">
    </div>
    <div class="width-4col">
        <label>Số lượng</label>
        <input id="product${detail_id}-number-input" type="number" min=1 name="product_number">
    </div>
    <div class="width-4col">
        <label>Giá</label>
        <input id="product${detail_id}-price-input" type="number" min=0 name="product_price">
    </div>
    <div class="width-1col tb-center">
        <button detail-id =${detail_id} class="delete-button far fa-trash-alt" type="button"></button>
    </div>
</li>`
    HtmlElements.detailList.insertAdjacentHTML('beforeend', html);
    setUpDeleteButton(detail_id);
}

const setUpDeleteButton = (detail_id) => {
    new_delete_button = HtmlElements.detailList.querySelector(`#detail${detail_id} div button`);
    console.log(new_delete_button);
    new_delete_button.onclick = handleDeleteDetail;
}

const handleDeleteDetail = (e) => {
    detail_id = e.target.getAttribute("detail-id");
    delete_detail_node = HtmlElements.detailList.querySelector(`#detail${detail_id}`);
    HtmlElements.detailList.removeChild(delete_detail_node);
}

const getDetailList = () => {
    product_detail_list = []
    for (let i = 1; i < id; i++) {
        product_id_input = document.getElementById(`product${i}-id-input`);
        if (!product_id_input)
            continue;
        product_number_input = document.getElementById(`product${i}-number-input`);
        product_price_input = document.getElementById(`product${i}-price-input`);

        product_id = product_id_input.value;
        product_number = product_number_input.value;
        product_price = product_price_input.value;
        product_detail_list.push({
            product_id: product_id,
            product_number: product_number,
            product_price: product_price,
        });

    }
    return product_detail_list;
}