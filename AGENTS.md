# AGENTS.md

Instructions pour les agents travaillant sur ce dépôt.

## Projet

Calculateur de paie algérienne v6.2 — application web locale (Windows) :

- `backend/` : API Flask (Python 3.11), port **5000** — `app.py` (routes), `calculator.py` (logique métier), `pdf_extractor.py` (extraction PDF via pdfplumber)
- `frontend/` : React 18 + Vite + Tailwind CSS, port **5173** — `src/context/CalculatorContext.jsx` appelle l'API sur `http://localhost:5000/api`

## Règles importantes

- **Ne jamais modifier les formules de calcul** dans `backend/calculator.py` (R500, BRUT, Base_IRG, R642, R646, R770, CNAS, G50, œuvres sociales) ni le mapping `CATEGORIES` : la logique doit rester identique à la version desktop v6.2.
- UI, messages d'erreur et commentaires en **français**.
- Python **3.11 obligatoire** (dépendances épinglées dans `backend/requirements.txt`, pandas 2.1.4 incompatible avec Python 3.12+). Utiliser `py -3.11`.
- Ne jamais committer : `backend/venv/`, `frontend/node_modules/`, fichiers de paie (`*.xlsx`, `*.xls`, `*.pdf`), `pour installation/` (voir `.gitignore`).

## Commandes

```powershell
# Lancer l'application complète (backend + frontend + navigateur)
.\run.ps1

# Backend seul (depuis backend/)
.\venv\Scripts\python.exe app.py

# Frontend seul (depuis frontend/)
npm run dev

# Vérification de l'environnement
.\CHECK.ps1        # diagnostic dépendances + ports
.\INSTALL.ps1      # réinstallation propre (recrée le venv)

# Build frontend (depuis frontend/)
npm run build
```

## Vérification d'un changement (obligatoire)

```powershell
# 1. Santé du backend
Invoke-RestMethod http://localhost:5000/api/health
# → {"status":"ok","version":"6.2-web","formats":["xlsx","xls","pdf"]}

# 2. Test de bout en bout avec un fichier réel (multipart)
curl.exe -s -X POST http://localhost:5000/api/calculate -F "file=@chemin\vers\fichier.pdf"
# → JSON avec success:true et data.calculations
```

- Il n'y a pas de linter ni de suite de tests automatisée. `backend/test_calcul.py` est un script manuel qui attend un fichier `annuel.xlsx` et n'est pas exécutable tel quel dans ce dépôt — ne pas s'y fier.
- Toujours tester un upload réel (PDF **et** Excel) après une modification du backend ou du flux d'upload.

## Dépannage connu

- **« Erreur lors du calcul »** s'affiche à l'upload quand l'API est injoignable (backend arrêté ou venv cassé, `frontend/src/context/CalculatorContext.jsx:90`). Vérifier `http://localhost:5000/api/health` ; `run.ps1` recrée automatiquement un venv invalide.
- Le frontend (Vite) peut rester actif même si le backend est mort — vérifier `netstat -ano | findstr ":5000"`.
