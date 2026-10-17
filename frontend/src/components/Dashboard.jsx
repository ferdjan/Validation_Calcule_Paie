import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calculator,
  ArrowRight,
  Activity,
  DollarSign,
  Percent,
  PiggyBank
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'
import { useNavigate } from 'react-router-dom'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

const metricCards = [
  { key: 'R500', title: 'Salaire de Poste', desc: 'Base cotisable', icon: Wallet, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
  { key: 'BRUT', title: 'Salaire Brut', desc: 'R500 + Panier/Transport', icon: DollarSign, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  { key: 'Base_IRG', title: 'Base IRG', desc: 'Barème progressif', icon: Calculator, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
  { key: 'R642', title: 'Base IRG 10%', desc: 'Imposition forfaitaire', icon: Percent, color: 'purple', gradient: 'from-violet-500 to-purple-500' },
  { key: 'R646', title: 'Retenue IRG 10%', desc: '10% de la base', icon: TrendingDown, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
  { key: 'R770', title: 'Net à Payer', desc: 'Montant final', icon: PiggyBank, color: 'emerald', gradient: 'from-green-500 to-emerald-500' },
]

export default function Dashboard() {
  const { isDark } = useTheme()
  const { results } = useCalculator()
  const navigate = useNavigate()

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mb-6 shadow-xl shadow-accent-blue/20"
        >
          <Calculator className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Bienvenue sur le Calculateur de Paie
        </h2>
        <p className={`text-center max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Importez votre fichier Excel ou PDF centralisateur pour commencer les calculs de paie selon la législation algérienne.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-blue/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          Importer un fichier
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent-blue to-accent-purple" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Résultats de calcul
          </h1>
        </motion.div>
        <p className={`ml-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Rubriques calculées depuis le centralisateur
        </p>
      </div>

      {/* Grid des métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricCards.map((card, index) => {
          const value = results[card.key]
          return (
            <motion.div
              key={card.key}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className={`
                relative overflow-hidden rounded-2xl p-6
                ${isDark ? 'bg-dark-panel border border-dark-border' : 'bg-light-panel border border-light-border'}
                card-hover group
              `}
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

              {/* Background glow */}
              <div className={`
                absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10
                bg-gradient-to-br ${card.gradient} blur-2xl group-hover:opacity-20 transition-opacity
              `} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    bg-gradient-to-br ${card.gradient} bg-opacity-10
                  `}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`
                    text-xs font-mono px-2 py-1 rounded-lg
                    ${isDark ? 'bg-dark-card text-gray-400' : 'bg-light-card text-gray-500'}
                  `}>
                    {card.key}
                  </span>
                </div>

                <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {typeof value === 'number' ? value.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0,00'} DA
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Panier Transport */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`
          rounded-2xl p-6
          ${isDark ? 'bg-dark-panel border border-dark-border' : 'bg-light-panel border border-light-border'}
        `}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-cyan" />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Panier & Transport
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Gains', value: results.debug?.Cat4?.gains || 0, color: 'text-accent-emerald' },
            { label: 'Retenues', value: results.debug?.Cat4?.retenues || 0, color: 'text-accent-rose' },
            { label: 'Net', value: results.PanierTransport?.net || 0, color: 'text-accent-blue' },
          ].map((item) => (
            <div key={item.label} className={`
              p-4 rounded-xl
              ${isDark ? 'bg-dark-card' : 'bg-light-card'}
            `}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>
                {item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
