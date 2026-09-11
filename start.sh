#!/bin/bash

# LU Obfuscator - macOS/Linux Start Script

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🔒 LU Obfuscator - macOS/Linux App    ║"
echo "║                                        ║"
echo "║  Starting web server...                ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Error: Node.js is not installed!"
    echo ""
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ Error: npm is not installed!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Installation failed!"
        exit 1
    fi
fi

# Start the server
echo "✅ Starting LU Obfuscator..."
echo ""
echo "🌐 Web Server: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node server.js
