function toggleDarkMode() {
    const body = document.body;
    const darkModeButton = document.getElementById("toggle-darkmode");
    const icon = darkModeButton.querySelector("i"); // Get the icon inside the button

    // Toggle the dark mode class on the body
    body.classList.toggle("dark-mode");

    // Change the icon based on the current mode
    if (body.classList.contains("dark-mode")) {
        // Switch to moon icon for dark mode
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        // Switch to sun icon for light mode
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}
