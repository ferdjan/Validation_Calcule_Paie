# 💰 Calculateur de Paie Algérienne — Version Web v6.2

Application web moderne pour le calcul de paie selon la législation algérienne.

## ✨ Nouveautés

- **Interface Web Moderne** : React + Tailwind CSS avec animations Framer Motion
- **Support Excel & PDF** : Importez vos centralisateurs dans les deux formats
- **Design Responsive** : Adapté desktop, tablette et mobile
- **Thème Clair/Sombre** : Basculable avec persistance localStorage
- **Upload Drag & Drop** : Import intuitif pour Excel et PDF
- **Visualisations** : Cartes métriques avec gradients et animations
- **Export CSV** : Téléchargement des résultats de validation

## 🏗️ Architecture

```
payroll-web-app/
├── backend/           # API Flask Python
│   ├── app.py        # Routes API (support Excel + PDF)
│   ├── calculator.py # Logique métier (identique v6.2)
│   ├── pdf_extractor.py # Extraction des tableaux PDF
│   └── requirements.txt
└── frontend/         # Application React
    ├── src/
    │   ├── components/   # Composants React
    │   ├── context/      # Contextes (Theme, Calculator)
    │   ├── App.jsx       # Routeur
    │   └── main.jsx      # Point d'entrée
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Installation rapide (Windows)

### Option 1 : Installation automatique (recommandée)
```powershell
1. Double-cliquez sur: INSTALL.ps1
   (Si erreur d'exécution, clic droit → "Exécuter avec PowerShell")
2. Attendez la fin du processus
3. Double-cliquez sur: run.ps1
```

### Option 2 : Démarrage simple
```powershell
Double-cliquez sur: run.ps1
```

---

## 📋 Prérequis

### Windows
- **Python 3.8+** : https://www.python.org
  - ✓ Cochez "Add Python to PATH" pendant l'installation
  - Vérifiez : Ouvrez PowerShell et tapez `python --version`
  
- **Node.js 18+** : https://nodejs.org
  - Acceptez tous les paramètres par défaut
  - Vérifiez : Ouvrez PowerShell et tapez `node --version`

### Installation manuelle (détaillée)

#### 1. Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
Serveur sur : `http://localhost:5000`

#### 2. Frontend (nouveau terminal)
```bash
cd frontend
npm install
npm run dev
```
Application sur : `http://localhost:5173`

## 📊 Fonctionnalités

### Formats supportés
- **Excel** : `.xlsx`, `.xls` — Fichier centralisateur classique
- **PDF** : `.pdf` — Centralisateur exporté depuis votre logiciel de paie

### Calculs préservés (identiques à la version desktop v6.2)
- **R500** : Salaire de Poste
- **BRUT** : Salaire Brut (R500 + Panier/Transport)
- **Base IRG** : Base imposable
- **R642** : Base IRG 10%
- **R646** : Retenue IRG 10%
- **R770** : Net à Payer
- **Charges** : Œuvres sociales (formule complète)
- **CNAS** : RG (34,5%), FNPOS (0,5%), Total (35%)
- **G50** : Déclaration IRG

## 🎨 Design System

### Couleurs
- **Primary** : Bleu cyan `#0EA5E9`
- **Accent** : Violet `#8B5CF6`
- **Success** : Émeraude `#10B981`
- **Warning** : Ambre `#F59E0B`
- **Danger** : Rose `#F43F5E`

### Thèmes
- **Sombre** : Fond `#0B0F1C`, panels `#1E293B`
- **Clair** : Fond `#F8FAFC`, panels `#FFFFFF`

## 📝 Notes

### Format Excel
- Le fichier doit contenir les colonnes : `CODE`, `GAIN`, `RETENUE`
- Les codes rubriques doivent être en majuscules
- Formats supportés : `.xlsx`, `.xls`

### Format PDF
- Le PDF doit contenir un tableau structuré
- Colonnes requises : `CODE`, `LIBELLE`, `N/BASE`, `GAIN`, `RETENUE`, `EFF`
- Compatible avec les centralisateurs exportés depuis la plupart des logiciels de paie algériens

## 👤 Auteur

**H.FERDJANI** — Version V1

---

## 🛠️ Dépannage

### ❌ "Python n'est pas reconnu"
**Solution:**
1. Installez Python depuis https://www.python.org
2. ✓ Cochez **"Add Python to PATH"**
3. Redémarrez PowerShell/CMD
4. Vérifiez : `python --version`

### ❌ "Node.js n'est pas reconnu"
**Solution:**
1. Installez Node.js depuis https://nodejs.org
2. Redémarrez PowerShell/CMD
3. Vérifiez : `node --version`

### ❌ "Erreur lors du calcul PDF/Excel"
**Solution:**
1. Exécutez: `INSTALL.ps1` (réinstallation propre)
2. Attendez la fin complète
3. Relancez: `run.ps1`

### ❌ "Le port 5000 est déjà utilisé"
**Solution:**
```powershell
# Trouvez le processus
netstat -ano | findstr :5000

# Terminez-le (remplacez PID par le numéro)
taskkill /PID <numéro> /F

# Relancez l'app
.\run.ps1
```

### ❌ "Le port 5173 est déjà utilisé"
**Solution:**
```powershell
# Fermez toutes les instances npm
taskkill /IM node.exe /F

# Relancez l'app
.\run.ps1
```

### ❌ "Erreur de permissions (Access Denied)"
**Solution:**
1. Clic droit sur PowerShell → "Exécuter en tant qu'administrateur"
2. Exécutez: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
3. Relancez: `INSTALL.ps1` puis `run.ps1`

### ❌ "pip install échoue - dépendances bloquées"
**Solution:**
```powershell
cd backend
Remove-Item -Path venv -Recurse -Force
python -m venv venv
.\venv\Scripts\pip install --upgrade pip
.\venv\Scripts\pip install -r requirements.txt
```

---

## 📞 Support

Si l'application ne fonctionne toujours pas:
1. Exécutez `INSTALL.ps1` complètement
2. Vérifiez que Python et Node.js sont installés
3. Vérifiez les ports 5000 et 5173 ne sont pas utilisés
4. Consultez les logs dans la console de PowerShell
