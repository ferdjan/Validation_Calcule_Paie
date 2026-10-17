import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Download,
  Shield,
  XCircle
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'
import { useNavigate } from 'react-router-dom'

// Mapping des codes vers noms lisibles
const RUBRIQUE_NAMES = {
  'R500': 'Salaire de Poste',
  'BRUT': 'Salaire Brut',
  'Base_IRG': 'Base IRG',
  'R642': 'Base IRG 10%',
  'R646': 'Retenue IRG 10%',
  'R770': 'Net à payer'
}

export default function Validation() {
  const { isDark } = useTheme()
  const { validation, exportCSV, results } = useCalculator()
  const navigate = useNavigate()

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Shield className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Aucune donnée de validation
        </h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Importez un fichier et lancez le calcul pour voir les résultats de validation.
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

  const allOk = validation && validation.every(row => row.Écart <= 0.02)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent-emerald to-accent-cyan" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tableau de validation
          </h1>
        </motion.div>
        <p className={`ml-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Comparaison entre les valeurs calculées et le centralisateur
        </p>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-2xl p-6 mb-8 border
          ${allOk 
            ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30' 
            : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30'
          }
        `}
      >
        <div className="flex items-center gap-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            ${allOk ? 'bg-emerald-500/20' : 'bg-amber-500/20'}
          `}>
            {allOk ? (
              <CheckCircle2 className="w-8 h-8 text-accent-emerald" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-accent-amber" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {allOk ? 'Tous les calculs sont conformes' : 'Des écarts ont été détectés'}
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {allOk 
                ? 'Les valeurs calculées correspondent au centralisateur.' 
                : 'Vérifiez les rubriques surlignées ci-dessous.'}
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Exporter CSV</span>
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`
          rounded-2xl overflow-hidden border
          ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
        `}
      >
        {/* Table Header */}
        <div className={`
          grid grid-cols-5 gap-4 p-4 border-b
          ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}
        `}>
          {['Rubrique', 'Calculé (DA)', 'Centralisateur', 'Écart', 'Statut'].map((header) => (
            <div key={header} className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {validation && validation.map((row, index) => {
            const isOk = row.Écart <= 0.02
            const displayName = RUBRIQUE_NAMES[row.Rubrique] || row.Rubrique
            return (
              <motion.div
                key={row.Rubrique}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  grid grid-cols-5 gap-4 p-4 items-center
                  ${!isOk ? (isDark ? 'bg-accent-rose/5' : 'bg-accent-rose/5') : ''}
                  hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                `}
              >
                <div className="font-medium text-accent-blue">
                  {displayName}
                  <span className={`block text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {row.Rubrique}
                  </span>
                </div>
                <div className={`font-mono text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {row.Calculé}
                </div>
                <div className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {row.Excel}
                </div>
                <div className={`font-mono text-sm font-medium ${isOk ? 'text-accent-emerald' : 'text-accent-rose'}`}>
                  {row.Écart.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2">
                  {isOk ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                      <span className="text-sm text-accent-emerald">Conforme</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-accent-rose" />
                      <span className="text-sm text-accent-rose">Écart</span>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { 
            label: 'Rubriques conformes', 
            value: validation?.filter(r => r.Écart <= 0.02).length || 0,
            total: validation?.length || 0,
            color: 'emerald',
            icon: CheckCircle2
          },
          { 
            label: 'Rubriques avec écart', 
            value: validation?.filter(r => r.Écart > 0.02).length || 0,
            total: validation?.length || 0,
            color: 'rose',
            icon: XCircle
          },
          { 
            label: 'Écart maximal', 
            value: validation ? Math.max(...validation.map(r => r.Écart)).toFixed(2) : '0.00',
            suffix: ' DA',
            color: 'amber',
            icon: AlertTriangle
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`
              rounded-2xl p-6 border
              ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
            `}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-accent-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-accent-${stat.color}`} />
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}{stat.suffix || ` / ${stat.total}`}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
