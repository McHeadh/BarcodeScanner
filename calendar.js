let barcodeDatabase = [];
let scannedBarcode = '';
let scannedProduct = null;

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

function scheduleEvent() {

    scannedBarcode = document.getElementById("scanned-barcode-value").textContent;

    scannedProduct = barcodeDatabase.find(item => item.code === scannedBarcode);

    const now = new Date();
    now.setMinutes(now.getMinutes() + scannedProduct.hoursdefrosting);

    const title = "Time for donuts!";
    const description = `Scanned Barcode: ${scannedBarcode}`;

    // Format the date as required by .ics (YYYYMMDDTHHMMSSZ)
    function formatDate(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
    }

    // Event in .ics format
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${formatDate(now)}
DTEND:${formatDate(now)}
BEGIN:VALARM
TRIGGER:-PT0M
DESCRIPTION:${title}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "defrosting-event.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

loadBarcodeData();
