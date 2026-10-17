# Script de nettoyage prudent du projet
# Usage: .\CLEAN.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Nettoyage du Projet - Paie Algerienne" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$removedItems = @()

# 1. Supprimer l'ancien venv à la racine (inutile)
$rootVenv = "venv"
if (Test-Path $rootVenv) {
    Write-Host "Suppression du venv racine (inutile)..." -ForegroundColor Yellow
    Remove-Item -Path $rootVenv -Recurse -Force -ErrorAction SilentlyContinue
    $removedItems += $rootVenv
    Write-Host "  OK: Supprime" -ForegroundColor Green
}

# 2. Supprimer les __pycache__ dans backend
$backendPycache = "backend\__pycache__"
if (Test-Path $backendPycache) {
    Write-Host "Suppression des fichiers __pycache__..." -ForegroundColor Yellow
    Remove-Item -Path $backendPycache -Recurse -Force -ErrorAction SilentlyContinue
    $removedItems += $backendPycache
    Write-Host "  OK: Supprime" -ForegroundColor Green
}

# 3. Supprimer les fichiers .pyc dans backend
$backendPycFiles = Get-ChildItem -Path "backend" -Filter "*.pyc" -Recurse -ErrorAction SilentlyContinue
if ($backendPycFiles) {
    Write-Host "Suppression des fichiers .pyc..." -ForegroundColor Yellow
    $backendPycFiles | Remove-Item -Force -ErrorAction SilentlyContinue
    $removedItems += $backendPycFiles.Name
    Write-Host "  OK: $($backendPycFiles.Count) fichiers supprimes" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Nettoyage termine!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($removedItems.Count -gt 0) {
    Write-Host "Fichiers/dossiers supprimes:" -ForegroundColor Cyan
    foreach ($item in $removedItems) {
        Write-Host "  • $item" -ForegroundColor White
    }
} else {
    Write-Host "Aucun fichier a supprimer trouve." -ForegroundColor Green
}

Write-Host ""
Write-Host "Taille actuelle du projet:" -ForegroundColor Cyan
$projectSize = (Get-ChildItem -Path "." -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  $([math]::Round($projectSize, 1)) MB" -ForegroundColor White

Write-Host ""
Read-Host "Appuyez sur Entree pour fermer"
