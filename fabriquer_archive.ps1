# =====================================================================
#  Gestion Articles - fabrication de l'archive de distribution
#  Produit  ..\GestionArticles-v2.0.zip  (a copier sur cle USB)
#  Lancement :  powershell -ExecutionPolicy Bypass -File fabriquer_archive.ps1
# =====================================================================
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$name = 'GestionArticles'
$out  = Join-Path (Split-Path -Parent $root) "$name-v2.0.zip"

$keep = @(
    'app', 'Model', 'tests', 'tools', 'wheels',
    'run.bat', 'serve.py', 'requirements.txt',
    'source_listes.xlsx', 'LISEZ-MOI.txt', 'README.md', 'CONTEXTE.md'
)

$stage = Join-Path $env:TEMP ("ga-pack-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null

try {
    foreach ($item in $keep) {
        $source = Join-Path $root $item
        if (-not (Test-Path -LiteralPath $source)) {
            throw "Introuvable : $source"
        }
        Copy-Item -LiteralPath $source -Destination $stage -Recurse -Force
    }

    # Exclusions : donnees personnelles, caches, bases de test.
    Get-ChildItem -LiteralPath $stage -Directory -Recurse |
        Where-Object { $_.Name -eq '__pycache__' } |
        Remove-Item -Recurse -Force
    Get-ChildItem -LiteralPath $stage -File -Recurse |
        Where-Object {
            $_.Name -like 'web_app.db*' -or
            $_.Name -like 'web_app-backup-*' -or
            $_.Name -eq '.session.key' -or
            $_.Name -like '*.pyc' -or
            $_.Name -like '*.pyo'
        } |
        Remove-Item -Force
    foreach ($dir in @('uploads', 'documents_pdf', '.git', '.venv', 'venv')) {
        $target = Join-Path $stage $dir
        if (Test-Path -LiteralPath $target) {
            Remove-Item -LiteralPath $target -Recurse -Force
        }
    }

    if (Test-Path -LiteralPath $out) { Remove-Item -LiteralPath $out -Force }
    Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $out -Force

    $zip = Get-Item -LiteralPath $out
    $files = [System.IO.Compression.ZipFile]::OpenRead($out).Entries.Count
    Write-Host ("Archive : {0}" -f $out)
    Write-Host ("Taille  : {0:N1} Mo - {1} fichiers" -f ($zip.Length / 1MB), $files)
}
finally {
    if (Test-Path -LiteralPath $stage) {
        Remove-Item -LiteralPath $stage -Recurse -Force
    }
}
