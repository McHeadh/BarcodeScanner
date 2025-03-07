function createEvent(product) {
    const defrostingTime = product.hoursdefrosting;
    const currentDate = new Date();
    const eventTime = new Date(currentDate.getTime() + defrostingTime * 60 * 60 * 1000);

    const eventStartDate = eventTime.toISOString().replace(/-|:|\.\d+/g, '');
    const eventEndDate = new Date(eventTime.getTime() + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Defrosting Time for ${product.name}
DESCRIPTION:Barcode: ${product.code}
DTSTART:${eventStartDate}
DTEND:${eventEndDate}
LOCATION:None
STATUS:TENTATIVE
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder to check ${product.name}!
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
    `;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'defrosting-event.ics';
    link.click();
    console.log("ICS event created and ready to be downloaded");
}
