let srNo = 1;
let subtotal = 0;

function updateClient() {
    const name = document.getElementById('input-client-name').value;
    const address1 = document.getElementById('input-client-address').value;
    const address2 = document.getElementById('input-client-address2').value;

    if (name) {
        document.getElementById('client-name').innerText = name;
    }

    if (address1) {
        document.getElementById('client-address').innerText = address1;
    }

    if (address2) {
        document.getElementById('client-address2').innerText = address2;
    }

}

function updateQuoteDetails() {
    const quoteNo = document.getElementById('input-quote-no').value;
    const quoteDate = document.getElementById('input-quote-date').value;
    const quoteSubject = document.getElementById('input-quote-subject').value;

    if (quoteNo) {
        document.getElementById('quote-no').innerText = quoteNo;
    }

    if (quoteDate) {
        // Convert date format to DD-MM-YYYY
        const formattedDate = new Date(quoteDate).toLocaleDateString('en-GB');
        document.getElementById('quote-date').innerText = formattedDate;
    }
        if (quoteSubject) {
        document.getElementById('quote-subject').innerText = quoteSubject;
    }
}

function updateTerms() {
    const termsText = document.getElementById('input-terms').value;
    const termsList = document.getElementById('terms-list');

    if (!termsText) {
        alert("Please enter terms & conditions");
        return;
    }

    const termsArray = termsText.split('\n');

    termsList.innerHTML = '';

    termsArray.forEach(term => {
        if (term.trim() !== '') {
            const li = document.createElement('li');
            li.innerText = term;
            termsList.appendChild(li);
        }
    });
}

function addItem() {

    const desc = document.getElementById('desc').value;
    const qty = parseFloat(document.getElementById('qty').value);
    const unit = document.getElementById('unit').value;
    const rate = parseFloat(document.getElementById('rate').value);

    const amount = qty * rate;

    const table = document.getElementById('items-table');

    const row = table.insertRow();

    row.innerHTML = `
        <td>${srNo}</td>
        <td>${desc}</td>
        <td>${qty}</td>
        <td>${unit}</td>
        <td>${rate}</td>
        <td>${amount}</td>
    `;

    srNo++;
    subtotal += amount;

    updateTotals();
}

function loadLineItem() {

    const lineNo = parseInt(document.getElementById('edit-line-no').value);
    const table = document.getElementById('items-table');

    if (!lineNo || lineNo < 1) {
        alert("Enter valid Line No");
        return;
    }

    if (lineNo >= table.rows.length) {
        alert("Line not found");
        return;
    }

    const row = table.rows[lineNo];

    document.getElementById('edit-desc').value = row.cells[1].innerText;
    document.getElementById('edit-qty').value = row.cells[2].innerText;
    document.getElementById('edit-unit').value = row.cells[3].innerText;
    document.getElementById('edit-rate').value = row.cells[4].innerText;
}


function updateLineItem() {

    const lineNo = parseInt(document.getElementById('edit-line-no').value);

    const table = document.getElementById('items-table');

    if (lineNo >= 1 && lineNo < table.rows.length) {

        const row = table.rows[lineNo];

        const qty = parseFloat(document.getElementById('edit-qty').value);
        const rate = parseFloat(document.getElementById('edit-rate').value);

        const amount = qty * rate;

        row.cells[1].innerText = document.getElementById('edit-desc').value;
        row.cells[2].innerText = qty;
        row.cells[3].innerText = document.getElementById('edit-unit').value;
        row.cells[4].innerText = rate;
        row.cells[5].innerText = amount;

        recalculateSubtotal();

    } else {
        alert("Invalid Line Number");
    }
}

function deleteLineItem() {

    const lineNo = parseInt(document.getElementById('edit-line-no').value);
    const table = document.getElementById('items-table');

    if (!lineNo || lineNo < 1) {
        alert("Enter valid Line No");
        return;
    }

    if (lineNo >= table.rows.length) {
        alert("Line not found");
        return;
    }

    // Confirm before deleting
    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }

    // Remove row
    table.deleteRow(lineNo);

    // Renumber serial numbers
    renumberRows();

    // Recalculate subtotal
    recalculateSubtotal();

    // Clear edit fields
    document.getElementById('edit-line-no').value = "";
    document.getElementById('edit-desc').value = "";
    document.getElementById('edit-qty').value = "";
    document.getElementById('edit-unit').value = "";
    document.getElementById('edit-rate').value = "";
}

function renumberRows() {

    const table = document.getElementById('items-table');

    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerText = i;
    }

    srNo = table.rows.length; // reset serial counter
}

function recalculateSubtotal() {

    const table = document.getElementById('items-table');
    subtotal = 0;

    for (let i = 1; i < table.rows.length; i++) {

        subtotal += parseFloat(table.rows[i].cells[5].innerText);
    }

    updateTotals();
}

function updateTotals() {

    const discountValue = parseFloat(document.getElementById('discount-value').value) || 0;
    const discountType = document.getElementById('discount-type').value;
    const discountRow = document.getElementById('discount-row');

    let discountAmount = 0;

    // ---- Calculate Discount ----
    if (discountValue > 0) {

        if (discountType === "percent") {
            discountAmount = subtotal * (discountValue / 100);
        } else {
            discountAmount = discountValue;
        }

        discountRow.style.display = "table-row";
    } else {
        discountRow.style.display = "none";
    }

    const afterDiscount = subtotal - discountAmount;

    // ---- Custom Tax Logic ----
    const taxName = document.getElementById("custom-tax-name").value.trim();
    const taxPercent = parseFloat(document.getElementById("custom-tax-percent").value) || 0;
    const taxRow = document.getElementById("custom-tax-row");

    let taxAmount = 0;

    if (taxName !== "" && taxPercent > 0) {

        taxAmount = afterDiscount * (taxPercent / 100);

        taxRow.style.display = "table-row";

        document.getElementById("tax-name-label").innerText = taxName;
        document.getElementById("tax-percent-label").innerText = taxPercent;
        document.getElementById("custom-tax-amount").innerText = taxAmount.toLocaleString('en-IN');

    } else {
        taxRow.style.display = "none";
    }

    const grandTotal = afterDiscount + taxAmount;

    // ---- Update UI ----
    document.getElementById('subtotal').innerText = subtotal.toLocaleString('en-IN');
    document.getElementById('discount-amount').innerText = discountAmount.toLocaleString('en-IN');
    document.getElementById('grand-total').innerText = grandTotal.toLocaleString('en-IN');
}

function generatePDF() {
    const element = document.getElementById('quotation-template');


    let quoteNo = document.getElementById('input-quote-no').value;
    let quoteDate = document.getElementById('input-quote-date').value;

    if (!quoteNo) {
    quoteNo = "Quotation";
    }

// Format date to DD-MM-YYYY
    if (quoteDate) {
    quoteDate = new Date(quoteDate).toLocaleDateString('en-GB');
    } else {
    quoteDate = "";
    }

// Clean invalid characters
    quoteNo = quoteNo.replace(/[\/\\:*?"<>|]/g, '_');

    let fileName = "Quotation_" + quoteNo;

    if (quoteDate) {
    fileName += "_" + quoteDate;
   }

    const opt = {
        margin: [10, 0, 10, 0], // Top, Left, Bottom, Right
        filename: quoteNo + '.pdf',
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2,              // High resolution
            useCORS: true,
            width: 794,            // Match A4 width
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
        
    };

    html2pdf().set(opt).from(element).save();
}

