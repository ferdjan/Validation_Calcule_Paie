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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4']

export default function Charts() {
  const { isDark } = useTheme()
  const { results } = useCalculator()

  if (!results) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Importez un fichier pour voir les graphiques
      </div>
    )
  }

  // Données pour le graphique des rubriques principales
  const mainData = [
    { name: 'R500', value: results.R500, label: 'Salaire Poste' },
    { name: 'BRUT', value: results.BRUT, label: 'Salaire Brut' },
    { name: 'Base IRG', value: results.Base_IRG, label: 'Base IRG' },
    { name: 'R642', value: results.R642, label: 'Base 10%' },
    { name: 'R646', value: results.R646, label: 'Retenue 10%' },
    { name: 'R770', value: results.R770, label: 'Net à Payer' },
  ]

  // Données pour le graphique CNAS
  const cnasData = [
    { name: 'RG (34,5%)', value: results.CNAS.RG },
    { name: 'FNPOS (0,5%)', value: results.CNAS.FNPOS },
  ]

  // Données pour le graphique IRG
  const irgData = [
    { name: 'R660 (Excel)', value: results.G50.R660_Excel },
    { name: 'R646 (10%)', value: results.G50.R646 },
  ]

  const textColor = isDark ? '#94A3B8' : '#475569'
  const gridColor = isDark ? '#374151' : '#E2E8F0'

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-2xl p-6 border
          ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
        `}
      >
        <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Rubriques principales (en DA)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mainData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px'
              }}
              formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DA'}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            rounded-2xl p-6 border
            ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
          `}
        >
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Répartition CNAS
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cnasData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {cnasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DA'}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${gridColor}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`
            rounded-2xl p-6 border
            ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
          `}
        >
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Répartition IRG (G50)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={irgData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {irgData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DA'}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${gridColor}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
