function createEvent() {
    if (!scannedBarcode) {
        alert("No barcode scanned!");
        return;
    }

    const eventTitle = "Time for donuts";
    const description = `Scanned Barcode: ${scannedBarcode}`;
    const location = "Your Location";

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 2);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    function formatDate(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
    }

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventTitle}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `event_time_for_donuts.ics`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
