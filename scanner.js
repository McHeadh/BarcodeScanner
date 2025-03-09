let barcodeDatabase = [];
let scannedBarcode = '';
let scannedProduct = null; // Store product data for later use

// Load barcode data from the file (codes.json)
async function loadBarcodeData() {
    try {
        const response = await fetch('codes.json');
        if (!response.ok) {
            throw new Error("Failed to load barcode data");
        }
        barcodeDatabase = await response.json();
        console.log(barcodeDatabase);
    } catch (error) {
        console.error('Error loading barcode data:', error);
    }
}

// Initialize the barcode scanner
async function startScanner() {
    try {
        const videoElement = document.getElementById("barcode-video");
        videoElement.style.display = "block"; // Show video when scanning starts

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        videoElement.srcObject = stream;
        videoElement.play();
    } catch (err) {
        console.error("Camera access denied or unavailable:", err);
        return;
    }

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#barcode-video"),
            constraints: { facingMode: "environment" }
        },
        decoder: { readers: ["ean_reader", "upc_reader", "code_128_reader"] }
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        scannedBarcode = result.codeResult.code;

        const barcodeContainer = document.getElementById("barcode-result");
        barcodeContainer.innerHTML = "Scanned Barcode: ";

        const barcodeValueElement = document.createElement("span");
        barcodeValueElement.id = "scanned-barcode-value";
        barcodeValueElement.textContent = scannedBarcode;

        barcodeContainer.appendChild(barcodeValueElement);

        scannedProduct = barcodeDatabase.find(item => item.code === scannedBarcode);

        if (scannedProduct) {
            console.log("Product found:", scannedProduct);
            createDefrostingTable(scannedProduct);
        } else {
            console.log("Product not found in database");
        }

        // Stop scanner and hide video stream
        Quagga.stop();
        document.getElementById("create-event-btn").style.display = "inline-block";

        const videoElement = document.getElementById("barcode-video");
        const videoStream = videoElement.srcObject;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }

        // Hide video instead of removing it
        videoElement.style.display = "none";
    });
}


function createDefrostingTable(product) {
    const now = new Date();

    // First row: current date + defrosting time
    const defrostingDate = new Date(now);
    defrostingDate.setMinutes(defrostingDate.getMinutes() + product.hoursdefrosting * 60);

    // Second row: defrosting completed + expiration time
    const expirationDate = new Date(defrostingDate);
    expirationDate.setMinutes(expirationDate.getMinutes() + product.hoursuntillexpired * 60);

    function formatDate(date) {
        return date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    }

    const barcodeContainer = document.getElementById("barcode-result");

    // Remove old elements if they exist
    const existingTable = document.getElementById("defrosting-table");
    if (existingTable) existingTable.remove();

    const existingProductName = document.getElementById("product-name");
    if (existingProductName) existingProductName.remove();

    const existingInfo = document.getElementById("defrosting-info");
    if (existingInfo) existingInfo.remove();

    // Create product name heading
    const productName = document.createElement("h3");
    productName.id = "product-name";
    productName.textContent = `Product: ${product.name}`;
    barcodeContainer.appendChild(productName);

    // Create table
    const table = document.createElement("table");
    table.id = "defrosting-table";
    table.border = "1";

    // Create header row
    const headerRow = table.insertRow();
    headerRow.insertCell(0).textContent = "Date";
    headerRow.insertCell(1).textContent = "Time";

    // Create first row (defrosting completed)
    const row1 = table.insertRow();
    row1.insertCell(0).textContent = formatDate(defrostingDate);
    row1.insertCell(1).textContent = formatTime(defrostingDate);

    // Create second row (expiration time)
    const row2 = table.insertRow();
    row2.insertCell(0).textContent = formatDate(expirationDate);
    row2.insertCell(1).textContent = formatTime(expirationDate);

    barcodeContainer.appendChild(table);

    // Create info below the table
    const defrostingInfo = document.createElement("p");
    defrostingInfo.id = "defrosting-info";
    defrostingInfo.innerHTML = `Defrosting time: <b>${product.hoursdefrosting} hours</b><br>Expiration after defrosting: <b>${product.hoursuntillexpired} hours</b>`;
    barcodeContainer.appendChild(defrostingInfo);
}



// Load barcode data when the page is ready
loadBarcodeData();
