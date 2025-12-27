#!/bin/bash
################################################################################
# ATS Resume Tailor - Quick Start Script
################################################################################

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║              Starting ATS Resume Tailor Application                     ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi
echo "✅ Python 3 found: $(python3 --version)"

# Check if in correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Please run this script from the resume-tailor-app directory"
    exit 1
fi

# Create directories
mkdir -p uploads outputs
echo "✅ Created uploads and outputs directories"

# Check if dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo ""
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    echo "✅ Dependencies installed"
else
    echo "✅ Python dependencies already installed"
fi

# Check Tectonic
TECTONIC_PATH="$HOME/.local/bin/tectonic"
if [ -f "$TECTONIC_PATH" ]; then
    echo "✅ Tectonic LaTeX compiler found"
else
    echo "⚠️  Tectonic not found at $TECTONIC_PATH"
    echo "   LaTeX compilation will not work. Install with:"
    echo "   bash ../tmp_rovodev_install_tectonic.sh"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "Starting services..."
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Start backend in background
echo "🚀 Starting Backend API on port 5000..."
python3 app.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend in background
echo "🌐 Starting Frontend on port 8082..."
python3 -m http.server 8082 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 2

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ ATS Resume Tailor is now running!"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Frontend: http://localhost:8082"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "📖 Open http://localhost:8082 in your browser to use the application"
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "Press Ctrl+C to stop all services"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Save PIDs to file for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# Wait for interrupt
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo 'Services stopped.'; exit 0" INT

# Keep script running
wait
