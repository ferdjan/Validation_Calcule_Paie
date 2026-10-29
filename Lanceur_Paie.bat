@echo off
setlocal
title Gestionnaire Paie Algérienne
echo --------------------------------------------------
echo      GESTIONNAIRE DE PAIE ALGERIENNE v6.2
echo --------------------------------------------------
echo.

:: Vérifie si les applications sont déjà en train de tourner (ports 5000 et 5173)
netstat -ano | findstr :5000 >nul
set backend_running=%errorlevel%
netstat -ano | findstr :5173 >nul
set frontend_running=%errorlevel%

if %backend_running% equ 0 (
    :: --- MODE FERMETURE ---
    echo [!] L'application est deja ouverte.
    echo.
    echo ARRET EN COURS...
    echo.

    :: Tue les processus Python et Node.js proprement
    taskkill /F /IM python.exe /T 2>nul
    taskkill /F /IM node.exe /T 2>nul
    
    :: Attendre que les ports se libèrent
    timeout /t 2 >nul
    
    :: Forcer la libération des ports (mode agressif)
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F 2>nul
    )
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /PID %%a /F 2>nul
    )

    echo.
    echo ✅ APPLICATION FERMEE !
    echo Vous pouvez maintenant eteindre votre ordinateur.
    timeout /t 3 >nul
) else (
    :: --- MODE LANCEMENT ---
    echo [OK] L'application est eteinte.
    echo.
    echo LANCEMENT EN COURS...
    echo.
    
    :: Attendre un peu que les ports soient libérés (TCP TIME_WAIT)
    timeout /t 2 >nul

    :: Lance le script PowerShell en arrière-plan (ne pas attendre)
    start powershell -ExecutionPolicy Bypass -File "run.ps1"

    echo.
    echo ✅ APPLICATION LANCEE !
    echo Le navigateur va s'ouvrir automatiquement.
    echo.
    echo Cette fenetre va se fermer toute seule...
    timeout /t 5 >nul
)

exit
