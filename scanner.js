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
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        const videoElement = document.getElementById("barcode-video");
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

        setTimeout(() => {
            videoElement.remove(); // Remove the video element
            const newVideoElement = document.createElement("video");
            newVideoElement.id = "barcode-video";
            newVideoElement.style.width = "100%";
            newVideoElement.style.maxWidth = "400px";
            document.body.appendChild(newVideoElement);
        }, 100);
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
        return date.toLocaleDateString("pl-PL");
    }

    function formatTime(date) {
        return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    }

    // Remove old table if it exists
    const existingTable = document.getElementById("defrosting-table");
    if (existingTable) {
        existingTable.remove();
    }

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

    // Append table to barcode result container
    document.getElementById("barcode-result").appendChild(table);
}


// Load barcode data when the page is ready
loadBarcodeData();
