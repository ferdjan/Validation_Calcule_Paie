# Script d'installation complet pour Windows
# Usage: .\INSTALL.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation - Calculateur de Paie    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier Python
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow
Write-Host ""

$pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $pythonPath) {
    Write-Host "✗ ERREUR: Python n'est pas installé!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Instructions d'installation:" -ForegroundColor Yellow
    Write-Host "  1. Téléchargez Python 3.8+ depuis: https://www.python.org" -ForegroundColor White
    Write-Host "  2. ✓ Cochez 'Add Python to PATH' pendant l'installation" -ForegroundColor White
    Write-Host "  3. Redémarrez le terminal/PowerShell après installation" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entrée après installation"
    exit 1
}
$pythonVersion = python --version 2>&1
Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
Write-Host "  Chemin: $pythonPath" -ForegroundColor Gray

# 2. Vérifier Node.js
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $nodePath) {
    Write-Host "✗ ERREUR: Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Instructions d'installation:" -ForegroundColor Yellow
    Write-Host "  1. Téléchargez Node.js 18+ depuis: https://nodejs.org" -ForegroundColor White
    Write-Host "  2. Exécutez l'installateur et acceptez tous les paramètres par défaut" -ForegroundColor White
    Write-Host "  3. Redémarrez le terminal/PowerShell après installation" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entrée après installation"
    exit 1
}
$nodeVersion = node --version 2>&1
$npmVersion = npm --version 2>&1
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✓ npm: $npmVersion" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Configuration de l'application..." -ForegroundColor Cyan
Write-Host ""

# 3. Backend
Write-Host "📦 Backend Python:" -ForegroundColor Yellow
if (Test-Path "backend\venv") {
    Write-Host "  • Venv existant détecté, suppression..." -ForegroundColor Gray
    Remove-Item -Path "backend\venv" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

Write-Host "  • Création du venv..." -ForegroundColor Gray
cd backend
# Préférer Python 3.11 (compatible avec les dépendances), sinon python du PATH
$basePython = "python"
$baseArgs = @()
if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3.11 --version 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { $basePython = "py"; $baseArgs = @("-3.11") }
}
& $basePython @baseArgs -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Erreur lors de la création du venv" -ForegroundColor Red
    cd ..
    exit 1
}

Write-Host "  • Installation des dépendances..." -ForegroundColor Gray
& ".\venv\Scripts\pip.exe" install --upgrade pip -q 2>$null
& ".\venv\Scripts\pip.exe" install -r requirements.txt -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Certaines dépendances n'ont pas pu être installées" -ForegroundColor Yellow
    exit 1
}
cd ..

Write-Host "  ✓ Backend OK" -ForegroundColor Green

# 4. Frontend
Write-Host ""
Write-Host "📦 Frontend Node.js:" -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  • Modules npm existants détectés, suppression..." -ForegroundColor Gray
    Remove-Item -Path "frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "  • Installation des dépendances npm..." -ForegroundColor Gray
cd frontend
npm install -q 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Erreur lors de l'installation npm" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..

Write-Host "  ✓ Frontend OK" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Installation réussie!              " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour lancer l'application:" -ForegroundColor Cyan
Write-Host "  • Double-cliquez sur: run.ps1" -ForegroundColor White
Write-Host "  • Ou exécutez: .\run.ps1" -ForegroundColor White
Write-Host ""

Read-Host "Appuyez sur Entrée pour fermer"
