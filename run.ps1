# Script de demarrage robuste avec vérifications
$Host.UI.RawUI.WindowTitle = "Lanceur Paie"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Calculateur de Paie Algerienne      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier Python
Write-Host "OK: Verification de Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Python n'est pas installe ou configure!" -ForegroundColor Red
    Write-Host "  Telechargez Python 3.8+ depuis: https://www.python.org" -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour fermer"
    exit 1
}
Write-Host "  $pythonVersion" -ForegroundColor Green

# 2. Vérifier Node.js
Write-Host "OK: Verification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Node.js n'est pas installe!" -ForegroundColor Red
    Write-Host "  Telechargez Node.js 18+ depuis: https://nodejs.org" -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour fermer"
    exit 1
}
Write-Host "  $nodeVersion" -ForegroundColor Green

# 3. Backend: Créer/Mettre à jour venv
Write-Host ""
Write-Host "OK: Configuration du backend Python..." -ForegroundColor Yellow
$backendVenv = "backend\venv"

if (-not (Test-Path $backendVenv)) {
    Write-Host "  Creation du venv..." -ForegroundColor Gray
    cd backend
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de la creation du venv!" -ForegroundColor Red
        cd ..
        Read-Host "Appuyez sur Entree pour fermer"
        exit 1
    }
    cd ..
}

# Mettre à jour les dépendances (toujours)
Write-Host "  Installation des dependances Python..." -ForegroundColor Gray
& ".\backend\venv\Scripts\pip.exe" install -q -r "backend\requirements.txt" --disable-pip-version-check 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Avertissement: Certaines dependances n'ont pas pu etre installees" -ForegroundColor Yellow
    Write-Host "  Tentative de reparation..." -ForegroundColor Gray
    & ".\backend\venv\Scripts\pip.exe" install --upgrade pip -q --disable-pip-version-check 2>$null
    & ".\backend\venv\Scripts\pip.exe" install -r "backend\requirements.txt" -q --disable-pip-version-check 2>$null
}
Write-Host "  Backend: OK" -ForegroundColor Green

# 4. Frontend: npm install
Write-Host ""
Write-Host "OK: Configuration du frontend..." -ForegroundColor Yellow
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "  Installation des dependances npm..." -ForegroundColor Gray
    cd frontend
    npm install --silent 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'installation npm!" -ForegroundColor Red
        cd ..
        Read-Host "Appuyez sur Entree pour fermer"
        exit 1
    }
    cd ..
}
Write-Host "  Frontend: OK" -ForegroundColor Green

# 5. Lancer backend et frontend
Write-Host ""
Write-Host "🚀 Lancement de l'application..." -ForegroundColor Cyan

Start-Process -FilePath ".\backend\venv\Scripts\python.exe" -ArgumentList "app.py" -WorkingDirectory ".\backend" -WindowStyle Hidden
Start-Sleep -Milliseconds 2000

Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory ".\frontend" -WindowStyle Hidden
Start-Sleep -Milliseconds 2000

# 6. Ouvrir le navigateur
Write-Host ""
Write-Host "OK: Ouverture du navigateur..." -ForegroundColor Green
Write-Host "  URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK: L'application est lancee!" -ForegroundColor Green
Write-Host "  Appuyez sur Ctrl+C pour arreter" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:5173"

# Garder la fenêtre ouverte
while ($true) {
    Start-Sleep -Seconds 1
}
