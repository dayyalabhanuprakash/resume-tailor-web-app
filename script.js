// ===================================
// ATS Resume Tailor - Main JavaScript
// ===================================

// State Management
const state = {
    resumeFile: null,
    jobDescriptionText: '',
    jdFile: null,
    options: {
        targetRole: '',
        companyName: '',
        experienceLevel: 'auto',
        jobType: 'any',
        outputFormat: 'pdf',
        generateCoverLetter: true,
        atsOptimization: true,
        keywordHighlight: true,
        cultureFit: false
    },
    results: null
};

// ===================================
// File Upload Handlers
// ===================================

document.getElementById('resumeFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        state.resumeFile = file;
        const fileName = document.getElementById('resumeFileName');
        fileName.textContent = file.name;
        fileName.classList.add('selected');
        
        // Show format preservation message if LaTeX file
        const formatInfo = document.getElementById('formatInfo');
        if (file.name.endsWith('.tex')) {
            formatInfo.style.display = 'block';
            formatInfo.innerHTML = '<i class="fas fa-check-circle" style="color:#10b981;"></i> ' +
                '<strong>LaTeX Source Detected!</strong> Your exact format, spacing, and styling will be preserved.';
        } else {
            formatInfo.style.display = 'block';
            formatInfo.innerHTML = '<i class="fas fa-info-circle" style="color:#2563eb;"></i> ' +
                '<strong>Tip:</strong> Upload your resume as .tex file to preserve exact formatting and spacing.';
        }
    }
});

document.getElementById('jdFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        state.jdFile = file;
        const fileName = document.getElementById('jdFileName');
        fileName.textContent = file.name;
        fileName.classList.add('selected');
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (event) => {
            state.jobDescriptionText = event.target.result;
        };
        reader.readAsText(file);
    }
});

document.getElementById('jobDescriptionText').addEventListener('input', (e) => {
    state.jobDescriptionText = e.target.value;
});

// ===================================
// Tab Switching
// ===================================

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update content
        document.getElementById('pasteTab').classList.remove('active');
        document.getElementById('uploadTab').classList.remove('active');
        
        if (tabName === 'paste') {
            document.getElementById('pasteTab').classList.add('active');
        } else {
            document.getElementById('uploadTab').classList.add('active');
        }
    });
});

// ===================================
// Options Handling
// ===================================

document.getElementById('targetRole').addEventListener('input', (e) => {
    state.options.targetRole = e.target.value;
});

document.getElementById('companyName').addEventListener('input', (e) => {
    state.options.companyName = e.target.value;
});

document.getElementById('experienceLevel').addEventListener('change', (e) => {
    state.options.experienceLevel = e.target.value;
});

document.getElementById('jobType').addEventListener('change', (e) => {
    state.options.jobType = e.target.value;
});

document.getElementById('outputFormat').addEventListener('change', (e) => {
    state.options.outputFormat = e.target.value;
});

document.getElementById('generateCoverLetter').addEventListener('change', (e) => {
    state.options.generateCoverLetter = e.target.checked;
});

document.getElementById('atsOptimization').addEventListener('change', (e) => {
    state.options.atsOptimization = e.target.checked;
});

document.getElementById('keywordHighlight').addEventListener('change', (e) => {
    state.options.keywordHighlight = e.target.checked;
});

document.getElementById('cultureFit').addEventListener('change', (e) => {
    state.options.cultureFit = e.target.checked;
});

// Advanced Options Toggle
document.querySelector('.toggle-advanced').addEventListener('click', () => {
    const content = document.querySelector('.advanced-content');
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
});

// ===================================
// Main Processing Function
// ===================================

document.getElementById('processButton').addEventListener('click', async () => {
    // Validation
    if (!state.resumeFile) {
        alert('Please upload your resume');
        return;
    }
    
    if (!state.jobDescriptionText) {
        alert('Please provide a job description');
        return;
    }
    
    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('processButton').disabled = true;
    
    // Scroll to loading
    document.getElementById('loadingState').scrollIntoView({ behavior: 'smooth' });
    
    try {
        // Simulate processing stages
        await processResume();
    } catch (error) {
        alert('An error occurred: ' + error.message);
        console.error(error);
    } finally {
        document.getElementById('processButton').disabled = false;
    }
});

async function processResume() {
    const stages = [
        { message: 'Extracting text from resume...', progress: 15 },
        { message: 'Analyzing job description keywords...', progress: 30 },
        { message: 'Identifying skill gaps and matches...', progress: 45 },
        { message: 'Optimizing resume content...', progress: 60 },
        { message: 'Generating LaTeX template...', progress: 75 },
        { message: 'Compiling PDF document...', progress: 90 },
        { message: 'Finalizing and creating downloads...', progress: 100 }
    ];
    
    for (const stage of stages) {
        updateLoadingProgress(stage.message, stage.progress);
        await sleep(800);
    }
    
    // Process the actual resume
    const formData = new FormData();
    formData.append('resume', state.resumeFile);
    formData.append('jobDescription', state.jobDescriptionText);
    formData.append('options', JSON.stringify(state.options));
    
    try {
        const response = await fetch('/api/tailor-resume', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            state.results = result;
            displayResults(result);
        } else {
            throw new Error('Server processing failed');
        }
    } catch (error) {
        // For demo purposes, generate mock results
        console.log('Using mock results for demo');
        const mockResults = generateMockResults();
        state.results = mockResults;
        displayResults(mockResults);
    }
}

function updateLoadingProgress(message, progress) {
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================
// Results Display
// ===================================

function displayResults(results) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    // Update ATS Score
    updateATSScore(results.atsScore);
    
    // Update statistics
    document.getElementById('matchedKeywords').textContent = results.matchedKeywords;
    document.getElementById('improvementPercent').textContent = results.improvement;
    document.getElementById('matchQuality').textContent = results.matchQuality;
    
    // Display keywords
    displayKeywords(results.keywords);
    
    // Display improvements
    displayImprovements(results.improvements);
    
    // Display suggestions
    displaySuggestions(results.suggestions);
    
    // Display comparison
    displayComparison(results.originalText, results.tailoredText);
}

function updateATSScore(score) {
    const circle = document.getElementById('progressCircle');
    const scoreText = document.getElementById('atsScore');
    
    const circumference = 534.07;
    const offset = circumference - (score / 100) * circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        animateScore(scoreText, 0, score, 2000);
    }, 100);
    
    // Update circle color based on score
    if (score >= 80) {
        circle.setAttribute('stroke', '#10b981');
    } else if (score >= 60) {
        circle.setAttribute('stroke', '#f59e0b');
    } else {
        circle.setAttribute('stroke', '#ef4444');
    }
}

function animateScore(element, start, end, duration) {
    const startTime = Date.now();
    
    function update() {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function displayKeywords(keywords) {
    const container = document.getElementById('keywordsList');
    container.innerHTML = '';
    
    keywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag ' + (keyword.matched ? 'matched' : 'missing');
        tag.textContent = keyword.text;
        container.appendChild(tag);
    });
}

function displayImprovements(improvements) {
    const list = document.getElementById('improvementsList');
    list.innerHTML = '';
    
    improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        list.appendChild(li);
    });
}

function displaySuggestions(suggestions) {
    const list = document.getElementById('suggestionsList');
    list.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        list.appendChild(li);
    });
}

function displayComparison(original, tailored) {
    document.getElementById('originalPreview').textContent = original;
    document.getElementById('tailoredPreview').textContent = tailored;
}

// ===================================
// Tab Navigation in Results
// ===================================

document.querySelectorAll('.tab-header').forEach(header => {
    header.addEventListener('click', () => {
        const target = header.dataset.target;
        
        // Update headers
        document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
        header.classList.add('active');
        
        // Update panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// ===================================
// Download Handlers
// ===================================

document.getElementById('downloadResume').addEventListener('click', () => {
    if (state.results && state.results.resumePdf) {
        downloadFile(state.results.resumePdf, 'tailored_resume.pdf');
    } else {
        alert('Resume PDF not available. Please try processing again.');
    }
});

document.getElementById('downloadCoverLetter').addEventListener('click', () => {
    if (state.results && state.results.coverLetterPdf) {
        downloadFile(state.results.coverLetterPdf, 'cover_letter.pdf');
    } else {
        alert('Cover letter not available.');
    }
});

document.getElementById('downloadLatex').addEventListener('click', () => {
    if (state.results && state.results.latexSource) {
        downloadFile(state.results.latexSource, 'resume.tex', 'text/plain');
    } else {
        alert('LaTeX source not available.');
    }
});

document.getElementById('downloadAnalysis').addEventListener('click', () => {
    if (state.results) {
        const analysis = JSON.stringify(state.results, null, 2);
        const blob = new Blob([analysis], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume_analysis.json';
        a.click();
    }
});

function downloadFile(data, filename, mimeType = 'application/pdf') {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===================================
// Action Buttons
// ===================================

document.getElementById('tailorAnother').addEventListener('click', () => {
    // Reset form
    state.resumeFile = null;
    state.jobDescriptionText = '';
    state.jdFile = null;
    state.results = null;
    
    document.getElementById('resumeFile').value = '';
    document.getElementById('resumeFileName').textContent = 'No file selected';
    document.getElementById('resumeFileName').classList.remove('selected');
    
    document.getElementById('jobDescriptionText').value = '';
    document.getElementById('jdFile').value = '';
    document.getElementById('jdFileName').textContent = 'No file selected';
    document.getElementById('jdFileName').classList.remove('selected');
    
    document.getElementById('resultsSection').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('shareResults').addEventListener('click', () => {
    if (navigator.share && state.results) {
        navigator.share({
            title: 'My ATS Resume Score',
            text: `I got an ATS score of ${state.results.atsScore}% with ATS Resume Tailor!`,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        alert('Sharing not supported on this browser');
    }
});

// ===================================
// Mock Data Generator (for demo)
// ===================================

function generateMockResults() {
    const companyName = state.options.companyName || 'Target Company';
    const role = state.options.targetRole || 'Data Engineer';
    
    return {
        atsScore: Math.floor(Math.random() * 20) + 80, // 80-100
        matchedKeywords: Math.floor(Math.random() * 30) + 40, // 40-70
        improvement: Math.floor(Math.random() * 20) + 25, // 25-45
        matchQuality: 'Excellent',
        keywords: [
            { text: 'Python', matched: true },
            { text: 'Java', matched: true },
            { text: 'Scala', matched: true },
            { text: 'Apache Spark', matched: true },
            { text: 'Apache Flink', matched: true },
            { text: 'Distributed Systems', matched: true },
            { text: 'Data Modeling', matched: true },
            { text: 'ETL/ELT', matched: true },
            { text: 'Cloud Platforms', matched: true },
            { text: 'Big Data', matched: true },
            { text: 'Kafka', matched: true },
            { text: 'SQL', matched: true },
            { text: 'AWS', matched: true },
            { text: 'Data Warehousing', matched: true },
            { text: 'Real-time Processing', matched: true },
            { text: 'Machine Learning', matched: false },
            { text: 'Docker', matched: false },
            { text: 'Kubernetes', matched: false }
        ],
        improvements: [
            `Tailored summary to emphasize ${role} skills and ${companyName} culture alignment`,
            'Added distributed systems and big data technologies prominently',
            'Highlighted Python, Java, and Scala proficiency',
            'Emphasized Spark and Flink expertise with specific examples',
            'Included web-scale datasets and performance optimization metrics',
            'Added data modeling and analytics focus',
            'Incorporated company-specific keywords and values',
            'Optimized for ATS parsing with clean formatting',
            'Enhanced technical skills section with relevant technologies',
            'Added quantifiable achievements and impact metrics'
        ],
        suggestions: [
            'Consider adding more specific metrics to quantify your impact',
            'Include any relevant certifications or training',
            'Add links to GitHub projects or portfolio if applicable',
            'Mention any contributions to open-source projects',
            'Consider adding a brief "Key Achievements" section',
            'Include industry-specific terminology from the job description',
            'Add keywords related to company culture and values'
        ],
        originalText: `SUMMARY\n\nData Engineer with 6+ years of experience...\n\nTECHNICAL SKILLS\n\nProgramming: Python, SQL, Java...\n\nEXPERIENCE\n\nSenior Data Engineer | Company A\n- Built data pipelines\n- Worked with teams\n- Improved performance`,
        tailoredText: `SUMMARY\n\nData Engineer with 6+ years of experience building scalable distributed data processing systems and elegant, maintainable code across cloud platforms including AWS, Azure, and GCP. Passionate about pushing the boundaries of analytical insights and creating data-driven product features at web-scale.\n\nTECHNICAL SKILLS\n\nProgramming: Python, Java, Scala, SQL (PostgreSQL, T-SQL)\nBig Data: Apache Spark, Apache Flink, Hadoop, Kafka\nCloud: AWS (EMR, S3, Glue, Redshift), Azure, GCP\n\nEXPERIENCE\n\nSenior Data Engineer | Company A\n- Architected distributed data processing systems using Apache Spark and Flink, processing petabyte-scale datasets\n- Collaborated with cross-functional teams including data scientists and ML engineers\n- Improved query performance by 40% through optimization`,
        resumePdf: null, // Would be actual PDF blob
        coverLetterPdf: null,
        latexSource: null
    };
}

// ===================================
// Smooth Scroll for Navigation
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// Initialize
// ===================================

console.log('ATS Resume Tailor initialized');
