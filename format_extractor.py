"""
Format Extractor - Extracts exact format and spacing from uploaded resume
Preserves all LaTeX formatting, spacing, and structure
"""

import re
import PyPDF2
from pathlib import Path

def extract_latex_format(tex_file_path):
    """
    Extract exact LaTeX format from .tex file
    
    Args:
        tex_file_path: Path to LaTeX source file
    
    Returns:
        Dictionary containing format specifications
    """
    with open(tex_file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    format_info = {
        'preamble': extract_preamble(content),
        'margins': extract_margins(content),
        'spacing': extract_spacing_commands(content),
        'section_format': extract_section_formatting(content),
        'bullet_style': extract_bullet_style(content),
        'custom_commands': extract_custom_commands(content),
        'full_template': content
    }
    
    return format_info


def extract_preamble(content):
    """Extract document preamble (packages and settings)"""
    match = re.search(r'\\documentclass.*?\\begin{document}', content, re.DOTALL)
    return match.group(0) if match else ''


def extract_margins(content):
    """Extract margin settings"""
    margins = {}
    
    patterns = {
        'oddsidemargin': r'\\addtolength{\\oddsidemargin}{([^}]+)}',
        'evensidemargin': r'\\addtolength{\\evensidemargin}{([^}]+)}',
        'textwidth': r'\\addtolength{\\textwidth}{([^}]+)}',
        'topmargin': r'\\addtolength{\\topmargin}{([^}]+)}',
        'textheight': r'\\addtolength{\\textheight}{([^}]+)}'
    }
    
    for key, pattern in patterns.items():
        match = re.search(pattern, content)
        if match:
            margins[key] = match.group(1)
    
    return margins


def extract_spacing_commands(content):
    """Extract all vspace and hspace commands"""
    vspace_commands = re.findall(r'\\vspace{([^}]+)}', content)
    hspace_commands = re.findall(r'\\hspace{([^}]+)}', content)
    
    return {
        'vspace': list(set(vspace_commands)),
        'hspace': list(set(hspace_commands))
    }


def extract_section_formatting(content):
    """Extract section title formatting"""
    match = re.search(r'\\titleformat{\\section}{([^}]+)}', content, re.DOTALL)
    return match.group(1) if match else ''


def extract_bullet_style(content):
    """Extract bullet point styling"""
    patterns = {
        'labelitemi': r'\\renewcommand\\labelitemi{([^}]+)}',
        'labelitemii': r'\\renewcommand\\labelitemii{([^}]+)}',
        'leftmargin': r'leftmargin=([^,\]]+)'
    }
    
    styles = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, content)
        if match:
            styles[key] = match.group(1)
    
    return styles


def extract_custom_commands(content):
    """Extract all custom command definitions"""
    commands = {}
    
    # Find all \newcommand definitions
    pattern = r'\\newcommand{(\\[^}]+)}(\[[^\]]*\])?\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for match in matches:
        cmd_name = match.group(1)
        cmd_def = match.group(0)
        commands[cmd_name] = cmd_def
    
    return commands


def extract_structure_from_pdf(pdf_path):
    """
    Extract resume structure from PDF to understand layout
    
    Args:
        pdf_path: Path to PDF file
    
    Returns:
        Dictionary with structure information
    """
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        structure = {
            'num_pages': len(pdf_reader.pages),
            'sections': [],
            'has_header': False,
            'has_skills_section': False,
            'has_experience': False
        }
        
        # Extract text and analyze structure
        for page in pdf_reader.pages:
            text = page.extract_text()
            
            # Detect sections
            if 'Summary' in text or 'SUMMARY' in text:
                structure['sections'].append('Summary')
            if 'Technical Skills' in text or 'SKILLS' in text:
                structure['sections'].append('Technical Skills')
                structure['has_skills_section'] = True
            if 'Experience' in text or 'EXPERIENCE' in text:
                structure['sections'].append('Experience')
                structure['has_experience'] = True
            if 'Education' in text or 'EDUCATION' in text:
                structure['sections'].append('Education')
            if 'Certifications' in text or 'CERTIFICATIONS' in text:
                structure['sections'].append('Certifications')
        
        return structure


def apply_format_to_content(original_format, new_content, jd_keywords):
    """
    Apply extracted format to new content while highlighting keywords
    
    Args:
        original_format: Format info from extract_latex_format()
        new_content: New content to format
        jd_keywords: Keywords from job description to highlight
    
    Returns:
        Formatted LaTeX content
    """
    
    # Start with original preamble
    latex_output = original_format['preamble']
    
    # Apply custom commands
    for cmd_name, cmd_def in original_format['custom_commands'].items():
        if cmd_def not in latex_output:
            # Insert before \begin{document}
            latex_output = latex_output.replace(
                r'\begin{document}',
                cmd_def + '\n\n' + r'\begin{document}'
            )
    
    # Add content with keyword highlighting
    latex_output += '\n\n' + highlight_keywords_in_latex(new_content, jd_keywords)
    
    latex_output += '\n\n\\end{document}'
    
    return latex_output


def highlight_keywords_in_latex(content, keywords):
    """
    Highlight important keywords in LaTeX content using textbf
    
    Args:
        content: LaTeX content
        keywords: List of keywords to highlight
    
    Returns:
        Content with highlighted keywords
    """
    
    # Keywords to highlight (make bold)
    for keyword in keywords:
        # Only highlight if not already in a command
        pattern = r'(?<!\\textbf{)(?<!\\)(' + re.escape(keyword) + r')(?!})'
        content = re.sub(
            pattern, 
            r'\\textbf{\1}', 
            content, 
            flags=re.IGNORECASE
        )
    
    return content


def merge_resume_with_jd(original_tex_path, jd_analysis, options):
    """
    Main function: Merge original resume format with JD-optimized content
    
    Args:
        original_tex_path: Path to original .tex file
        jd_analysis: Job description analysis results
        options: User options (company, role, etc.)
    
    Returns:
        Complete LaTeX source with original format + optimized content
    """
    
    # Extract format from original
    format_info = extract_latex_format(original_tex_path)
    
    # Get keywords to highlight
    jd_keywords = [kw['text'] for kw in jd_analysis.get('keywords', [])]
    jd_skills = jd_analysis.get('skills', [])
    
    # Read original content
    with open(original_tex_path, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    # Extract document body
    body_match = re.search(r'\\begin{document}(.*?)\\end{document}', original_content, re.DOTALL)
    if body_match:
        body_content = body_match.group(1)
        
        # Optimize content for JD while keeping format
        optimized_body = optimize_content_for_jd(body_content, jd_keywords, jd_skills, options)
        
        # Replace body in original
        optimized_resume = original_content.replace(
            body_match.group(0),
            r'\begin{document}' + optimized_body + r'\end{document}'
        )
        
        return optimized_resume
    
    return original_content


def optimize_content_for_jd(body_content, jd_keywords, jd_skills, options):
    """
    Optimize resume content for job description while preserving format
    
    Args:
        body_content: Original body content
        jd_keywords: Keywords from JD
        jd_skills: Skills from JD
        options: User options
    
    Returns:
        Optimized body content
    """
    
    optimized = body_content
    
    # Highlight keywords in summary
    summary_match = re.search(r'(\\section\{Summary:?\}.*?)(\\section)', optimized, re.DOTALL)
    if summary_match:
        summary_content = summary_match.group(1)
        highlighted_summary = highlight_keywords_in_latex(summary_content, jd_keywords[:20])
        optimized = optimized.replace(summary_content, highlighted_summary)
    
    # Highlight skills in technical skills section
    skills_match = re.search(r'(\\section\{Technical Skills:?\}.*?)(\\section)', optimized, re.DOTALL)
    if skills_match:
        skills_content = skills_match.group(1)
        highlighted_skills = highlight_keywords_in_latex(skills_content, jd_skills)
        optimized = optimized.replace(skills_content, highlighted_skills)
    
    # Highlight keywords in experience section
    exp_match = re.search(r'(\\section\{Professional Experience:?\}.*?)(\\section|\\end\{document\})', optimized, re.DOTALL)
    if exp_match:
        exp_content = exp_match.group(1)
        highlighted_exp = highlight_keywords_in_latex(exp_content, jd_keywords[:30])
        optimized = optimized.replace(exp_content, highlighted_exp)
    
    return optimized


def convert_pdf_to_latex_with_format(pdf_path, output_tex_path=None):
    """
    Attempt to convert PDF to LaTeX while preserving format
    This is a best-effort conversion for PDFs without source
    
    Args:
        pdf_path: Path to PDF file
        output_tex_path: Optional path to save .tex file
    
    Returns:
        Generated LaTeX source (basic template)
    """
    
    structure = extract_structure_from_pdf(pdf_path)
    
    # Generate a basic LaTeX template based on PDF structure
    # This is a fallback when original .tex is not available
    
    template = r"""\documentclass[letterpaper,11pt]{article}

\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}

% Adjust margins to match common resume format
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\begin{document}

% Content extracted from PDF will be inserted here

\end{document}
"""
    
    if output_tex_path:
        with open(output_tex_path, 'w', encoding='utf-8') as f:
            f.write(template)
    
    return template
