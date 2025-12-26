#!/bin/bash

################################################################################
# AUTO DEPLOY SCRIPT - Bhanu's Resume Tailor
# This script will push to GitHub and guide you through Render deployment
################################################################################

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                          ║"
echo "║              🚀 AUTO DEPLOY - Bhanu's Resume Tailor                     ║"
echo "║                                                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo -e "${RED}❌ Error: Please run this script from the resume-tailor-app directory${NC}"
    echo "Run: cd /home/bhanu/Desktop/Resumes/resume-tailor-app"
    exit 1
fi

echo -e "${GREEN}✅ Correct directory found${NC}"
echo ""

# Check Git status
echo "═══════════════════════════════════════════════════════════════════════════"
echo "📋 Checking Git Status..."
echo "═══════════════════════════════════════════════════════════════════════════"

if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    
    # Check if there are changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes found. Adding them...${NC}"
        git add .
        git commit -m "Update: Preparing for deployment $(date +%Y-%m-%d)"
    else
        echo -e "${GREEN}✅ All changes already committed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit: Bhanu's Resume Tailor"
    git branch -M main
    git remote add origin https://github.com/dayyalabhanuprakash/Bhanu-s-Jobs.git
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "🔐 GitHub Authentication Required"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "You'll need a Personal Access Token to push to GitHub."
echo ""
echo -e "${YELLOW}Do you have a GitHub Personal Access Token? (y/n)${NC}"
read -r has_token

if [ "$has_token" != "y" ]; then
    echo ""
    echo "Please create one:"
    echo "1. Open: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Check the 'repo' scope"
    echo "4. Generate and copy the token"
    echo ""
    echo "Press Enter when you have your token ready..."
    read -r
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "📤 Pushing to GitHub..."
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Repository: https://github.com/dayyalabhanuprakash/Bhanu-s-Jobs.git"
echo ""
echo -e "${YELLOW}When prompted:${NC}"
echo "  Username: dayyalabhanuprakash"
echo "  Password: [Your Personal Access Token]"
echo ""

# Try to push
git push -u origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ SUCCESS! Code pushed to GitHub!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "🌐 Repository: https://github.com/dayyalabhanuprakash/Bhanu-s-Jobs"
    echo ""
    
    # Now guide through Render deployment
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "🚀 Next: Deploy on Render"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Opening Render dashboard in 3 seconds..."
    sleep 3
    
    # Try to open Render in browser
    if command -v xdg-open > /dev/null; then
        xdg-open "https://dashboard.render.com/" 2>/dev/null
    elif command -v open > /dev/null; then
        open "https://dashboard.render.com/"
    else
        echo "Please open: https://dashboard.render.com/"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "📋 RENDER DEPLOYMENT SETTINGS"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "1. Click 'New +' → 'Web Service'"
    echo "2. Connect to repository: Bhanu-s-Jobs"
    echo "3. Fill in these settings:"
    echo ""
    echo "   Name: bhanu-resume-tailor"
    echo ""
    echo "   Root Directory: resume-tailor-app"
    echo ""
    echo "   Environment: Python 3"
    echo ""
    echo "   Build Command (copy this):"
    echo "   ┌─────────────────────────────────────────────────────────────────────┐"
    echo "   │ pip install -r requirements.txt && python -m nltk.downloader punkt stopwords punkt_tab │"
    echo "   └─────────────────────────────────────────────────────────────────────┘"
    echo ""
    echo "   Start Command (copy this):"
    echo "   ┌─────────────────────────────────────────────────────────────────────┐"
    echo "   │ gunicorn app:app                                                    │"
    echo "   └─────────────────────────────────────────────────────────────────────┘"
    echo ""
    echo "   Instance Type: Free"
    echo ""
    echo "4. Click 'Create Web Service'"
    echo "5. Wait 2-3 minutes for deployment"
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo -e "${GREEN}🎉 Your app will be live at: https://bhanu-resume-tailor.onrender.com${NC}"
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════"
    
    # Save deployment info
    cat > DEPLOYMENT_INFO.txt << EOF
╔══════════════════════════════════════════════════════════════════════════╗
║                     DEPLOYMENT INFORMATION                               ║
╚══════════════════════════════════════════════════════════════════════════╝

✅ Code Successfully Pushed to GitHub!

Repository: https://github.com/dayyalabhanuprakash/Bhanu-s-Jobs
Deployed: $(date)

═══════════════════════════════════════════════════════════════════════════
RENDER DEPLOYMENT SETTINGS:
═══════════════════════════════════════════════════════════════════════════

Name: bhanu-resume-tailor
Root Directory: resume-tailor-app
Environment: Python 3

Build Command:
pip install -r requirements.txt && python -m nltk.downloader punkt stopwords punkt_tab

Start Command:
gunicorn app:app

Instance Type: Free

═══════════════════════════════════════════════════════════════════════════
YOUR APP URL:
═══════════════════════════════════════════════════════════════════════════

https://bhanu-resume-tailor.onrender.com

═══════════════════════════════════════════════════════════════════════════
FEATURES:
═══════════════════════════════════════════════════════════════════════════

✅ Beautiful modern UI
✅ AI-powered resume analysis
✅ ATS compatibility scoring
✅ Keyword extraction and matching
✅ Mobile responsive design
✅ Professional results dashboard
✅ Free to use

═══════════════════════════════════════════════════════════════════════════
EOF
    
    echo -e "${GREEN}✅ Deployment info saved to DEPLOYMENT_INFO.txt${NC}"
    echo ""
    
else
    echo ""
    echo -e "${RED}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}❌ Push failed. Please check:${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "1. Did you use your Personal Access Token (not your password)?"
    echo "2. Does the token have 'repo' permissions?"
    echo "3. Is your username correct: dayyalabhanuprakash"
    echo ""
    echo "Get a token here: https://github.com/settings/tokens"
    echo ""
    echo "Then try again:"
    echo "  ./auto_deploy.sh"
    echo ""
fi
