# Script de vérification des dépendances
# Usage: .\CHECK.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vérification d'Installation          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()

# 1. Python
Write-Host "📋 Python..." -ForegroundColor Yellow
$pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
if ($pythonPath) {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ $pythonVersion" -ForegroundColor Green
    Write-Host "    $pythonPath" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Python non trouvé!" -ForegroundColor Red
    $issues += "Python"
}

# 2. Node.js
Write-Host ""
Write-Host "📋 Node.js..." -ForegroundColor Yellow
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodePath) {
    $nodeVersion = node --version 2>&1
    $npmVersion = npm --version 2>&1
    Write-Host "  ✓ $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ npm $npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js non trouvé!" -ForegroundColor Red
    $issues += "Node.js"
}

# 3. Backend venv
Write-Host ""
Write-Host "📋 Backend venv..." -ForegroundColor Yellow
if (Test-Path "backend\venv\Scripts\python.exe") {
    Write-Host "  ✓ Virtual environment trouvé" -ForegroundColor Green
    
    # Vérifier les dépendances Python
    $requiredPackages = @("pandas", "flask", "flask-cors", "openpyxl", "pdfplumber")
    $missingPackages = @()
    
    foreach ($pkg in $requiredPackages) {
        $check = & ".\backend\venv\Scripts\python.exe" -c "import ${pkg}" 2>&1
        if ($LASTEXITCODE -ne 0) {
            $missingPackages += $pkg
        }
    }
    
    if ($missingPackages.Count -eq 0) {
        Write-Host "  ✓ Toutes les dépendances Python installées" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Dépendances manquantes: $($missingPackages -join ', ')" -ForegroundColor Red
        $issues += "Dépendances Python: $($missingPackages -join ', ')"
    }
} else {
    Write-Host "  ✗ Virtual environment non trouvé" -ForegroundColor Red
    $issues += "Backend venv"
}

# 4. Frontend node_modules
Write-Host ""
Write-Host "📋 Frontend node_modules..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  ✓ Modules npm trouvés" -ForegroundColor Green
} else {
    Write-Host "  ✗ Modules npm non trouvés" -ForegroundColor Yellow
    $issues += "Frontend node_modules (npm install nécessaire)"
}

# 5. Ports
Write-Host ""
Write-Host "📋 Ports..." -ForegroundColor Yellow
$port5000 = netstat -ano 2>$null | Select-String ":5000"
$port5173 = netstat -ano 2>$null | Select-String ":5173"

if ($port5000) {
    Write-Host "  ⚠ Port 5000 déjà en utilisation (Flask)" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Port 5000 libre" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "  ⚠ Port 5173 déjà en utilisation (npm)" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Port 5173 libre" -ForegroundColor Green
}

# Résumé
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($issues.Count -eq 0) {
    Write-Host "  ✓ Tout est OK!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Lancez l'app avec: .\run.ps1" -ForegroundColor Green
} else {
    Write-Host "  ✗ Problèmes détectés:" -ForegroundColor Red
    Write-Host ""
    foreach ($issue in $issues) {
        Write-Host "    • $issue" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "  Solutions:" -ForegroundColor Yellow
    Write-Host "    1. Exécutez: .\INSTALL.ps1" -ForegroundColor Yellow
    Write-Host "    2. Attendez la fin complète" -ForegroundColor Yellow
    Write-Host "    3. Relancez: .\CHECK.ps1 pour vérifier" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entrée pour fermer"
