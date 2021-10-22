const HtmlElements = {
    customerIdInput: document.getElementById('customer-id-input'),
    dateInput: document.getElementById('date-input'),
    form: document.getElementById('insert-form')
};

const insertReceiptUrl = '/insert-receipt-post';

HtmlElements.form.addEventListener("submit", (e) => {
    // Prevent reload after submit form 
    e. preventDefault();

    // Get customer id and date
    let customer_id = HtmlElements.customerIdInput.value;
    let date = HtmlElements.dateInput.value;

    console.log(`Insert view: customer_id=${customer_id}&date=${date}`);

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
    request.send(`customer_id=${customer_id}&date=${date}`);
})