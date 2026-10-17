# 📦 Guide de Déploiement - Calculateur de Paie Algérienne

## 🎯 Pour un autre utilisateur / PC

Partagez ces fichiers:
```
payroll-web-app/
├── INSTALL.ps1          ← Exécutez ça en premier
├── run.ps1              ← Puis ça pour lancer l'app
├── CHECK.ps1            ← Pour diagnostiquer les problèmes
├── README.md            ← Documentation
├── requirements.txt
├── backend/
│   ├── app.py
│   ├── calculator.py
│   ├── pdf_extractor.py
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 👥 Installation sur un autre PC

### Étape 1: Prérequis
L'utilisateur doit installer:
- **Python 3.8+** : https://www.python.org (**✓ Cocher "Add to PATH"**)
- **Node.js 18+** : https://nodejs.org

### Étape 2: Installation automatique
1. Décompressez le dossier `payroll-web-app`
2. Double-cliquez sur `INSTALL.ps1`
   - Si erreur "ne peut pas exécuter les scripts":
     - Clic droit sur PowerShell → "Exécuter en tant qu'administrateur"
     - Tapez: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
     - Répondez `Y`
3. Attendez la fin (message "✓ Installation réussie")

### Étape 3: Lancer l'application
Double-cliquez sur `run.ps1`
- L'application s'ouvre automatiquement sur http://localhost:5173

---

## 🔧 Vérifier l'installation

Exécutez: `CHECK.ps1`
- Affiche le statut de toutes les dépendances
- Identifie les problèmes rapidement

---

## 🐛 Dépannage

### Problème: "Python n'est pas reconnu"
```powershell
# Solution: Installer Python avec "Add to PATH"
# https://www.python.org
# ✓ Cochez: "Add Python 3.x to PATH"
# Redémarrez PowerShell
```

### Problème: "Erreur lors du calcul PDF"
```powershell
# Solution: Réinstaller proprement
.\INSTALL.ps1
# Attendez la fin complète
```

### Problème: "Port 5000 déjà utilisé"
```powershell
# Solution: Arrêter le processus
taskkill /IM python.exe /F
# Puis relancer
.\run.ps1
```

### Problème: "Access Denied / Permission denied"
```powershell
# Solution: Exécuter en administrateur
# Clic droit PowerShell → "Exécuter en tant qu'administrateur"
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# Puis relancer INSTALL.ps1
```

---

## 📋 Structure des dépendances

### Backend (Python)
- **Flask 3.0** : Serveur web
- **Flask-CORS 4.0** : Soutien des requêtes cross-origin
- **Pandas 2.1** : Traitement des données Excel
- **openpyxl 3.1** : Lecture Excel
- **pdfplumber 0.11** : Extraction PDF
- **Werkzeug 3.0** : Utilitaires Flask

### Frontend (Node.js)
- **React 18** : Framework UI
- **Vite** : Build tool moderne
- **Tailwind CSS** : Styling
- **Framer Motion** : Animations

---

## 📈 Améliorations apportées pour la compatibilité

✅ Script d'installation automatique robuste  
✅ Vérification des prérequis (Python, Node.js)  
✅ Gestion améliorée des erreurs  
✅ Route `/api/diagnose` pour diagnostic  
✅ Script `CHECK.ps1` de vérification rapide  
✅ Documentation détaillée des problèmes courants  
✅ Normalisation automatique des colonnes Excel/PDF  
✅ Réinstallation des dépendances à chaque lancement  

---

## 💡 Points importants

1. **Python DOIT être dans le PATH**
   - Pendant l'installation: ✓ Cochez "Add Python to PATH"
   - Sinon: Réinstallez Python avec cette option

2. **Node.js doit aussi être dans le PATH**
   - Acceptez tous les paramètres par défaut
   - Redémarrez PowerShell après installation

3. **Les ports 5000 et 5173 doivent être libres**
   - Si occupés: Arrêtez les autres applications
   - Ou terminez avec `taskkill /IM python.exe /F` et `taskkill /IM node.exe /F`

4. **Première fois = plus lente**
   - `INSTALL.ps1` : 1-2 minutes la première fois
   - `run.ps1` : quelques secondes après

---

## 🆘 Support

Si l'application ne fonctionne toujours pas:

1. Exécutez `CHECK.ps1` → prenez une capture d'écran
2. Vérifiez que Python et Node.js sont dans le PATH:
   ```powershell
   python --version
   node --version
   npm --version
   ```
3. Si des dépendances manquent:
   ```powershell
   cd backend
   .\venv\Scripts\pip install --upgrade pip
   .\venv\Scripts\pip install -r requirements.txt
   cd ..
   ```
4. Redémarrez complètement le PC
5. Relancez `INSTALL.ps1` en tant qu'administrateur

---

**Version:** v6.2-web  
**Dernière mise à jour:** 2026-04-20  
**Auteur:** H.FERDJANI
