#!/bin/bash
################################################################################
# Setup and Test Script for Bhanu's Resume Tailor
################################################################################

echo "════════════════════════════════════════════════════════════════════════"
echo "  Setting up Bhanu's Resume Tailor for Local Testing"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi
echo "✅ Python found: $(python3 --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Download NLTK data
echo ""
echo "📚 Downloading NLTK data..."
python3 -m nltk.downloader punkt stopwords punkt_tab

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p uploads outputs

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ Setup complete! Ready to run locally or deploy!"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "To run locally:"
echo "  python3 app.py"
echo ""
echo "To deploy to Render:"
echo "  See DEPLOY_INSTRUCTIONS.md"
echo ""
