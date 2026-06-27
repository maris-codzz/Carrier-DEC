window.resetWizard = function() {
    // Clear state
    appState.currentStep = 1;
    appState.studentName = "";
    appState.marks10 = { total: 0, math: 0, science: 0 };
    appState.stream = "";
    appState.marks12 = {};
    appState.analysisResult = null;

    // Reset form fields safely
    const form1 = document.getElementById("form-step-1");
    const form3 = document.getElementById("form-step-3");
    if (form1) form1.reset();
    if (form3) form3.reset();

    // Reset stream select manually
    const streamSelect = document.getElementById("stream-select");
    if (streamSelect) streamSelect.value = "";

    // Reset dynamic subjects container
    const dynamicContainer = document.getElementById("dynamic-subjects-container");
    if (dynamicContainer) {
        dynamicContainer.className = "form-row dynamic-inputs";
        dynamicContainer.innerHTML = `
            <div class="no-stream-selected-msg col-12">
                <i class="fa-solid fa-arrow-pointer"></i> Please select a stream above to input your marks.
            </div>
        `;
    }

    // Remove all error highlights
    document.querySelectorAll("input, select").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-msg").forEach(el => el.style.display = "none");

    // Reset Interest Slider display values back to 50%
    const sliderDefaults = ["tech", "math", "science", "business", "arts", "social"];
    sliderDefaults.forEach(key => {
        const slider = document.getElementById(`interest-${key}`);
        const label = document.getElementById(`val-${key}`);
        if (slider) slider.value = 50;
        if (label) label.innerText = "50%";
    });

    // Reset processing logs and progress bar for next use
    const logsContainer = document.getElementById("processing-logs");
    const progressFill = document.getElementById("loader-progress");
    const processingTitle = document.getElementById("processing-title");
    if (logsContainer) logsContainer.innerHTML = "";
    if (progressFill) progressFill.style.width = "0%";
    if (processingTitle) processingTitle.innerText = "Initiating Analysis Engine...";

    // Hide all sections cleanly
    document.querySelectorAll("section").forEach(s => s.classList.remove("active-section"));

    // Show analyzer section
    document.getElementById("analyzer-section").classList.add("active-section");

    // Navigate to step 1
    navigateToStep(1);

    // Scroll to top
    window.scrollTo(0, 0);
};
