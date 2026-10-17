#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
💰 Calculateur de Paie Algérienne - Module Métier
Logique identique à la version desktop v6.2
"""
import pandas as pd
import io
import base64
from typing import Dict, Any

# ──────────────────────────────────────────────────────────────────────
# 📚 LOGIQUE MÉTIER (Identique à v6.2)
# ──────────────────────────────────────────────────────────────────────
CATEGORIES = {
    1: ['R030','R031','R035','R040','R045','R046','R047','R056','R062','R067','R100','R101','R108','R112','R113','R117','R122','R123','R130','R131','R253','R258','R259','R260','R261','R262','R265','R266','R271','R272','R276','R277','R281','R282','R288','R289','R290','R291','R292','R294','R295','R296','R297','R298','R299','R300','R308','R310','R318','R319','R321','R323','R324','R325','R327','R331','R332','R335','R337','R356','R357','R361','R362','R380','R401','R402','R405','R406','R409','R410','R413','R414','R417','R418','R421','R422','R425','R426','M380','R433','R434','R437','R438','R441','R442','R445','R446','R449','R450','R453','R454','R032','R034','R036','R061','R063','R066','R068','R102','R114','R124','R263','R267','R273','R278','R283','R287','R293','R304','R309','R320','R328','R333','R336','R338','R340','R342','R358','R363','R403','R407','R411','R415','R419','R423','R427','R435','R439','R443','R447','R451','R455','T380'],
    2: ['R305','R306','R307','R315','R460','R461','R751','R302','R303','R462'],
    3: ['R104','R105','R429','R430','R494','M494','R106','R431','T494'],
    4: ['R521','R532','R533','R542','R543','R552','R504','R520','R522','R534','R544','R551','R555'],
    5: ['R038','R042','R050','R345','R351','R352','R370','R470','R471','R472','R480','R481','R482','R483','R484','R511','R515','R528','R535','R537','R538','R571','R581','R583','R601','R661','R672','R673','R692','R693','R699','R700','R701','R703','R714','R715','R726','R793','M797','R037','R039','R044','R312','R313','R353','R510','R512','R516','R524','R525','R526','R527','R529','R530','R539','R546','R548','R553','R570','R580','R582','R600','R602','R646','R660','R662','R670','R671','R702','R716','R720','R724','R725','R789','R792','R794','R795','R796','R797','R798','R799','T797','T798']
}

class PayrollCalculator:
    def __init__(self, df_central: pd.DataFrame):
        self.df_central = df_central.copy()
        self.data = {}
        self._prepare()

    def _clean_amount(self, val) -> float:
        if pd.isna(val) or str(val).strip() in ('', '0', 'nan'): 
            return 0.0
        s = str(val).replace(' ', '').replace(' ', '')
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

    def _normalize(self, text: str) -> str: 
        return str(text).strip().upper()

    def _prepare(self):
        self.df_central.columns = [self._normalize(c) for c in self.df_central.columns]
        for _, row in self.df_central.iterrows():
            code = self._normalize(row.get('CODE', ''))
            if code and code != 'NAN' and len(code) >= 3:
                self.data[code] = {
                    'gain': self._clean_amount(row.get('GAIN')), 
                    'retenue': self._clean_amount(row.get('RETENUE'))
                }

    def _sum_category(self, cat_id: int) -> dict:
        gains = sum(self.data.get(c, {}).get('gain', 0.0) for c in CATEGORIES.get(cat_id, []))
        retenues = sum(self.data.get(c, {}).get('retenue', 0.0) for c in CATEGORIES.get(cat_id, []))
        return {'gains': gains, 'retenues': retenues, 'net': gains - retenues}

    def calculate_all(self) -> dict:
        c1, c2, c3, c4, c5 = [self._sum_category(i) for i in range(1, 6)]
        r500 = round((c1['gains'] + c2['gains'] + c3['gains']) - (c1['retenues'] + c2['retenues'] + c3['retenues']), 2)
        pt_g = sum(self.data.get(c, {}).get('gain', 0.0) for c in ['R532','R533','R542','R543'])
        pt_r = sum(self.data.get(c, {}).get('retenue', 0.0) for c in ['R534','R544'])
        pt_net = round(pt_g - pt_r, 2)
        brut = round(r500 + pt_net, 2)
        base_irg = round(((r500 - c3['net'] - c2['net']) * 0.91) + c4['net'], 2)
        r642 = round(c2['net'] * 0.91, 2)
        r646 = round(r642 * 0.10, 2)
        r770 = round(r500 + c4['net'] + c5['net'], 2)
        oeuvres_sociales = round(((r500 * 0.01) + (brut * 0.02)) * (2 / 3), 2)

        return {
            'R500': r500, 
            'BRUT': brut, 
            'Base_IRG': base_irg, 
            'R642': r642, 
            'R646': r646, 
            'R770': r770,
            'OeuvresSociales': oeuvres_sociales, 
            'PanierTransport': {'net': pt_net},
            'CNAS': {
                'RG': round(r500 * 0.345, 2), 
                'FNPOS': round(r500 * 0.005, 2), 
                'Total': round(r500 * 0.35, 2)
            },
            'G50': {
                'Base_IRG': base_irg, 
                'R660_Excel': self.data.get('R660', {}).get('retenue', 0.0), 
                'R646': r646, 
                'Total_IRG': round(self.data.get('R660', {}).get('retenue', 0.0) + r646, 2)
            },
            'debug': {'Cat1': c1, 'Cat2': c2, 'Cat3': c3, 'Cat4': c4, 'Cat5': c5}
        }

    def get_validation_df(self) -> pd.DataFrame:
        calc = self.calculate_all()
        df = self.df_central.copy()
        df['CODE'] = df['CODE'].astype(str).str.strip().str.upper()

        def get_target(code: str, col: str) -> float:
            mask = df['CODE'] == code
            if mask.any() and col in df.columns:
                val = df[mask].iloc[0][col]
                if pd.notna(val):
                    return self._clean_amount(val)
            return 0.0

        # Mapping des clés de calcul vers les noms dans le fichier Excel
        # Utiliser 'GAIN' ou 'RETENUE' puisque 'N/BASE' n'existe pas toujours
        targets = {
            'R500': get_target('R500', 'GAIN') or get_target('R500', 'N/BASE'),
            'BRUT': (get_target('R500', 'GAIN') or get_target('R500', 'N/BASE')) + (get_target('R532','GAIN')+get_target('R533','GAIN')+get_target('R542','GAIN')+get_target('R543','GAIN')) - (get_target('R534','RETENUE')+get_target('R544','RETENUE')),
            'Base_IRG': get_target('R660', 'GAIN') or get_target('R660', 'N/BASE'),
            'R642': get_target('R646', 'GAIN') or get_target('R646', 'N/BASE'),
            'R646': get_target('R646', 'RETENUE'),
            'R770': get_target('R770', 'RETENUE')
        }

        rows = []
        for key in ['R500', 'BRUT', 'Base_IRG', 'R642', 'R646', 'R770']:
            diff = round(abs(calc[key] - targets[key]), 2)
            rows.append({
                'Rubrique': key, 
                'Calculé': f"{calc[key]:,.2f}", 
                'Excel': f"{targets[key]:,.2f}" if key != 'BRUT' else "∑ R500 + PT",
                'Écart': diff, 
                'Statut': '✅ Conforme' if diff <= 0.02 else f'⚠️ Écart: {diff:,.2f}'
            })
        return pd.DataFrame(rows)

    def to_dict(self):
        """Retourne tous les résultats en format dict sérialisable"""
        calc = self.calculate_all()
        validation = self.get_validation_df()
        return {
            'calculations': calc,
            'validation': validation.to_dict('records')
        }
