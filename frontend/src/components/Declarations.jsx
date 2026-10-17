import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  FileText, 
  ArrowLeft,
  Landmark,
  Receipt,
  TrendingUp,
  Calculator,
  HeartHandshake,
  Download
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'
import { useNavigate } from 'react-router-dom'

export default function Declarations() {
  const { isDark } = useTheme()
  const { results } = useCalculator()
  const navigate = useNavigate()

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Landmark className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Aucune donnée de déclaration
        </h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Importez un fichier pour générer les déclarations sociales et fiscales.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Importer un fichier
        </button>
      </div>
    )
  }

  const { exportPDF } = useCalculator()
  const { CNAS, G50, R642, R646, OeuvresSociales } = results

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent-purple to-accent-blue" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Déclarations sociales & fiscales
          </h1>
        </motion.div>
        <div className="ml-5 flex items-center justify-between">
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            CNAS Patronale, IRG (G50) et charges sociales
          </p>
          <button
            onClick={async () => { await exportPDF() }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Exporter PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carte CNAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            rounded-2xl overflow-hidden border
            ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
          `}
        >
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-accent-blue to-accent-cyan p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Déclaration CNAS</h3>
                <p className="text-blue-100 text-sm">Caisse Nationale de Sécurité Sociale</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: 'Régime Général', badge: '34,5%', value: CNAS.RG, desc: 'Cotisation RG patronale' },
              { label: 'FNPOS', badge: '0,5%', value: CNAS.FNPOS, desc: 'Fonds National de Prévoyance Sociale' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`
                  flex items-center justify-between p-4 rounded-xl
                  ${isDark ? 'bg-dark-card' : 'bg-light-card'}
                `}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-lg font-mono
                      ${isDark ? 'bg-dark-panel text-gray-400' : 'bg-light-panel text-gray-500'}
                    `}>
                      {item.badge}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
                <p className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA
                </p>
              </motion.div>
            ))}

            {/* Total CNAS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent-blue/10 to-accent-cyan/10 border border-accent-blue/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-accent-blue" />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Total CNAS Patronale
                  </span>
                </div>
                <span className="text-2xl font-bold text-accent-blue">
                  {CNAS.Total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Carte G50 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            rounded-2xl overflow-hidden border
            ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
          `}
        >
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-accent-purple to-accent-purple/80 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Déclaration IRG (G50)</h3>
                <p className="text-purple-100 text-sm">Impôt sur le Revenu Global</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: 'Assiette progressive', badge: 'Base_IRG', value: G50.Base_IRG, color: 'text-accent-purple' },
              { label: 'Assiette IRG 10%', badge: 'R642', value: R642, color: 'text-accent-purple' },
              { label: 'Retenue R660 (Excel)', badge: 'IRG progressif', value: G50.R660_Excel, color: 'text-accent-amber' },
              { label: 'Retenue 10% (R646)', badge: 'IRG forfaitaire', value: G50.R646, color: 'text-accent-amber' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`
                  flex items-center justify-between p-4 rounded-xl
                  ${isDark ? 'bg-dark-card' : 'bg-light-card'}
                `}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-lg font-mono
                      ${isDark ? 'bg-dark-panel text-gray-400' : 'bg-light-panel text-gray-500'}
                    `}>
                      {item.badge}
                    </span>
                  </div>
                </div>
                <p className={`text-lg font-bold font-mono ${item.color}`}>
                  {typeof item.value === 'number' 
                    ? item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) 
                    : '0,00'} DA
                </p>
              </motion.div>
            ))}

            {/* Total IRG - Affiché sur 2 lignes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-6 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-purple/5 border border-accent-purple/20 text-center"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-accent-purple" />
                  <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Total IRG à déclarer (G50)
                  </span>
                </div>
                <span className="text-3xl font-bold text-accent-purple tracking-tight">
                  {G50.Total_IRG.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Carte Œuvres Sociales - Déplacée depuis Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`
          mt-8 rounded-2xl overflow-hidden border
          ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
        `}
      >
        <div className="bg-gradient-to-r from-accent-amber to-orange-500 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Montant des œuvres sociales</h3>
              <p className="text-amber-100 text-sm">Contribution patronale obligatoire</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <p className="text-2xl font-bold text-accent-amber">
              {OeuvresSociales?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || '0,00'} DA
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
