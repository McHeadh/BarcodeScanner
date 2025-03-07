function scheduleEvent() {

    const now = new Date();
    now.setHours(now.getHours() + scannedProduct.hoursdefrosting);

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
