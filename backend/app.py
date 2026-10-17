#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
💰 Calculateur de Paie Algérienne - API Backend
Flask + CORS + Pandas
Supporte Excel (.xlsx, .xls) et PDF (.pdf)
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd
import io
import os
import sys
from datetime import datetime

# Vérification des dépendances critiques
try:
    from calculator import PayrollCalculator
except ImportError as e:
    print(f"❌ ERREUR: Module calculator non trouvé: {e}", file=sys.stderr)
    sys.exit(1)

try:
    from pdf_extractor import extract_pdf_data
except ImportError as e:
    print(f"❌ ERREUR: Module pdf_extractor non trouvé: {e}", file=sys.stderr)
    sys.exit(1)

try:
    import pdfplumber
except ImportError:
    print("⚠️  AVERTISSEMENT: pdfplumber non installé. Les uploads PDF ne fonctionneront pas.", file=sys.stderr)
    print("   Installez avec: pip install pdfplumber", file=sys.stderr)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"], supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'pdf'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "version": "6.2-web", "formats": ["xlsx", "xls", "pdf"]})

@app.route('/api/diagnose', methods=['GET'])
def diagnose():
    """Diagnostic des dépendances et configuration"""
    diagnostics = {
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "dependencies": {}
    }
    
    # Vérifier pandas
    try:
        import pandas
        diagnostics["dependencies"]["pandas"] = {"installed": True, "version": pandas.__version__}
    except ImportError:
        diagnostics["dependencies"]["pandas"] = {"installed": False, "error": "Pas installé"}
    
    # Vérifier pdfplumber
    try:
        import pdfplumber
        diagnostics["dependencies"]["pdfplumber"] = {"installed": True, "version": pdfplumber.__version__}
    except ImportError:
        diagnostics["dependencies"]["pdfplumber"] = {"installed": False, "error": "Pas installé"}
    
    # Vérifier openpyxl
    try:
        import openpyxl
        diagnostics["dependencies"]["openpyxl"] = {"installed": True, "version": openpyxl.__version__}
    except ImportError:
        diagnostics["dependencies"]["openpyxl"] = {"installed": False, "error": "Pas installé"}
    
    # Vérifier flask
    try:
        from flask import __version__ as flask_version
        diagnostics["dependencies"]["flask"] = {"installed": True, "version": flask_version}
    except ImportError:
        diagnostics["dependencies"]["flask"] = {"installed": False, "error": "Pas installé"}
    
    # Vérifier flask-cors
    try:
        from flask_cors import __version__ as cors_version
        diagnostics["dependencies"]["flask-cors"] = {"installed": True, "version": cors_version}
    except ImportError:
        diagnostics["dependencies"]["flask-cors"] = {"installed": False, "error": "Pas installé"}
    
    # Vérifier les dossiers
    diagnostics["folders"] = {
        "uploads": os.path.exists("uploads")
    }
    
    return jsonify(diagnostics)

@app.route('/api/calculate', methods=['POST'])
def calculate_payroll():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nom de fichier vide"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Format non supporté. Utilisez .xlsx, .xls ou .pdf"}), 400

    try:
        file_ext = file.filename.rsplit('.', 1)[1].lower()

        # Lecture selon le format
        if file_ext == 'pdf':
            df = extract_pdf_data(file.stream)
        else:
            df = pd.read_excel(file.stream)

        # Vérifier que le DataFrame n'est pas vide
        if df.empty:
            return jsonify({"error": "Aucune donnée trouvée dans le fichier"}), 400

        # Normaliser les colonnes (majuscules et sans espaces)
        df.columns = df.columns.str.strip().str.upper()

        # Vérifier les colonnes requises
        required_cols = ['CODE', 'GAIN', 'RETENUE']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Colonnes manquantes: {', '.join(missing_cols)}. Colonnes disponibles: {list(df.columns)}"}), 400

        # Calcul
        calculator = PayrollCalculator(df)
        results = calculator.to_dict()

        # Stockage temporaire pour export CSV
        session_id = datetime.now().strftime('%Y%m%d_%H%M%S')

        return jsonify({
            "success": True,
            "session_id": session_id,
            "format": file_ext,
            "rows_processed": len(df),
            "data": results
        })

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ ERREUR lors du calcul: {str(e)}", file=sys.stderr)
        print(error_trace, file=sys.stderr)
        
        # Retourner un message d'erreur détaillé
        error_msg = str(e)
        if "pdfplumber" in error_msg.lower() or "pdf" in error_msg.lower():
            error_msg = f"Erreur PDF: {error_msg}. Vérifiez que pdfplumber est installé."
        elif "openpyxl" in error_msg.lower() or "excel" in error_msg.lower():
            error_msg = f"Erreur Excel: {error_msg}. Vérifiez que openpyxl est installé."
        
        return jsonify({"error": error_msg, "details": str(e)}), 500

@app.route('/api/export-csv', methods=['POST'])
def export_csv():
    try:
        data = request.json
        validation_data = data.get('validation', [])

        df = pd.DataFrame(validation_data)

        # Création du fichier CSV en mémoire
        output = io.StringIO()
        df.to_csv(output, index=False, encoding='utf-8-sig')
        output.seek(0)

        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8-sig')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"paie_validation_{datetime.now().strftime('%Y%m%d')}.csv"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/export-pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.json
        results = data.get('results', {})

        from io import BytesIO
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                               rightMargin=2*cm, leftMargin=2*cm,
                               topMargin=2*cm, bottomMargin=2*cm)

        elements = []
        styles = getSampleStyleSheet()

        # Titre
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#3B82F6'),
            spaceAfter=30,
            alignment=1  # Center
        )
        elements.append(Paragraph("Déclarations Sociales & Fiscales", title_style))
        elements.append(Paragraph(f"<para alignment='center' fontSize='10' textColor='#666666'>Généré le: {datetime.now().strftime('%d/%m/%Y')}</para>", styles['Normal']))
        elements.append(Spacer(1, 20))

        # CNAS
        elements.append(Paragraph("<b>Déclaration CNAS</b>", styles['Heading2']))
        cnas_data = [
            ['Rubrique', 'Taux', 'Montant (DA)'],
            ['Régime Général', '34,5%', f"{results.get('CNAS', {}).get('RG', 0):,.2f}"],
            ['FNPOS', '0,5%', f"{results.get('CNAS', {}).get('FNPOS', 0):,.2f}"],
            ['TOTAL CNAS', '', f"{results.get('CNAS', {}).get('Total', 0):,.2f}"],
        ]
        cnas_table = Table(cnas_data, colWidths=[8*cm, 4*cm, 6*cm])
        cnas_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#F8FAFC')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#DBEAFE')),
        ]))
        elements.append(cnas_table)
        elements.append(Spacer(1, 20))

        # G50
        elements.append(Paragraph("<b>Déclaration IRG (G50)</b>", styles['Heading2']))
        g50_data = [
            ['Rubrique', 'Base/Montant', 'Valeur (DA)'],
            ['Assiette progressive', 'Base_IRG', f"{results.get('G50', {}).get('Base_IRG', 0):,.2f}"],
            ['Assiette IRG 10%', 'R642', f"{results.get('R642', 0):,.2f}"],
            ['Retenue R660 (Excel)', 'IRG progressif', f"{results.get('G50', {}).get('R660_Excel', 0):,.2f}"],
            ['Retenue 10% (R646)', 'IRG forfaitaire', f"{results.get('G50', {}).get('R646', 0):,.2f}"],
            ['TOTAL IRG G50', '', f"{results.get('G50', {}).get('Total_IRG', 0):,.2f}"],
        ]
        g50_table = Table(g50_data, colWidths=[8*cm, 4*cm, 6*cm])
        g50_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#FAF5FF')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#F3E8FF')),
        ]))
        elements.append(g50_table)
        elements.append(Spacer(1, 20))

        # Oeuvres Sociales
        elements.append(Paragraph("<b>Montant des œuvres sociales</b>", styles['Heading2']))
        os_data = [
            ['Description', 'Montant (DA)'],
            ['((1% R500 + 2% Brut) × 2/3)', f"{results.get('OeuvresSociales', 0):,.2f}"],
        ]
        os_table = Table(os_data, colWidths=[12*cm, 6*cm])
        os_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F59E0B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFFBEB')),
        ]))
        elements.append(os_table)

        doc.build(elements)
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"declarations_{datetime.now().strftime('%Y%m%d')}.pdf"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
