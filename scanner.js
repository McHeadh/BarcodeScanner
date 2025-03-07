let scannedBarcode = '';

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
