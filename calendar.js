function logMessage(message) {
    const logElement = document.getElementById("logs");
    logElement.innerHTML += "<br>➤ " + message;
}

logMessage("✅ Log system initialized.");

function scheduleEvent() {
    logMessage("🟢 Button Clicked! Creating calendar event...");

    // Get the time for the event (2 minutes from now)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2); // Event in 2 minutes

    const title = "Time for donuts!";
    const description = `Scanned Barcode: ${scannedBarcode}`;
    const location = "Your Location";

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
LOCATION:${location}
DTSTART:${formatDate(now)}
DTEND:${formatDate(now)}  // The same start and end time for a fixed-time event
BEGIN:VALARM
TRIGGER:-PT0M  // The alarm triggers immediately (0 minutes before)
DESCRIPTION:${title}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
    `.trim();

    logMessage("📅 Generating .ics file...");

    // Create the blob and link to download the .ics file
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "event_time_for_donuts.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logMessage("✅ .ics file should have downloaded!");
}




