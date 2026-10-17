#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📄 Extracteur PDF pour Centralisateur de Paie
Utilise pdfplumber pour une extraction précise des tableaux
"""
import pandas as pd
import re

def extract_pdf_data(file_stream):
    """
    Extrait les données d'un PDF de centralisateur de paie.
    Retourne un DataFrame avec les colonnes: CODE, LIBELLE, N/BASE, GAIN, RETENUE, EFF
    """
    try:
        import pdfplumber
    except ImportError:
        raise ImportError("pdfplumber non installé. Exécutez: pip install pdfplumber")

    all_rows = []

    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            # Essayer d'abord avec les lignes visibles
            tables = page.extract_tables({
                "vertical_strategy": "lines",
                "horizontal_strategy": "lines",
                "snap_tolerance": 3,
                "join_tolerance": 3,
            })

            # Si pas de tableaux, essayer avec le texte
            if not tables:
                tables = page.extract_tables({
                    "vertical_strategy": "text",
                    "horizontal_strategy": "text",
                })

            for table in tables:
                if not table or len(table) < 2:
                    continue

                # Chercher l'en-tête
                header_idx = -1
                for idx, row in enumerate(table):
                    if row and any('CODE' in str(cell).upper() for cell in row if cell):
                        header_idx = idx
                        break

                if header_idx >= 0:
                    header = table[header_idx]

                    # Mapping des colonnes
                    col_map = {}
                    for j, cell in enumerate(header):
                        if cell:
                            cell_str = str(cell).upper().strip()
                            if 'CODE' in cell_str:
                                col_map['CODE'] = j
                            elif 'LIBELLE' in cell_str:
                                col_map['LIBELLE'] = j
                            elif 'N/BASE' in cell_str or 'BASE' in cell_str:
                                col_map['N/BASE'] = j
                            elif 'GAIN' in cell_str:
                                col_map['GAIN'] = j
                            elif 'RETENUE' in cell_str:
                                col_map['RETENUE'] = j
                            elif 'EFF' in cell_str:
                                col_map['EFF'] = j

                    # Extraire les données
                    for row in table[header_idx+1:]:
                        if not row:
                            continue

                        code_idx = col_map.get('CODE', -1)
                        if code_idx >= 0 and code_idx < len(row):
                            code = str(row[code_idx]).strip() if row[code_idx] else ''

                            if code and re.match(r'^(R|M|T)\d{3}$', code):
                                libelle = str(row[col_map.get('LIBELLE', 1)]).strip() if col_map.get('LIBELLE', 1) < len(row) else ''
                                nbase = str(row[col_map.get('N/BASE', 2)]).strip() if col_map.get('N/BASE', 2) < len(row) else ''
                                gain = str(row[col_map.get('GAIN', 3)]).strip() if col_map.get('GAIN', 3) < len(row) else ''
                                retenue = str(row[col_map.get('RETENUE', 4)]).strip() if col_map.get('RETENUE', 4) < len(row) else ''
                                eff = str(row[col_map.get('EFF', 5)]).strip() if col_map.get('EFF', 5) < len(row) else ''

                                all_rows.append({
                                    'CODE': code,
                                    'LIBELLE': libelle,
                                    'N/BASE': nbase,
                                    'GAIN': gain,
                                    'RETENUE': retenue,
                                    'EFF': eff
                                })

    if not all_rows:
        raise ValueError("Aucune donnée trouvée dans le PDF. Vérifiez que le fichier contient un tableau avec les colonnes CODE, GAIN, RETENUE.")

    df = pd.DataFrame(all_rows)

    # Nettoyer les montants
    def clean_amount(val):
        if pd.isna(val) or str(val).strip() in ('', '0', 'nan', 'None'): 
            return 0.0
        s = str(val).replace(' ', '').replace('\xa0', '')
        if ',' in s and '.' in s: 
            s = s.replace(',', '') if s.index(',') < s.index('.') else s.replace('.', '').replace(',', '.')
        elif s.count(',') > 1: 
            s = s.replace(',', '')
        elif ',' in s: 
            s = s.replace(',', '.')
        try: 
            return float(s)
        except: 
            return 0.0

    for col in ['N/BASE', 'GAIN', 'RETENUE']:
        if col in df.columns:
            df[col] = df[col].apply(clean_amount)

    return df
