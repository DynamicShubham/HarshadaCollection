let customerData = JSON.parse(localStorage.getItem("customers")) || {};
function updateDatalist() {
  let dataList = document.getElementById("nameList");
  dataList.innerHTML = ""; // Clear old options
  for (let name in customerData) {
    let option = document.createElement("option");
    option.value = name;
    dataList.appendChild(option);
  }
}

document.getElementById("customerName").addEventListener("input", function () {
  let selectedName = this.value.trim();

  if (customerData[selectedName]) {
    document.getElementById("customerPhone").value = customerData[selectedName].phone;
    document.getElementById("customerAddress").value = customerData[selectedName].address;
  } else {
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";
  }
});

function saveAndContinue() {
  let name = document.getElementById("customerName").value.trim();
  let phone = document.getElementById("customerPhone").value.trim();
  let address = document.getElementById("customerAddress").value.trim();

  if (name && phone && address) {
    customerData[name] = { phone, address };
    localStorage.setItem("customers", JSON.stringify(customerData));
    updateDatalist(); // Refresh datalist
  }
  const customerDetails = document.getElementById('customerDetails');
  customerDetails.style.display = 'none';

  const itemDetails = document.getElementById('itemDetails');
  itemDetails.style.display = 'block';
}

updateDatalist();


// Array to store receipt items
let receiptItems = [];

// Shop name to display on the receipt
const shopName = "Harshada Collection";

// Load saved items from localStorage
function loadItems() {
  const savedItems = JSON.parse(localStorage.getItem("items")) || ["soap"];
  savedItems.forEach(item => addItemToDataList(item));
}

// Add new item to datalist and localStorage
function addItemToDataList(item) {
  const dataList = document.getElementById("itemList");
  
  if (![...dataList.options].some(option => option.value === item)) {
    const option = document.createElement("option");
    option.value = item;
    dataList.appendChild(option);
    
    // Save to localStorage
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    if (!savedItems.includes(item)) {
      savedItems.push(item);
      localStorage.setItem("items", JSON.stringify(savedItems));
    }
  }
}

// Function to add an item to the receipt
function addItem(){
  const itemName = document.getElementById('itemName').value;
  const itemMRP = parseFloat(document.getElementById('itemMRP').value);
  const itemPrice = parseFloat(document.getElementById('itemPrice').value);
  const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
  
  
  if (!itemName || isNaN(itemPrice) || itemPrice <= 0 || isNaN(itemQuantity) || itemQuantity <= 0) {
    alert('Please enter valid item details.');
    return;
  }

  addItemToDataList(itemName);

  const newItem = { name: itemName, mrp: itemMRP, price: itemPrice, quantity: itemQuantity };
  receiptItems.push(newItem);

  displayReceipt();

  document.getElementById('itemName').value = '';
  document.getElementById('itemMRP').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemQuantity').value = '';

}

// Load items on page load
loadItems();

// Function to remove an item from the receipt
function removeItem(index) {
  receiptItems.splice(index, 1);
  displayReceipt();
}

// Function to display the receipt on the screen
function displayReceipt() {
  const receiptDiv = document.getElementById('receipt');
  receiptDiv.innerHTML = '';

  receiptItems.forEach((item, index) => {
    const newItem = document.createElement('div');
    newItem.innerHTML = `<button style = "width=10px"; onclick="removeItem(${index})">-</button> <strong>${item.name} ::</strong> ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}        (MRP: ₹${item.mrp})`;
    receiptDiv.appendChild(newItem);
  });

  // Scroll to the bottom of the receipt
  receiptDiv.scrollTop = receiptDiv.scrollHeight;

}

// Function to generate a printable PDF receipt
function generatePDF() {
  let itemsTable = '<table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">';
  itemsTable += '<tr style="background:lightgrey;"><th style="text-align:left; padding: 8px;">Sr. No.</th><th style="text-align:left; padding: 8px; width: 40%;"> Item Name </th><th style="text-align:right; padding: 8px;"> Quantity </th> <th style="text-align:right; padding: 8px;">MRP(₹)</th> <th style="text-align:right; padding: 8px;">Price(₹)</th><th style="text-align:right; padding: 8px;">Amount (₹)</th></tr>';

  let totalAmount = 0;

  receiptItems.forEach((item, index) => {
    const serialNumber = index + 1;
    totalAmount += item.price * item.quantity;
    itemsTable += `<tr><td style="padding: 8px;">${serialNumber}</td><td style="padding: 8px;">${item.name}</td><td style="text-align:right; padding: 8px;">${item.quantity}</td> <td style="text-align:right; padding: 8px;">₹${item.mrp.toFixed(2)}</td> <td style="text-align:right; padding: 8px;">₹${item.price.toFixed(2)}</td><td style="text-align:right; padding: 8px;">₹${(item.price * item.quantity).toFixed(2)}</td></tr>`;
  });

  const cname = document.getElementById('customerName').value;
  const cph = document.getElementById('customerPhone').value;
  const cadd = document.getElementById('customerAddress').value;
  const amt = parseFloat(document.getElementById('received').value) || 0;

  itemsTable += `<tr style="border-top:2px solid black;"><td colspan="3" style="text-align:right; padding: 8px;"><strong>Total:</strong></td><td colspan="2" style="text-align:center; padding: 8px;"><strong>₹${totalAmount.toFixed(2)}</strong></td></tr>`;
  itemsTable += '</table>';

  const shopHeader = `<img src="cover.png" alt="Shop Logo" style="width:400px; margin:25px 0px 0px 0px ; ">`;

  const shopDetails = `<p><strong>Nikhil Patkar: +91 7028225504</strong></p>`;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

  const customerDetails = `
  <div style="display: flex; flex-direction: column; margin: 10px 0;">
    <p style = "margin :0px;"><strong>Customer Name:</strong> ${cname}</p>
    <p style = "margin :0px;"><strong>Phone:</strong> ${cph}</p>
    <p style = "margin :0px;"><strong>Address:</strong> ${cadd}</p>
  </div>`;

  const dateDiv = `<div style="display:flex; justify-content:right; margin:5px 10px;">Date: ${formattedDate}</div>`;
  const total = `<div style="display:flex; justify-content:right; margin:5px 10px;">Total Amount: ₹${totalAmount}</div>`;
  const recamt = `<div style="display:flex; justify-content:right; margin:5px 10px;">Paid Amount: ₹${amt}</div>`;
  const balance = `<div style="display:flex; justify-content:right; margin:5px 10px;">Transaction Balance: ₹${(totalAmount - amt).toFixed(2)}</div>`;

  const content = `
  <html>
    <head>
        <title>${shopName}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            div {
                display: flex;
                gap: 5px;
                justify-content: center;
            }
            div img {
                display: flex;
                width: 400px;
            }
            p {
                line-height: 30px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                
            }

            /* Hide header and footer in the print dialog */
            @page {
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 0;
                margin-right: 0;
                size: auto;
                /* This will remove headers/footers in the print layout */
                mso-footer-space: 10cm;
                mso-header-space: 10cm;
            }
            @media print {
                body {
                    margin-top: 0;
                    margin-bottom: 0;
                }

                /* Hide the default header and footer */
                .header, .footer {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        <div>${shopHeader}</div>
        ${shopDetails} 
        ${dateDiv} 
        ${customerDetails} 
        ${itemsTable} 
        ${total} 
        ${recamt} 
        ${balance}
    </body>
  </html>`;

  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();

  // Ensure image and resources are loaded before printing
  printWindow.onload = () => {
    printWindow.print();
  };
}
