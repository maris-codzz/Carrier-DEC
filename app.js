/* ==========================================================================
   STATE MANAGEMENT & CONFIGURATION
   ========================================================================== */
const appState = {
    currentStep: 1,
    studentName: "",
    marks10: { total: 0, math: 0, science: 0 },
    stream: "",
    marks12: {}, // Dynamic subject marks
    interests: {
        tech: 50,
        math: 50,
        science: 50,
        business: 50,
        arts: 50,
        social: 50
    },
    analysisResult: null
};

// Stream details and their subject lists
const STREAMS_CONFIG = {
    pcmc: {
        name: "Physics, Chemistry, Maths, Computer Science (PCMC)",
        subjects: [
            { id: "math12", name: "Mathematics", weight: "core" },
            { id: "physics12", name: "Physics", weight: "core" },
            { id: "chemistry12", name: "Chemistry", weight: "core" },
            { id: "cs12", name: "Computer Science", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    },
    pcmb: {
        name: "Physics, Chemistry, Maths, Biology (PCMB)",
        subjects: [
            { id: "math12", name: "Mathematics", weight: "core" },
            { id: "physics12", name: "Physics", weight: "core" },
            { id: "chemistry12", name: "Chemistry", weight: "core" },
            { id: "biology12", name: "Biology", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    },
    pcb: {
        name: "Physics, Chemistry, Biology, Other (Pure Science/PCB)",
        subjects: [
            { id: "physics12", name: "Physics", weight: "core" },
            { id: "chemistry12", name: "Chemistry", weight: "core" },
            { id: "biology12", name: "Biology", weight: "core" },
            { id: "elective12", name: "Elective (e.g. Biotech/Home Sci)", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    },
    commerce_math: {
        name: "Commerce with Mathematics / Accountancy",
        subjects: [
            { id: "accountancy12", name: "Accountancy", weight: "core" },
            { id: "commerce12", name: "Commerce", weight: "core" },
            { id: "economics12", name: "Economics", weight: "core" },
            { id: "math12", name: "Business Mathematics / Maths", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    },
    commerce_no_math: {
        name: "Commerce with Computer Applications / Economics",
        subjects: [
            { id: "accountancy12", name: "Accountancy", weight: "core" },
            { id: "commerce12", name: "Commerce", weight: "core" },
            { id: "economics12", name: "Economics", weight: "core" },
            { id: "ca12", name: "Computer Applications / Business Studies", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    },
    arts: {
        name: "Humanities / Arts Stream",
        subjects: [
            { id: "history12", name: "History / Political Science", weight: "core" },
            { id: "economics12", name: "Economics / Sociology", weight: "core" },
            { id: "geography12", name: "Geography / Literature", weight: "core" },
            { id: "electiveArts12", name: "Arts Elective Subject", weight: "elective" },
            { id: "english12", name: "English", weight: "language" },
            { id: "lang12", name: "Second Language", weight: "language" }
        ]
    }
};

/* ==========================================================================
   DOM INITIALIZATION & LISTENERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Navigation / Routing
    setupNavigation();
    
    // Theme System
    setupThemeToggle();
    
    // Wizard Control Flow
    setupWizardFlow();
    
    // Dynamic Subject Fields rendering
    setupDynamicSubjectFields();
    
    // Interest Slider values rendering
    setupInterestSliders();
    
    // Chatbot Initialization
    setupChatbot();
});

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function setupThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    
    // Load local storage theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
    
    toggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function setupNavigation() {
    const sections = {
        home: document.getElementById("hero-section"),
        analyzer: document.getElementById("analyzer-section"),
        about: document.getElementById("info-section"),
        dashboard: document.getElementById("dashboard-section")
    };
    
    const navLinks = {
        home: document.getElementById("nav-home"),
        analyzer: document.getElementById("nav-analyzer"),
        about: document.getElementById("nav-info"),
        logo: document.getElementById("nav-logo")
    };
    
    const startBtn = document.getElementById("start-analyzer-btn");
    const learnMoreBtn = document.getElementById("learn-more-btn");
    const backToHomeBtn = document.getElementById("btn-back-to-home");
    
    function showSection(sectionKey) {
        // Hide all
        Object.values(sections).forEach(s => s.classList.remove("active-section"));
        // Show selected
        sections[sectionKey].classList.add("active-section");
        
        // Update Nav Menu highlight
        Object.values(navLinks).forEach(l => {
            if (l) l.classList.remove("active");
        });
        
        if (navLinks[sectionKey]) {
            navLinks[sectionKey].classList.add("active");
        }
        
        // Auto scroll to top
        window.scrollTo(0, 0);
    }
    
    if (navLinks.home) navLinks.home.addEventListener("click", (e) => { e.preventDefault(); showSection("home"); });
    if (navLinks.analyzer) navLinks.analyzer.addEventListener("click", (e) => { e.preventDefault(); showSection("analyzer"); });
    if (navLinks.about) navLinks.about.addEventListener("click", (e) => { e.preventDefault(); showSection("about"); });
    if (navLinks.logo) navLinks.logo.addEventListener("click", (e) => { e.preventDefault(); showSection("home"); });
    
    if (startBtn) startBtn.addEventListener("click", () => showSection("analyzer"));
    if (learnMoreBtn) learnMoreBtn.addEventListener("click", () => showSection("about"));
    if (backToHomeBtn) backToHomeBtn.addEventListener("click", () => showSection("home"));
}

/* ==========================================================================
   WIZARD FLOW & STEP CONTROL
   ========================================================================== */
function setupWizardFlow() {
    const steps = [
        document.getElementById("step-1"),
        document.getElementById("step-2"),
        document.getElementById("step-3"),
        document.getElementById("step-4")
    ];
    
    const indicators = [
        document.getElementById("indicator-1"),
        document.getElementById("indicator-2"),
        document.getElementById("indicator-3"),
        document.getElementById("indicator-4")
    ];
    
    const lines = [
        document.getElementById("line-1"),
        document.getElementById("line-2"),
        document.getElementById("line-3")
    ];
    
    function navigateToStep(stepNum) {
        if (stepNum < 1 || stepNum > 4) return;
        
        appState.currentStep = stepNum;
        
        // Update visibility of steps
        steps.forEach((step, idx) => {
            if (idx + 1 === stepNum) {
                step.classList.add("active-step");
            } else {
                step.classList.remove("active-step");
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, idx) => {
            if (idx + 1 < stepNum) {
                indicator.className = "step-indicator completed";
            } else if (idx + 1 === stepNum) {
                indicator.className = "step-indicator active";
            } else {
                indicator.className = "step-indicator";
            }
        });
        
        // Update connection lines
        lines.forEach((line, idx) => {
            if (idx + 1 < stepNum) {
                line.className = "step-line completed";
            } else {
                line.className = "step-line";
            }
        });
    }
    
    // Step 1: Next Button
    document.getElementById("btn-goto-step2").addEventListener("click", () => {
        if (validateStep1()) {
            navigateToStep(2);
        }
    });
    
    // Step 2: Back Button
    document.getElementById("btn-backto-step1").addEventListener("click", () => {
        navigateToStep(1);
    });
    
    // Step 2: Next Button
    document.getElementById("btn-goto-step3").addEventListener("click", () => {
        if (validateStep2()) {
            navigateToStep(3);
        }
    });
    
    // Step 3: Back Button
    document.getElementById("btn-backto-step2").addEventListener("click", () => {
        navigateToStep(2);
    });
    
    // Step 3: Submit / Generate Recommendation Button
    document.getElementById("btn-submit-analyzer").addEventListener("click", () => {
        // Collect interests
        appState.interests.tech = parseInt(document.getElementById("interest-tech").value);
        appState.interests.math = parseInt(document.getElementById("interest-math").value);
        appState.interests.science = parseInt(document.getElementById("interest-science").value);
        appState.interests.business = parseInt(document.getElementById("interest-business").value);
        appState.interests.arts = parseInt(document.getElementById("interest-arts").value);
        appState.interests.social = parseInt(document.getElementById("interest-social").value);
        
        navigateToStep(4);
        runAIAnalysis();
    });
    
    // Expose reset trigger
    window.resetWizard = function() {
        // Clear state
        appState.currentStep = 1;
        appState.studentName = "";
        appState.marks10 = { total: 0, math: 0, science: 0 };
        appState.stream = "";
        appState.marks12 = {};
        appState.analysisResult = null;
        
        // Reset fields
        document.getElementById("form-step-1").reset();
        document.getElementById("form-step-2").reset();
        document.getElementById("form-step-3").reset();
        
        // Reset dynamic elements
        document.getElementById("stream-select").value = "";
        const dynamicContainer = document.getElementById("dynamic-subjects-container");
        dynamicContainer.className = "form-row dynamic-inputs";
        dynamicContainer.innerHTML = `
            <div class="no-stream-selected-msg col-12">
                <i class="fa-solid fa-arrow-pointer"></i> Please select a stream above to input your marks.
            </div>
        `;
        
        // Remove error highlights
        const inputs = document.querySelectorAll("input, select");
        inputs.forEach(el => el.classList.remove("invalid"));
        const errors = document.querySelectorAll(".error-msg");
        errors.forEach(el => el.style.display = "none");
        
        // Reset Interest Slider Display values
        document.getElementById("val-tech").innerText = "50%";
        document.getElementById("val-math").innerText = "50%";
        document.getElementById("val-science").innerText = "50%";
        document.getElementById("val-business").innerText = "50%";
        document.getElementById("val-arts").innerText = "50%";
        document.getElementById("val-social").innerText = "50%";
        
        navigateToStep(1);
        
        // Route to Analyzer view
        document.getElementById("hero-section").classList.remove("active-section");
        document.getElementById("dashboard-section").classList.remove("active-section");
        document.getElementById("info-section").classList.remove("active-section");
        document.getElementById("analyzer-section").classList.add("active-section");
    };
    
    document.getElementById("btn-restart").addEventListener("click", window.resetWizard);
}

/* ==========================================================================
   INPUT VALIDATION FUNCTIONS
   ========================================================================== */
function validateStep1() {
    let isValid = true;
    
    const nameInput = document.getElementById("student-name");
    const m10tInput = document.getElementById("marks-10-total");
    const m10mInput = document.getElementById("marks-10-math");
    const m10sInput = document.getElementById("marks-10-science");
    
    // Name Validation
    if (!nameInput.value.trim()) {
        nameInput.classList.add("invalid");
        document.getElementById("name-error").style.display = "block";
        isValid = false;
    } else {
        nameInput.classList.remove("invalid");
        document.getElementById("name-error").style.display = "none";
        appState.studentName = nameInput.value.trim();
    }
    
    // 10th Total Validation
    const totalVal = parseFloat(m10tInput.value);
    if (isNaN(totalVal) || totalVal < 35 || totalVal > 100) {
        m10tInput.classList.add("invalid");
        document.getElementById("m10t-error").style.display = "block";
        isValid = false;
    } else {
        m10tInput.classList.remove("invalid");
        document.getElementById("m10t-error").style.display = "none";
        appState.marks10.total = totalVal;
    }
    
    // 10th Maths Validation
    const mathVal = parseInt(m10mInput.value);
    if (isNaN(mathVal) || mathVal < 0 || mathVal > 100) {
        m10mInput.classList.add("invalid");
        document.getElementById("m10m-error").style.display = "block";
        isValid = false;
    } else {
        m10mInput.classList.remove("invalid");
        document.getElementById("m10m-error").style.display = "none";
        appState.marks10.math = mathVal;
    }
    
    // 10th Science Validation
    const sciVal = parseInt(m10sInput.value);
    if (isNaN(sciVal) || sciVal < 0 || sciVal > 100) {
        m10sInput.classList.add("invalid");
        document.getElementById("m10s-error").style.display = "block";
        isValid = false;
    } else {
        m10sInput.classList.remove("invalid");
        document.getElementById("m10s-error").style.display = "none";
        appState.marks10.science = sciVal;
    }
    
    return isValid;
}

function validateStep2() {
    const streamSelect = document.getElementById("stream-select");
    
    if (!streamSelect.value) {
        streamSelect.classList.add("invalid");
        return false;
    }
    streamSelect.classList.remove("invalid");
    appState.stream = streamSelect.value;
    
    // Validate all dynamically rendered subject inputs
    const currentConfig = STREAMS_CONFIG[appState.stream];
    let isAllSubjectsValid = true;
    
    currentConfig.subjects.forEach(subject => {
        const inputEl = document.getElementById(subject.id);
        if (inputEl) {
            const val = parseInt(inputEl.value);
            const errEl = document.getElementById(`err-${subject.id}`);
            
            if (isNaN(val) || val < 0 || val > 100) {
                inputEl.classList.add("invalid");
                if (errEl) errEl.style.display = "block";
                isAllSubjectsValid = false;
            } else {
                inputEl.classList.remove("invalid");
                if (errEl) errEl.style.display = "none";
                appState.marks12[subject.id] = val;
            }
        }
    });
    
    return isAllSubjectsValid;
}

/* ==========================================================================
   DYNAMIC SUBJECT INPUT FIELD RENDERER
   ========================================================================== */
function setupDynamicSubjectFields() {
    const streamSelect = document.getElementById("stream-select");
    const container = document.getElementById("dynamic-subjects-container");
    
    streamSelect.addEventListener("change", (e) => {
        const selectedStream = e.target.value;
        const config = STREAMS_CONFIG[selectedStream];
        
        if (!config) {
            container.innerHTML = `
                <div class="no-stream-selected-msg col-12">
                    <i class="fa-solid fa-arrow-pointer"></i> Please select a stream above to input your marks.
                </div>
            `;
            return;
        }
        
        // Generate inputs
        let html = '<div class="col-12" style="margin-bottom: 12px;"><h4 style="font-size: 0.95rem; font-weight: 600; color: var(--primary);">Enter 12th Subject Marks (out of 100)</h4></div>';
        
        config.subjects.forEach(subject => {
            html += `
                <div class="form-group col-6">
                    <label for="${subject.id}">${subject.name} <span class="required">*</span></label>
                    <input type="number" id="${subject.id}" min="0" max="100" placeholder="e.g. 85" required>
                    <span class="error-msg" id="err-${subject.id}">Enter marks between 0 and 100</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.classList.add("expanded");
    });
}

/* ==========================================================================
   INTEREST ASSESSMENT SLIDERS SYNC
   ========================================================================== */
function setupInterestSliders() {
    const sliders = [
        { id: "interest-tech", labelId: "val-tech" },
        { id: "interest-math", labelId: "val-math" },
        { id: "interest-science", labelId: "val-science" },
        { id: "interest-business", labelId: "val-business" },
        { id: "interest-arts", labelId: "val-arts" },
        { id: "interest-social", labelId: "val-social" }
    ];
    
    sliders.forEach(slider => {
        const inputEl = document.getElementById(slider.id);
        const labelEl = document.getElementById(slider.labelId);
        
        if (inputEl && labelEl) {
            inputEl.addEventListener("input", (e) => {
                labelEl.innerText = `${e.target.value}%`;
            });
        }
    });
}

/* ==========================================================================
   AI ANALYSIS TRANSITION & RUNNER
   ========================================================================== */
function runAIAnalysis() {
    const titleEl = document.getElementById("processing-title");
    const progressFill = document.getElementById("loader-progress");
    const logsContainer = document.getElementById("processing-logs");
    
    logsContainer.innerHTML = "";
    progressFill.style.width = "0%";
    
    const logs = [
        { progress: 10, title: "Connecting models...", text: "Establishing secure neural analysis matrix...", type: "info" },
        { progress: 20, title: "Parsing 10th parameters...", text: "Standardizing 10th grade overall and core performance index...", type: "info" },
        { progress: 40, title: "Evaluating core disciplines...", text: "Parsing 12th math and science marks against selected stream profiles...", type: "info" },
        { progress: 55, title: "Calculating engineering cutoffs...", text: "Aggregating cut-off scores (PCM ratios)...", type: "success" },
        { progress: 70, title: "Profiling interest metrics...", text: "Weighting student technology, artistic, business, and research sliders...", type: "info" },
        { progress: 85, title: "Synthesizing stream logic...", text: "Evaluating matches for engineering colleges vs. arts & science streams...", type: "success" },
        { progress: 95, title: "Compiling careers...", text: "Correlating high probability degree courses and salary estimations...", type: "info" },
        { progress: 100, title: "Finalizing report...", text: "Creating personalized counseling dashboard interface...", type: "success" }
    ];
    
    let currentLogIndex = 0;
    
    function executeLogTick() {
        if (currentLogIndex >= logs.length) {
            // Processing done, transition to dashboard
            setTimeout(() => {
                computeCareerGuidance();
                renderDashboard();
                showDashboardSection();
            }, 600);
            return;
        }
        
        const log = logs[currentLogIndex];
        
        // Update UI
        titleEl.innerText = log.title;
        progressFill.style.width = `${log.progress}%`;
        
        // Add log details
        const li = document.createElement("li");
        li.className = `log-entry ${log.type}`;
        li.innerText = log.text;
        logsContainer.appendChild(li);
        
        // Auto scroll log to bottom
        logsContainer.parentElement.scrollTop = logsContainer.parentElement.scrollHeight;
        
        currentLogIndex++;
        
        // Schedule next tick
        setTimeout(executeLogTick, 500 + Math.random() * 500);
    }
    
    // Start tick sequence
    setTimeout(executeLogTick, 400);
}

function showDashboardSection() {
    document.getElementById("analyzer-section").classList.remove("active-section");
    document.getElementById("dashboard-section").classList.add("active-section");
    
    // Trigger animations by adding active tags
    setTimeout(() => {
        const barFillEng = document.getElementById("bar-eng-fit");
        const barFillArts = document.getElementById("bar-arts-fit");
        const result = appState.analysisResult;
        
        if (barFillEng && barFillArts && result) {
            barFillEng.style.width = `${result.engineeringScore}%`;
            barFillArts.style.width = `${result.artsAndScienceScore}%`;
        }
    }, 100);
}

/* ==========================================================================
   CAREER GUIDANCE ALGORITHM ENGINE
   ========================================================================== */
function computeCareerGuidance() {
    const isScienceGroup = ["pcmc", "pcmb", "pcb"].includes(appState.stream);
    const hasMaths = ["pcmc", "pcmb", "commerce_math"].includes(appState.stream);
    
    // 1. EXTRACT MARKS
    const math12 = appState.marks12.math12 || 0;
    const physics12 = appState.marks12.physics12 || 0;
    const chemistry12 = appState.marks12.chemistry12 || 0;
    const cs12 = appState.marks12.cs12 || appState.marks12.ca12 || 0;
    const biology12 = appState.marks12.biology12 || 0;
    const acc12 = appState.marks12.accountancy12 || 0;
    const comm12 = appState.marks12.commerce12 || 0;
    const eco12 = appState.marks12.economics12 || 0;
    const artsElec12 = appState.marks12.history12 || appState.marks12.geography12 || appState.marks12.electiveArts12 || 0;
    
    // 2. INTEREST SCORES
    const ints = appState.interests;
    
    // --- EVALUATE ENGINEERING SUITABILITY ---
    let engAcademicScore = 0;
    let engPrerequisitesMet = false;
    
    if (isScienceGroup && hasMaths) {
        // High weight on Mathematics, Physics, Chemistry
        engAcademicScore = (math12 * 0.45) + (physics12 * 0.3) + (chemistry12 * 0.25);
        engPrerequisitesMet = true;
        
        // Add boost for Computer Science marks
        if (appState.stream === "pcmc" && cs12 > 80) {
            engAcademicScore = Math.min(100, engAcademicScore + 3);
        }
    } else if (appState.stream === "pcb") {
        // Biology stream without math. Some bioengineering fields (biotech, biomedical) are eligible in some colleges.
        engAcademicScore = (physics12 * 0.35) + (chemistry12 * 0.35) + (biology12 * 0.3);
        // Eligible but restricted to biotech/biomed tracks.
        engPrerequisitesMet = true; 
        engAcademicScore = engAcademicScore * 0.8; // Penalty due to lack of core mathematics
    } else {
        // Commerce/Arts streams. Generally not eligible for core Engineering degrees in conventional systems.
        // We calculate a proxy index showing they have low compatibility with conventional Engineering.
        engAcademicScore = (appState.marks10.math * 0.6) + (appState.marks10.science * 0.4);
        engAcademicScore = engAcademicScore * 0.4; // Strong penalty for non-science track
        engPrerequisitesMet = false;
    }
    
    // Engineering Interest Profile
    const engInterestScore = (ints.tech * 0.5) + (ints.math * 0.3) + (ints.science * 0.2);
    
    // Final Engineering compatibility score calculation
    let engineeringScore = 0;
    if (engPrerequisitesMet) {
        engineeringScore = Math.round((engAcademicScore * 0.55) + (engInterestScore * 0.45));
    } else {
        // Keep it low for non-science students
        engineeringScore = Math.round((engAcademicScore * 0.3) + (engInterestScore * 0.2));
    }
    // Safeguard bounds
    engineeringScore = Math.max(15, Math.min(99, engineeringScore));
    
    // --- EVALUATE ARTS & SCIENCE SUITABILITY ---
    let artsAcademicScore = 0;
    
    if (appState.stream === "commerce_math" || appState.stream === "commerce_no_math") {
        // Commerce tracks
        const businessMathBoost = hasMaths ? math12 * 0.1 : 0;
        artsAcademicScore = (acc12 * 0.4) + (comm12 * 0.3) + (eco12 * 0.3) + businessMathBoost;
        artsAcademicScore = Math.min(100, artsAcademicScore);
    } else if (appState.stream === "arts") {
        // Humanities/Arts
        artsAcademicScore = (artsElec12 * 0.4) + (eco12 * 0.3) + (appState.marks12.english12 * 0.3);
    } else if (isScienceGroup) {
        // Science streams going into Arts & Science colleges (B.Sc., BCA, etc.)
        const scienceAvg = (physics12 + chemistry12 + (biology12 || cs12 || math12)) / 3;
        artsAcademicScore = scienceAvg;
    } else {
        artsAcademicScore = appState.marks10.total;
    }
    
    // Arts & Science Interest Profile
    // Max of different interest branches (Business, Arts/Writing, Social work, Scientific Research)
    const artsInterestScore = Math.max(
        (ints.business * 0.7) + (ints.math * 0.3),                 // Commerce interest
        (ints.arts * 0.8) + (ints.social * 0.2),                   // Humanities / Design interest
        (ints.science * 0.7) + (ints.social * 0.3),                 // Pure Science Research
        (ints.tech * 0.7) + (ints.math * 0.3)                      // IT / Computer Applications interest (BCA)
    );
    
    let artsAndScienceScore = Math.round((artsAcademicScore * 0.5) + (artsInterestScore * 0.5));
    // Since Arts & Science is extremely broad and fits almost all streams, let's keep the baseline higher
    if (["commerce_math", "commerce_no_math", "arts"].includes(appState.stream)) {
        artsAndScienceScore = Math.round(artsAndScienceScore * 1.1); // Boost for non-science students since it is their only option
    }
    artsAndScienceScore = Math.max(20, Math.min(99, artsAndScienceScore));
    
    // 3. GENERATE RECOMMENDATIONS
    let recommendedStream = "";
    let matchScore = 0;
    
    // If they don't have maths/physics/chemistry at 12th level, they cannot do core engineering
    if (!engPrerequisitesMet) {
        recommendedStream = "Arts & Science";
        matchScore = artsAndScienceScore;
    } else {
        // Science stream
        if (engineeringScore >= artsAndScienceScore && ints.tech >= 45) {
            recommendedStream = "Engineering";
            matchScore = engineeringScore;
        } else {
            recommendedStream = "Arts & Science";
            matchScore = artsAndScienceScore;
        }
    }
    
    // Dynamic matching analysis reasons
    const reasons = [];
    if (recommendedStream === "Engineering") {
        if (math12 >= 80) reasons.push("Your 12th Mathematics score is highly competitive (" + math12 + "%), indicating exceptional analytical aptitude.");
        if (cs12 >= 85) reasons.push("High Computer Science performance demonstrates strong foundation in structured logic.");
        if (ints.tech >= 75) reasons.push("Your intense curiosity in technology matches the engineering profile perfectly.");
        if (appState.marks10.science >= 85) reasons.push("Strong baseline science score supports solid technical concepts.");
    } else {
        // Arts & Science
        if (["commerce_math", "commerce_no_math"].includes(appState.stream)) {
            reasons.push("Your Commerce stream background matches highly specialized banking, finance, and administration paths.");
            if (acc12 >= 85) reasons.push("Top performance in Accountancy (" + acc12 + "%) aligns with professional finance routes (CA/B.Com).");
            if (ints.business >= 70) reasons.push("High interest in business and finance fits corporate and entrepreneurial tracks.");
        } else if (appState.stream === "arts") {
            reasons.push("Humanities background provides perfect foundations for literature, media, policy, and research.");
            if (ints.arts >= 75) reasons.push("Strong creative profile suggests highly successful careers in media, design, or literature.");
        } else if (isScienceGroup) {
            reasons.push("Pure Science majors (B.Sc.) offer exceptional pathways into academic research, data operations, and laboratory systems.");
            if (biology12 >= 85) reasons.push("Outstanding Biology marks (" + biology12 + "%) indicate deep aptitude for medical sciences, research, or genetics.");
            if (ints.tech >= 70) reasons.push("Strong interest in computer software matches B.Sc. Computer Science / BCA perfectly.");
        }
        if (ints.social >= 75) reasons.push("Your high social service score suggests careers in public sectors, administration, or teaching.");
    }
    
    if (reasons.length < 3) {
        reasons.push("Academic benchmarks in 10th Standard (" + appState.marks10.total + "%) support a reliable learning capability.");
        reasons.push("Calculated stream ratio matches your rated cognitive slider index.");
    }
    
    // 4. MAP TOP 3 SPECIFIC COURSES
    const matchedCourses = getCourseRecommendations(recommendedStream, isScienceGroup, hasMaths, math12, physics12, chemistry12, cs12, biology12, acc12, comm12, eco12, artsElec12, ints);
    
    appState.analysisResult = {
        recommendedStream,
        matchScore,
        engineeringScore,
        artsAndScienceScore,
        reasons,
        courses: matchedCourses
    };
}

function getCourseRecommendations(recommendedStream, isScience, hasMath, math, phy, chem, cs, bio, acc, comm, eco, artsElec, ints) {
    const list = [];
    
    if (recommendedStream === "Engineering") {
        // 1. Tech Track
        if (ints.tech >= 60 || cs >= 80) {
            list.push({
                rank: 1,
                degree: "B.E. / B.Tech",
                title: "Computer Science & Engineering",
                desc: "Focuses on computer hardware, software engineering, algorithms, systems architectures, and software design.",
                duration: "4 Years",
                salary: "₹6.5L - ₹18L PA",
                fee: "High",
                roles: "Software Architect, Devops, Fullstack Engineer",
                why: "Excellent CS marks (" + (cs || "N/A") + "%) coupled with your " + ints.tech + "% tech slider score makes you an ideal developer fit."
            });
            
            list.push({
                rank: 2,
                degree: "B.Tech",
                title: "Artificial Intelligence & Data Science",
                desc: "Specialized computer engineering domain covering machine learning, data engineering, neural networks, and statistics.",
                duration: "4 Years",
                salary: "₹7.2L - ₹22L PA",
                fee: "High",
                roles: "AI Specialist, Data Scientist, ML Developer",
                why: "Math score (" + math + "%) and logical problem solving aptitude align heavily with model development fields."
            });
        } else {
            // Mathematical Core Track (ECE / Mech / EEE)
            list.push({
                rank: 1,
                degree: "B.E.",
                title: "Electronics & Communication Engineering",
                desc: "Design and implement electronic circuits, communication networks, signal processing chips, and IoT platforms.",
                duration: "4 Years",
                salary: "₹5.5L - ₹12L PA",
                fee: "Medium-High",
                roles: "Embedded Engineer, Network Analyst, Chip Architect",
                why: "Strong balance of Physics (" + phy + "%) and Mathematics (" + math + "%) supports core electronic concepts."
            });
            
            list.push({
                rank: 2,
                degree: "B.E.",
                title: "Mechanical Engineering",
                desc: "Study of thermodynamics, materials science, machine designs, and thermal engineering. Ideal for manufacturing industries.",
                duration: "4 Years",
                salary: "₹4.5L - ₹9L PA",
                fee: "Medium",
                roles: "Design Engineer, Automobile Analyst, Plant Manager",
                why: "Your physics grade (" + phy + "%) and interest in building tangible solutions match this track."
            });
        }
        
        // 3. Alternative/Specialized Engineering Track
        if (appState.stream === "pcmb" || appState.stream === "pcb") {
            list.push({
                rank: 3,
                degree: "B.Tech",
                title: "Biotechnology & Bio-Engineering",
                desc: "Combines biology with engineering methodologies to create pharma products, genetics treatments, and ecological solutions.",
                duration: "4 Years",
                salary: "₹5.0L - ₹11L PA",
                fee: "Medium-High",
                roles: "Research Analyst, Clinical Engineer, Bioprocess Officer",
                why: "Selected PCMB/PCB group and strong biology performance (" + bio + "%) makes this specialized field perfect."
            });
        } else {
            list.push({
                rank: 3,
                degree: "B.E. / B.Tech",
                title: "Information Technology",
                desc: "Applied computing systems, database management, network security, and cloud system administration.",
                duration: "4 Years",
                salary: "₹6.0L - ₹14L PA",
                fee: "High",
                roles: "Cloud Administrator, Database Analyst, IT Auditor",
                why: "Complements your technological interest and logical reasoning indexes."
            });
        }
    } else {
        // --- ARTS & SCIENCE OPTIONS ---
        
        // Commerce Students
        if (["commerce_math", "commerce_no_math"].includes(appState.stream)) {
            list.push({
                rank: 1,
                degree: "B.Com (Hons)",
                title: "Professional Accounting & Finance",
                desc: "Rigorous study of advanced accountancy, auditing standards, taxation systems, corporate laws, and costing matrices.",
                duration: "3 Years",
                salary: "₹4.5L - ₹12L PA",
                fee: "Low-Medium",
                roles: "Chartered Accountant, Tax Consultant, Internal Auditor",
                why: "Your Accountancy score of " + acc + "% highlights professional accounting competence."
            });
            
            if (ints.business >= 65) {
                list.push({
                    rank: 2,
                    degree: "BBA / BBS",
                    title: "Business Administration / Management Studies",
                    desc: "Teaches organizational behavior, marketing mechanics, human resources, administrative systems, and entrepreneurship.",
                    duration: "3 Years",
                    salary: "₹5.0L - ₹10L PA",
                    fee: "Medium",
                    roles: "Management Trainee, Business Analyst, Brand Associate",
                    why: "High business interest index (" + ints.business + "%) signals leadership and startup development aspirations."
                });
            } else {
                list.push({
                    rank: 2,
                    degree: "B.Sc.",
                    title: "Economics & Data Analytics",
                    desc: "An analytical course combining quantitative economic theories, market structures, and modern programming languages.",
                    duration: "3 Years",
                    salary: "₹5.5L - ₹12L PA",
                    fee: "Medium",
                    roles: "Financial Analyst, Risk Assessor, Econometrician",
                    why: "Combines Accountancy/Math skills with market study interests."
                });
            }
            
            // Third option
            if (appState.stream === "commerce_no_math" && ints.tech >= 60) {
                list.push({
                    rank: 3,
                    degree: "BCA",
                    title: "Computer Applications",
                    desc: "Applied computing track focusing on database design, web application development, and system networking.",
                    duration: "3 Years",
                    salary: "₹4.0L - ₹8.5L PA",
                    fee: "Medium",
                    roles: "Web Developer, System Admin, Tech Support Analyst",
                    why: "Fits commerce students with high technology interest (" + ints.tech + "%) who want a software career without a B.E."
                });
            } else {
                list.push({
                    rank: 3,
                    degree: "B.Com",
                    title: "Corporate Secretaryship / Banking",
                    desc: "Management of corporate compliance, stock regulations, investment protocols, and financial institutions governance.",
                    duration: "3 Years",
                    salary: "₹4.2L - ₹8.0L PA",
                    fee: "Low",
                    roles: "Corporate Secretary, Investment Banker, Credit Manager",
                    why: "Solid fit for core Commerce (" + comm + "%) principles."
                });
            }
        }
        
        // Humanities/Arts Students
        else if (appState.stream === "arts") {
            list.push({
                rank: 1,
                degree: "B.A. (Hons)",
                title: "English Literature & Creative Writing",
                desc: "Deep study of literary theories, classic and modern prose, dramatic writings, journalism components, and digital content curation.",
                duration: "3 Years",
                salary: "₹3.5L - ₹7.5L PA",
                fee: "Low",
                roles: "Content Strategist, Copywriter, Editorial Head",
                why: "Perfect match for your high Arts/Writing interest index (" + ints.arts + "%)."
            });
            
            list.push({
                rank: 2,
                degree: "B.A.",
                title: "Economics & Political Science",
                desc: "Explores geopolitical systems, monetary policy, public administration, international relations, and administrative frameworks.",
                duration: "3 Years",
                salary: "₹4.0L - ₹8.0L PA",
                fee: "Low",
                roles: "Policy Analyst, Public Relations Officer, UPSC/SSC Aspirant",
                why: "Selected subjects prepare you for policy administration and UPSC exam foundations."
            });
            
            list.push({
                rank: 3,
                degree: "B.Sc.",
                title: "Visual Communication & Digital Media",
                desc: "Practical study of photography, sound engineering, graphic layout, filmmaking, social media, and animations.",
                duration: "3 Years",
                salary: "₹4.0L - ₹10L PA",
                fee: "Medium-High",
                roles: "UI/UX Designer, Video Editor, Media Planner",
                why: "Excellent route for creative minds (" + ints.arts + "%) who enjoy visual design and digital tools."
            });
        }
        
        // Science Students choosing Arts & Science
        else if (isScience) {
            // If they are PCMC or commerce, and want IT
            if (ints.tech >= 60) {
                list.push({
                    rank: 1,
                    degree: "BCA / B.Sc.",
                    title: "Computer Science",
                    desc: "Comprehensive logic computing degree covering programming, data structures, cloud hosting, and software development methodologies.",
                    duration: "3 Years",
                    salary: "₹4.5L - ₹10L PA",
                    fee: "Medium",
                    roles: "Web Developer, Software Engineer, System Analyst",
                    why: "Allows entry to major IT companies. High Tech Interest (" + ints.tech + "%) and logical backgrounds align well."
                });
                
                list.push({
                    rank: 2,
                    degree: "B.Sc.",
                    title: "Data Science & Statistics",
                    desc: "Blended academic track containing mathematical statistics, algorithm coding, database warehousing, and predictive modeling.",
                    duration: "3 Years",
                    salary: "₹5.5L - ₹13L PA",
                    fee: "Medium",
                    roles: "Junior Analyst, Data Engineer, Business Intelligence Analyst",
                    why: "Fits science students who have high math capability and technical interest."
                });
            } else if (appState.stream === "pcmb" || appState.stream === "pcb") {
                // Bio tracks
                list.push({
                    rank: 1,
                    degree: "B.Sc.",
                    title: "Biotechnology / Microbiology",
                    desc: "Detailed study of cells, microbiological systems, genetic engineering, drug testing, and clinical testing.",
                    duration: "3 Years",
                    salary: "₹4.0L - ₹9.0L PA",
                    fee: "Medium",
                    roles: "Lab Researcher, Quality Officer, Medical Reviewer",
                    why: "Selected Biology stream (" + bio + "%) and high Research interest (" + ints.science + "%) leads cleanly here."
                });
                
                list.push({
                    rank: 2,
                    degree: "B.Sc.",
                    title: "Clinical Psychology / Cognitive Science",
                    desc: "Studies of human brain functions, cognitive behavior, mental treatments, counseling techniques, and therapeutic methods.",
                    duration: "3 Years",
                    salary: "₹3.8L - ₹8.0L PA",
                    fee: "Medium",
                    roles: "Counselor, HR Analyst, Clinical Assistant",
                    why: "Combines biological learning with high Social counseling score (" + ints.social + "%)."
                });
            } else {
                // PCM core science
                list.push({
                    rank: 1,
                    degree: "B.Sc.",
                    title: "Physics / Mathematics (Hons)",
                    desc: "Advanced exploration of mechanics, quantum theories, computational algebra, and mathematical principles.",
                    duration: "3 Years",
                    salary: "₹4.0L - ₹8.5L PA",
                    fee: "Low",
                    roles: "Academician, Scientist, Statistical Officer",
                    why: "Matches your deep academic base in Physics (" + phy + "%) and Maths (" + math + "%)."
                });
                
                list.push({
                    rank: 2,
                    degree: "B.Sc.",
                    title: "Chemistry / Environmental Analytics",
                    desc: "Analytical chemistry, organic compounds, green solutions, chemical synthesis, and toxic testing labs.",
                    duration: "3 Years",
                    salary: "₹3.8L - ₹8.0L PA",
                    fee: "Low",
                    roles: "Chemical Analyst, Safety Auditor, Pharmacist Assistant",
                    why: "Chemistry marks (" + chem + "%) indicate good foundation in chemical composition sciences."
                });
            }
            
            // Common third option for science students: BBA or BCA depending on tech
            if (ints.business >= 55) {
                list.push({
                    rank: 3,
                    degree: "BBA",
                    title: "Information Systems Management",
                    desc: "A unique cross-disciplinary course detailing how business systems utilize database platforms, cloud models, and IT structures.",
                    duration: "3 Years",
                    salary: "₹4.5L - ₹9.5L PA",
                    fee: "Medium",
                    roles: "IT Project Coordinator, Business Developer, Systems Consultant",
                    why: "Perfect bridge option matching both tech and business interests."
                });
            } else {
                list.push({
                    rank: 3,
                    degree: "B.Sc.",
                    title: "Food Technology / Forensic Science",
                    desc: "Specialized applied science studying molecular compositions, nutrition rules, packaging engineering, or forensic criminology.",
                    duration: "3 Years",
                    salary: "₹4.2L - ₹9.0L PA",
                    fee: "Medium-High",
                    roles: "Food Inspector, Forensic Lab Analyst, Quality Controller",
                    why: "Applied scientific path matching a solid baseline in Physics/Chemistry."
                });
            }
        }
    }
    
    return list;
}

/* ==========================================================================
   DASHBOARD RENDERING SYSTEM (SVG CHARTS & GAUGES)
   ========================================================================== */
function renderDashboard() {
    const result = appState.analysisResult;
    if (!result) return;
    
    // 1. Text Info Summary
    document.getElementById("summary-student-name").innerText = appState.studentName;
    document.getElementById("summary-student-stream").innerText = STREAMS_CONFIG[appState.stream]?.name || appState.stream.toUpperCase();
    
    // 2. Primary Badge
    const streamBadge = document.getElementById("recommended-stream-badge");
    streamBadge.innerText = `${result.recommendedStream} College`;
    streamBadge.className = `stream-badge-display ${result.recommendedStream === "Engineering" ? "engineering" : "arts"}`;
    
    // 3. Recommended text heading and info
    const titleText = document.getElementById("recommendation-title-text");
    const descText = document.getElementById("recommendation-description-text");
    
    if (result.recommendedStream === "Engineering") {
        titleText.innerHTML = `You are highly suited for an <span class="gradient-text">Engineering College</span>!`;
        descText.innerText = `Based on your academic profile, our Career AI detects a strong capability for structural calculations, systems design, and technological application. Because you completed 12th grade in a Science stream with Mathematics and have demonstrated a high matching interest, a 4-year B.E./B.Tech curriculum offers the most direct channel to maximize your potential.`;
    } else {
        titleText.innerHTML = `We recommend an <span class="gradient-text">Arts & Science College</span>!`;
        
        let customDesc = `Based on your academic stream and interests, an Arts & Science College provides the perfect specialized environment. `;
        if (["commerce_math", "commerce_no_math"].includes(appState.stream)) {
            customDesc += `With your Commerce background, you can pursue accounting, business administration, or finance. These degrees take 3 years, provide deep domain mastery, and lead to excellent corporate career placements or professional designations like CA/MBA.`;
        } else if (appState.stream === "arts") {
            customDesc += `Humanities and Arts allow you to specialize in languages, journalism, economics, or digital design. This path values creative exploration, communications, and qualitative reasoning, matching your artistic profile perfectly.`;
        } else {
            customDesc += `A 3-year B.Sc. or BCA degree lets you specialize in computing, statistics, or laboratory sciences without the structural engineering overhead, launching you quickly into specialized industry sectors or research pathways.`;
        }
        descText.innerText = customDesc;
    }
    
    // 4. Radial Match Score Gauge (Animation trigger)
    const gaugeFill = document.getElementById("gauge-circle-fill");
    const gaugeText = document.getElementById("gauge-match-val");
    
    // Reset gauge fill
    gaugeFill.style.strokeDashoffset = 314.159;
    gaugeText.innerText = "0%";
    
    setTimeout(() => {
        // Animate count up
        let count = 0;
        const target = result.matchScore;
        const duration = 1200; // ms
        const stepTime = Math.max(10, Math.floor(duration / target));
        
        const timer = setInterval(() => {
            count++;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            gaugeText.innerText = `${count}%`;
        }, stepTime);
        
        // Gauge SVG stroke calculation
        // stroke-dashoffset = circumference - (percent / 100) * circumference
        const offset = 314.159 - (target / 100) * 314.159;
        gaugeFill.style.strokeDashoffset = offset;
        
        // Color matching style for gauge
        if (result.recommendedStream === "Engineering") {
            gaugeFill.style.stroke = "var(--primary)";
        } else {
            gaugeFill.style.stroke = "var(--secondary)";
        }
    }, 200);
    
    // 5. Comparison progress bar texts
    document.getElementById("txt-eng-fit").innerText = `${result.engineeringScore}%`;
    document.getElementById("txt-arts-fit").innerText = `${result.artsAndScienceScore}%`;
    
    // 6. Why suitability reasons lists
    const reasonsContainer = document.getElementById("suitability-reasons");
    reasonsContainer.innerHTML = "";
    result.reasons.forEach(reason => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <span>${reason}</span>`;
        reasonsContainer.appendChild(li);
    });
    
    // 7. Render dynamic Course Cards
    const cardsContainer = document.getElementById("course-cards-container");
    cardsContainer.innerHTML = "";
    
    result.courses.forEach(course => {
        const card = document.createElement("div");
        card.className = `course-card rank-${course.rank}`;
        
        card.innerHTML = `
            <div class="course-rank">${course.rank}</div>
            <div class="course-card-header">
                <span class="course-degree">${course.degree}</span>
                <h4 class="course-title">${course.title}</h4>
            </div>
            <p class="course-description">${course.desc}</p>
            <p class="course-description" style="font-style: italic; font-size: 0.8rem; border-top: 1px dashed var(--border-color); padding-top: 8px;">
                <strong>Why fits:</strong> ${course.why}
            </p>
            <div class="course-meta-info">
                <div class="meta-row">
                    <span class="meta-label"><i class="fa-solid fa-hourglass-half"></i> Duration</span>
                    <span class="meta-val">${course.duration}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label"><i class="fa-solid fa-coins"></i> Avg Package</span>
                    <span class="meta-val salary-glow">${course.salary}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label"><i class="fa-solid fa-wallet"></i> College Cost</span>
                    <span class="meta-val">${course.fee}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label"><i class="fa-solid fa-briefcase"></i> Job Roles</span>
                    <span class="meta-val" style="font-size: 0.72rem; text-align: right; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${course.roles}">${course.roles}</span>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
    
    // 8. Draw SVG Charts
    drawSubjectChart();
    drawInterestChart();
    
    // Update Chatbot contextual data
    updateChatbotContext();
}

/* ==========================================================================
   SVG CHART DRAWING FUNCTIONS
   ========================================================================== */
function drawSubjectChart() {
    const wrapper = document.getElementById("subject-chart-wrapper");
    wrapper.innerHTML = "";
    
    const config = STREAMS_CONFIG[appState.stream];
    if (!config) return;
    
    const data = config.subjects.map(sub => {
        return {
            name: sub.name.split(" ")[0].replace(",", ""), // Shorten name
            value: appState.marks12[sub.id] || 0
        };
    });
    
    // Add 10th baseline indicator
    data.push({ name: "10th Avg", value: appState.marks10.total });
    
    const width = 280;
    const height = 180;
    const paddingLeft = 35;
    const paddingBottom = 25;
    const paddingTop = 15;
    const paddingRight = 10;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    let svg = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}">`;
    
    // Draw Y-Axis grid lines
    const grids = [0, 25, 50, 75, 100];
    grids.forEach(g => {
        const y = paddingTop + chartHeight - (g / 100) * chartHeight;
        svg += `<line class="grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}"></line>`;
        svg += `<text class="chart-text" x="${paddingLeft - 8}" y="${y + 3}" text-anchor="end">${g}</text>`;
    });
    
    // Draw Bars
    const barWidth = Math.floor(chartWidth / data.length) - 8;
    const spacing = (chartWidth - (barWidth * data.length)) / (data.length - 1 || 1);
    
    data.forEach((d, idx) => {
        const x = paddingLeft + idx * (barWidth + spacing);
        const barHeight = (d.value / 100) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;
        
        // Colors
        let fill = "var(--primary)";
        if (d.name === "10th") fill = "var(--text-muted)";
        else if (d.value >= 85) fill = "var(--secondary)";
        else if (d.value < 50) fill = "var(--accent-red)";
        
        svg += `<rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${fill}" rx="2" opacity="0.95"></rect>`;
        svg += `<text class="chart-text-value" x="${x + barWidth/2}" y="${y - 4}" text-anchor="middle">${Math.round(d.value)}</text>`;
        svg += `<text class="chart-text" x="${x + barWidth/2}" y="${height - paddingBottom + 14}" text-anchor="middle" font-size="8">${d.name}</text>`;
    });
    
    // X-Axis Baseline
    svg += `<line class="axis-line" x1="${paddingLeft}" y1="${paddingTop + chartHeight}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight}"></line>`;
    svg += "</svg>";
    
    wrapper.innerHTML = svg;
}

function drawInterestChart() {
    const wrapper = document.getElementById("interest-chart-wrapper");
    wrapper.innerHTML = "";
    
    const data = [
        { name: "Tech", value: appState.interests.tech, color: "var(--primary)" },
        { name: "Math", value: appState.interests.math, color: "var(--accent)" },
        { name: "Science", value: appState.interests.science, color: "var(--secondary)" },
        { name: "Business", value: appState.interests.business, color: "var(--accent-orange)" },
        { name: "Arts", value: appState.interests.arts, color: "var(--accent-purple)" },
        { name: "Social", value: appState.interests.social, color: "var(--accent-red)" }
    ];
    
    const width = 280;
    const height = 180;
    const paddingLeft = 40;
    const paddingBottom = 25;
    const paddingTop = 15;
    const paddingRight = 10;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    let svg = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}">`;
    
    // Draw Y-Axis grids
    const grids = [0, 50, 100];
    grids.forEach(g => {
        const y = paddingTop + chartHeight - (g / 100) * chartHeight;
        svg += `<line class="grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}"></line>`;
        svg += `<text class="chart-text" x="${paddingLeft - 8}" y="${y + 3}" text-anchor="end">${g}%</text>`;
    });
    
    // Draw Bars
    const barWidth = Math.floor(chartWidth / data.length) - 6;
    const spacing = (chartWidth - (barWidth * data.length)) / (data.length - 1 || 1);
    
    data.forEach((d, idx) => {
        const x = paddingLeft + idx * (barWidth + spacing);
        const barHeight = (d.value / 100) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;
        
        svg += `<rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${d.color}" rx="2" opacity="0.95"></rect>`;
        svg += `<text class="chart-text-value" x="${x + barWidth/2}" y="${y - 4}" text-anchor="middle">${d.value}%</text>`;
        svg += `<text class="chart-text" x="${x + barWidth/2}" y="${height - paddingBottom + 14}" text-anchor="middle" font-size="8">${d.name}</text>`;
    });
    
    // X-Axis Baseline
    svg += `<line class="axis-line" x1="${paddingLeft}" y1="${paddingTop + chartHeight}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight}"></line>`;
    svg += "</svg>";
    
    wrapper.innerHTML = svg;
}

/* ==========================================================================
   EXPORT REPORT (PRINT HANDLING)
   ========================================================================== */
document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
});

/* ==========================================================================
   FLOATING COGNITIVE CAREER AI CHATBOT (CLIENT-SIDE)
   ========================================================================== */
function setupChatbot() {
    const toggleBtn = document.getElementById("chatbot-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const windowEl = document.getElementById("chat-window");
    const sendBtn = document.getElementById("chat-send-btn");
    const inputEl = document.getElementById("chat-input");
    const messagesEl = document.getElementById("chat-messages");
    
    toggleBtn.addEventListener("click", () => {
        windowEl.classList.toggle("active");
    });
    
    closeBtn.addEventListener("click", () => {
        windowEl.classList.remove("active");
    });
    
    sendBtn.addEventListener("click", handleUserMessage);
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleUserMessage();
        }
    });
    
    function handleUserMessage() {
        const text = inputEl.value.trim();
        if (!text) return;
        
        // Append user message
        appendMessage(text, "user");
        inputEl.value = "";
        
        // Respond with counselor AI
        setTimeout(() => {
            const reply = generateAISwitchboardReply(text);
            appendMessage(reply, "system");
        }, 600);
    }
    
    function appendMessage(text, sender) {
        const div = document.createElement("div");
        div.className = `message ${sender}-message`;
        div.innerText = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    window.triggerChatbotResponse = function(text) {
        appendMessage(text, "user");
        setTimeout(() => {
            const reply = generateAISwitchboardReply(text);
            appendMessage(reply, "system");
        }, 500);
    };
}

function updateChatbotContext() {
    const result = appState.analysisResult;
    const suggestionsContainer = document.getElementById("chat-suggestions");
    
    if (!result) {
        suggestionsContainer.innerHTML = "";
        return;
    }
    
    const topCourse = result.courses[0];
    
    // Render custom suggested chips
    suggestionsContainer.innerHTML = `
        <button class="suggestion-chip" onclick="triggerChatbotResponse('What are the job options for ${topCourse.title}?')">Job Options</button>
        <button class="suggestion-chip" onclick="triggerChatbotResponse('Which colleges offer ${topCourse.title}?')">Best Colleges</button>
        <button class="suggestion-chip" onclick="triggerChatbotResponse('What is the difficulty level?')">Difficulty Level</button>
        <button class="suggestion-chip" onclick="triggerChatbotResponse('Is ${result.recommendedStream} better than the alternative for me?')">Comparison</button>
    `;
    
    // Add counselor welcoming message based on recommendations
    const messagesEl = document.getElementById("chat-messages");
    
    const div = document.createElement("div");
    div.className = "message system-message";
    div.innerHTML = `<strong>Analysis Complete!</strong> I see your best fit is <strong>${result.recommendedStream}</strong>, specifically matching <strong>${topCourse.title}</strong> (Score: ${result.matchScore}%). Ask me any questions about college listings, career scope, or specific salaries for this path!`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function generateAISwitchboardReply(query) {
    const q = query.toLowerCase();
    const result = appState.analysisResult;
    
    if (!result) {
        return "Please complete the Career AI Questionnaire first so I can analyze your marks and give you custom recommendations!";
    }
    
    const topCourse = result.courses[0];
    const isEng = result.recommendedStream === "Engineering";
    
    // 1. Colleges
    if (q.includes("college") || q.includes("where to study") || q.includes("admission")) {
        if (isEng) {
            return `For ${topCourse.title}, the top choices in India include the Indian Institutes of Technology (IITs), National Institutes of Technology (NITs), and premier state engineering universities (like Anna University, COEP, or RVCE). Since you scored ${appState.marks10.math}% in 10th Math, maintaining a high percentage will make you highly eligible for top-tier admissions!`;
        } else {
            return `For ${topCourse.title}, premier Arts & Science colleges include Loyola College, St. Xavier's, Christ University, SRCC, or Miranda House depending on your stream. Admission to these institutions is based directly on your 12th Board marks (not competitive exams like JEE), so your percentage holds massive leverage.`;
        }
    }
    
    // 2. Salary / Packages
    if (q.includes("salary") || q.includes("package") || q.includes("earn") || q.includes("money")) {
        return `The average starting salary for ${topCourse.title} is approximately ${topCourse.salary}. Highly skilled engineers and financial graduates frequently secure packages upwards of ₹15L - ₹20L PA with solid internships.`;
    }
    
    // 3. Job / Career Options
    if (q.includes("job") || q.includes("career") || q.includes("work as") || q.includes("roles")) {
        return `Graduates of ${topCourse.title} commonly work as: ${topCourse.roles}. Your personal interest slider indicates a strength in this field, which is highly sought after by recruiting recruiters.`;
    }
    
    // 4. Difficulty / Toughness
    if (q.includes("difficult") || q.includes("hard") || q.includes("tough") || q.includes("study load")) {
        if (isEng) {
            return `Engineering requires rigorous lab work, university semester exams, and solid math foundation. Your Math slider score is ${appState.interests.math}%, indicating a ${appState.interests.math >= 65 ? "strong capacity" : "moderate challenge"} for engineering logic. If you commit to practical learning, you'll do great!`;
        } else {
            return `Arts & Science courses generally offer a more balanced study schedule than engineering. You'll focus deeply on theoretical specialization, projects, and research papers. This leaves excellent time to build extra certifications or prepare for competitive tests like UPSC.`;
        }
    }
    
    // 5. Comparison
    if (q.includes("comparison") || q.includes("better") || q.includes("alternative")) {
        if (isEng) {
            return `Engineering score is ${result.engineeringScore}% vs Arts & Science fit of ${result.artsAndScienceScore}%. Engineering is highly structured and leads to direct technical design positions, whereas Arts & Science B.Sc./BCA tracks offer a shorter 3-year timeline and more academic focus. We chose Engineering because of your high Math/Physics marks.`;
        } else {
            return `Arts & Science score is ${result.artsAndScienceScore}% vs Engineering fit of ${result.engineeringScore}%. Arts & Science is recommended because it perfectly aligns with your stream. If you do BCA or B.Sc. CS, you can enter the IT industry just like an engineer, saving 1 year of study and tuition costs!`;
        }
    }
    
    // Fallback general responses
    return `Interesting question! For ${topCourse.title}, I recommend reviewing your academic benchmarks. Since you scored high in relevant subjects, this path offers outstanding career viability. Is there anything specific like entrance exams or study durations you want to know?`;
}
