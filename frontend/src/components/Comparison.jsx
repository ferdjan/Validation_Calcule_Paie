import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Calendar, Trash2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'

export default function Comparison() {
  const { isDark } = useTheme()
  const { history, clearHistory } = useCalculator()

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Calendar className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Aucun historique
        </h2>
        <p className={`text-center max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Importez plusieurs fichiers (mois différents) pour comparer l'évolution de la paie.
        </p>
      </div>
    )
  }

  // Préparer les données pour le graphique (tri chronologique + label affichable)
  const chartData = [...history]
    .sort((a, b) => a.month.localeCompare(b.month)) // Tri: 2026-01, 2026-02...
    .map(h => ({
      month: h.monthLabel || h.month, // "01/2026" pour affichage
      sortKey: h.month,               // "2026-01" pour le tri
      R500: h.results.R500,
      BRUT: h.results.BRUT,
      Base_IRG: h.results.Base_IRG,
      R770: h.results.R770,
      CNAS_Total: h.results.CNAS.Total,
      Total_IRG: h.results.G50.Total_IRG,
    }))

  const textColor = isDark ? '#94A3B8' : '#475569'
  const gridColor = isDark ? '#374151' : '#E2E8F0'

  // Calculer les variations
  // Trier pour avoir le plus récent en premier
  const sortedHistory = [...history].sort((a, b) => b.month.localeCompare(a.month))
  const current = sortedHistory[0]
  const previous = sortedHistory[1]

  const getVariation = (key) => {
    if (!previous) return { value: 0, percent: 0 }
    const currentVal = current.results[key]
    const prevVal = previous.results[key]
    const diff = currentVal - prevVal
    const percent = prevVal !== 0 ? ((diff / prevVal) * 100) : 0
    return { value: diff, percent }
  }

  const variations = [
    { label: 'Salaire de Poste', key: 'R500', ...getVariation('R500') },
    { label: 'Salaire Brut', key: 'BRUT', ...getVariation('BRUT') },
    { label: 'Net à Payer', key: 'R770', ...getVariation('R770') },
    { label: 'Total CNAS', key: 'CNAS', ...getVariation('CNAS') },
  ]

  const currentLabel = current?.monthLabel || current?.month
  const previousLabel = previous?.monthLabel || previous?.month

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent-cyan to-accent-blue" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Comparaison mensuelle
          </h1>
        </motion.div>
        {previous && (
          <p className={`ml-5 text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Comparaison: <strong>{currentLabel}</strong> vs <strong>{previousLabel}</strong>
          </p>
        )}
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Effacer l'historique</span>
        </button>
      </div>

      {/* Cartes de variation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {variations.map((var_item, index) => {
          const isPositive = var_item.value >= 0
          const Icon = isPositive ? TrendingUp : TrendingDown

          return (
            <motion.div
              key={var_item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-2xl p-6 border
                ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
              `}
            >
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {var_item.label}
              </p>
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${isPositive ? 'text-accent-emerald' : 'text-accent-rose'}`} />
                <span className={`text-lg font-bold ${isPositive ? 'text-accent-emerald' : 'text-accent-rose'}`}>
                  {isPositive ? '+' : ''}{var_item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {var_item.percent.toFixed(2)}% vs {previousLabel}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Graphique d'évolution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`
          rounded-2xl p-6 border mb-8
          ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
        `}
      >
        <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Évolution des salaires
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px'
              }}
              formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DA'}
            />
            <Legend />
            <Line type="monotone" dataKey="R500" name="Salaire Poste" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="BRUT" name="Salaire Brut" stroke="#8B5CF6" strokeWidth={2} />
            <Line type="monotone" dataKey="R770" name="Net à Payer" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Graphique des charges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`
          rounded-2xl p-6 border
          ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
        `}
      >
        <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Évolution des charges
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px'
              }}
              formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DA'}
            />
            <Legend />
            <Line type="monotone" dataKey="CNAS_Total" name="Total CNAS" stroke="#F59E0B" strokeWidth={2} />
            <Line type="monotone" dataKey="Total_IRG" name="Total IRG G50" stroke="#F43F5E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
