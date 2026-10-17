#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 Script de test - Vérifie que le calcul fonctionne avec votre fichier
"""
import pandas as pd
import sys
from calculator import PayrollCalculator

# Test avec votre fichier
df = pd.read_excel('annuel.xlsx')
print(f"✅ Fichier chargé: {df.shape[0]} lignes, {df.shape[1]} colonnes")

calc = PayrollCalculator(df)
results = calc.calculate_all()
validation = calc.get_validation_df()

print("\n📊 RÉSULTATS:")
print("=" * 50)
for key in ['R500', 'BRUT', 'Base_IRG', 'R642', 'R646', 'R770']:
    print(f"{key:12s}: {results[key]:>15,.2f} DA")

print(f"\n{'Oeuvres Sociales':12s}: {results['OeuvresSociales']:>15,.2f} DA")

print("\n📋 VALIDATION:")
print("=" * 50)
print(validation.to_string(index=False))

print("\n✅ Test terminé avec succès !")
