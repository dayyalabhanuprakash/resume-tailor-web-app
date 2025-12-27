// ===================================
// GLOBAL VARIABLES
// ===================================

let selectedFile = null;
let sessionId = null;

// ===================================
// NAVIGATION & SCROLLING
// ===================================

function scrollToTailor() {
    document.getElementById('tailor').scrollIntoView({ behavior: 'smooth' });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// FILE UPLOAD HANDLING
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const jobDescription = document.getElementById('jobDescription');
    const charCount = document.getElementById('charCount');
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'var(--gray-50)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--gray-300)';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--gray-300)';
        uploadArea.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
    
    // Character count
    jobDescription.addEventListener('input', () => {
        charCount.textContent = jobDescription.value.length;
    });
});

function handleFileSelect(file) {
    const validTypes = ['.pdf', '.docx', '.tex'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
        alert('Please upload a PDF, DOCX, or LaTeX file');
        return;
    }
    
    selectedFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'flex';
}

function removeFile() {
    selectedFile = null;
    document.getElementById('resumeFile').value = '';
    document.getElementById('uploadArea').style.display = 'flex';
    document.getElementById('fileInfo').style.display = 'none';
}

// ===================================
// PROCESS RESUME
// ===================================

async function processResume() {
    // Validation
    if (!selectedFile) {
        alert('Please upload your resume');
        return;
    }
    
    const jobDescription = document.getElementById('jobDescription').value.trim();
    if (!jobDescription) {
        alert('Please paste the job description');
        return;
    }
    
    if (jobDescription.length < 100) {
        alert('Job description seems too short. Please provide a complete job description.');
        return;
    }
    
    // Get options
    const options = {
        targetRole: document.getElementById('targetRole').value,
        companyName: document.getElementById('companyName').value,
        generateCoverLetter: document.getElementById('generateCoverLetter').checked,
        emphasizeSkills: document.getElementById('emphasizeSkills').checked
    };
    
    // Prepare form data
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobDescription', jobDescription);
    formData.append('options', JSON.stringify(options));
    
    // Show loading
    showLoading();
    
    try {
        const response = await fetch('/api/tailor-resume', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to process resume');
        }
        
        const result = await response.json();
        
        if (result.success) {
            sessionId = result.sessionId;
            displayResults(result);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your resume. Please try again.');
    } finally {
        hideLoading();
    }
}

// ===================================
// LOADING ANIMATION
// ===================================

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Simulate progress
    setTimeout(() => {
        document.getElementById('step1').classList.add('active');
        document.getElementById('step1').innerHTML = '<i class="fas fa-check-circle"></i> Analyzing job description';
    }, 500);
    
    setTimeout(() => {
        document.getElementById('step2').classList.add('active');
        document.getElementById('step2').innerHTML = '<i class="fas fa-check-circle"></i> Extracting keywords';
    }, 1500);
    
    setTimeout(() => {
        document.getElementById('step3').classList.add('active');
        document.getElementById('step3').innerHTML = '<i class="fas fa-check-circle"></i> Optimizing content';
    }, 2500);
    
    setTimeout(() => {
        document.getElementById('step4').classList.add('active');
        document.getElementById('step4').innerHTML = '<i class="fas fa-check-circle"></i> Generating PDF';
    }, 3500);
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    
    // Reset steps
    const steps = document.querySelectorAll('.loading-step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        const icons = ['fa-spinner fa-spin', 'fa-spinner fa-spin', 'fa-spinner fa-spin', 'fa-spinner fa-spin'];
        const texts = [
            'Analyzing job description',
            'Extracting keywords',
            'Optimizing content',
            'Generating PDF'
        ];
        step.innerHTML = `<i class="fas ${icons[index]}"></i> ${texts[index]}`;
    });
}

// ===================================
// DISPLAY RESULTS
// ===================================

function displayResults(result) {
    // Hide upload section, show results
    document.querySelector('.upload-section').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    // Update scores with animation
    animateScore(result.atsScore);
    document.getElementById('originalScore').textContent = result.originalScore;
    document.getElementById('improvement').textContent = result.improvement;
    document.getElementById('matchQuality').textContent = result.matchQuality;
    document.getElementById('matchedKeywords').textContent = result.matchedKeywords;
    
    // Display keywords
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = '';
    result.keywords.forEach(kw => {
        const tag = document.createElement('span');
        tag.className = `keyword-tag ${kw.matched ? 'matched' : 'unmatched'}`;
        tag.textContent = kw.text;
        keywordsList.appendChild(tag);
    });
    
    // Display improvements
    const improvementsList = document.getElementById('improvementsList');
    improvementsList.innerHTML = '';
    result.improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
    });
    
    // Display suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    result.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
    
    // Setup download buttons
    setupDownloadButtons(result);
}

function animateScore(targetScore) {
    const scoreElement = document.getElementById('atsScore');
    const scoreRing = document.getElementById('scoreRing');
    
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (targetScore / 100) * circumference;
    
    // Add gradient
    const svg = scoreRing.parentElement;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#667eea;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#764ba2;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
    
    // Animate ring
    setTimeout(() => {
        scoreRing.style.strokeDashoffset = offset;
    }, 100);
    
    // Animate number
    let current = 0;
    const increment = targetScore / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
            current = targetScore;
            clearInterval(timer);
        }
        scoreElement.textContent = Math.round(current);
    }, 20);
}

// ===================================
// DOWNLOAD FUNCTIONS
// ===================================

function setupDownloadButtons(result) {
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    const downloadLatexBtn = document.getElementById('downloadLatexBtn');
    const downloadCoverLetterBtn = document.getElementById('downloadCoverLetterBtn');
    
    if (result.hasResumePdf) {
        downloadResumeBtn.onclick = () => downloadFile('resume');
    } else {
        downloadResumeBtn.disabled = true;
        downloadResumeBtn.textContent = 'PDF Not Available';
    }
    
    if (result.hasLatexSource) {
        downloadLatexBtn.onclick = () => downloadFile('latex');
    } else {
        downloadLatexBtn.disabled = true;
    }
    
    if (result.hasCoverLetter) {
        downloadCoverLetterBtn.style.display = 'block';
        downloadCoverLetterBtn.onclick = () => downloadFile('cover-letter');
    }
}

function downloadFile(type) {
    if (!sessionId) {
        alert('Session expired. Please process your resume again.');
        return;
    }
    
    const url = `/api/download/${sessionId}/${type}`;
    window.open(url, '_blank');
}

// ===================================
// RESET FORM
// ===================================

function resetForm() {
    // Hide results, show upload section
    document.getElementById('resultsSection').style.display = 'none';
    document.querySelector('.upload-section').style.display = 'block';
    
    // Clear form
    removeFile();
    document.getElementById('jobDescription').value = '';
    document.getElementById('targetRole').value = '';
    document.getElementById('companyName').value = '';
    document.getElementById('generateCoverLetter').checked = false;
    document.getElementById('emphasizeSkills').checked = true;
    document.getElementById('charCount').textContent = '0';
    
    // Reset session
    sessionId = null;
    
    // Scroll to top
    scrollToTailor();
}

// ===================================
// SMOOTH SCROLL FOR ALL LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
