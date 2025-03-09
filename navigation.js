function toggleDarkMode() {
    const body = document.body;
    const darkModeButton = document.getElementById("toggle-darkmode");

    // Toggle the dark mode class on the body
    body.classList.toggle("dark-mode");

    // Change button text based on the current mode
    if (body.classList.contains("dark-mode")) {
        darkModeButton.textContent = "Switch to Light Mode";
    } else {
        darkModeButton.textContent = "Switch to Dark Mode";
    }
}
