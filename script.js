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

    if (!desc || !qty || !rate) return alert("Fill all fields");

    const amount = qty * rate;
    subtotal += amount;

    const tableBody = document.getElementById('line-items');

    const row = document.createElement('tr');
row.innerHTML = `
    <td>${srNo++}</td>
    <td style="text-align:left">${desc}</td>
    <td>${qty}</td>
    <td>${unit}</td>
    <td>${rate.toLocaleString('en-IN')}</td>
    <td>${amount.toLocaleString('en-IN')}</td>

`;

    tableBody.appendChild(row);
    updateTotals();

    // Clear input fields
    document.getElementById('desc').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('rate').value = '';
}


function updateTotals() {
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;

    document.getElementById('subtotal').innerText = subtotal.toLocaleString('en-IN');
    document.getElementById('gst').innerText = gstAmount.toLocaleString('en-IN');
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