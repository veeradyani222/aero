# Safe development start script for Windows
# Prevents EPERM errors and ensures clean start

param(
    [int]$Port = 3000
)

Write-Host "🚀 Starting development server on port $Port..." -ForegroundColor Cyan

# Ensure clean environment first
Write-Host "🧹 Running cleanup first..." -ForegroundColor Yellow
& "$PSScriptRoot\dev-clean.ps1"

# Wait a moment for cleanup to complete
Start-Sleep -Seconds 3

# Set the port environment variable
$env:PORT = $Port

# Start development server
try {
    Write-Host "▶️ Starting Next.js development server..." -ForegroundColor Green
    npm run dev -- -p $Port
} catch {
    Write-Host "❌ Failed to start development server" -ForegroundColor Red
    Write-Host "💡 Try running cleanup manually: .\scripts\dev-clean.ps1" -ForegroundColor Yellow
    exit 1
} 
