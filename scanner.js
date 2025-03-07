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
        document.getElementById("barcode-result").innerHTML = `Scanned Barcode: <strong>${scannedBarcode}</strong>`;

        // Find the matching product from the barcode database
        scannedProduct = barcodeDatabase.find(item => item.code === scannedBarcode);

        if (scannedProduct) {
            console.log("Product found:", scannedProduct);
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
    });
}

// Load barcode data when the page is ready
loadBarcodeData();
