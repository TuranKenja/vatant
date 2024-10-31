let regionSelection = null;

// Wait until user selects an option
function initializeSelection() {
    return new Promise((resolve) => {
        document.querySelectorAll(".option-btn").forEach(button => {
            button.addEventListener("click", () => {
                regionSelection = button.getAttribute("data-option");
                console.log("Selected option:", regionSelection);
                resolve();
                document.getElementById("modal").style.display = "none";
            });
        });
    });
}
