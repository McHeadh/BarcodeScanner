// Function to schedule an event based on the defrosting time
function createEvent() {
    if (!scannedProduct) {
        console.log("No product scanned");
        return;
    }

    // Get the defrosting time from the scanned product
    const defrostingTime = scannedProduct.hoursdefrosting;
    const currentDate = new Date();
    const eventTime = new Date(currentDate.getTime() + defrostingTime * 60 * 60 * 1000);  // Add defrosting time in hours

    const title = `Defrosting Time for ${scannedProduct.name}`;
    const description = `Barcode: ${scannedProduct.code}\nProduct: ${scannedProduct.name}`;

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
DTSTART:${formatDate(eventTime)}
DTEND:${formatDate(eventTime)}
LOCATION:None
STATUS:TENTATIVE
BEGIN:VALARM
TRIGGER:-PT10M
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

    console.log("ICS event created and ready to be downloaded");
}
