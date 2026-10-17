import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Moon, 
  Sun, 
  Calculator,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/validation', icon: CheckCircle2, label: 'Validation' },
  { path: '/declarations', icon: FileText, label: 'Déclarations' },
  { path: '/charts', icon: BarChart3, label: 'Graphiques' },
  { path: '/comparison', icon: TrendingUp, label: 'Comparaison' },
]

export default function Layout({ children }) {
  const { isDark, toggleTheme } = useTheme()
  const { fileName, clearResults } = useCalculator()
  const location = useLocation()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-dark-bg' : 'bg-light-bg'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          w-72 flex-shrink-0 flex flex-col
          ${isDark ? 'bg-dark-sidebar border-r border-dark-border' : 'bg-light-sidebar border-r border-light-border'}
          transition-colors duration-300
        `}>
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Paie Algérie
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  v6.2 Web
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-accent-blue border border-accent-blue/20' 
                      : `${isDark ? 'text-gray-400 hover:text-white hover:bg-dark-hover' : 'text-gray-600 hover:text-gray-900 hover:bg-light-hover'}`
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}

            <Link
              to="/upload"
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4
                ${location.pathname === '/upload'
                  ? 'bg-gradient-to-r from-accent-emerald/20 to-accent-cyan/20 text-accent-emerald border border-accent-emerald/20'
                  : `${isDark ? 'text-gray-400 hover:text-white hover:bg-dark-hover' : 'text-gray-600 hover:text-gray-900 hover:bg-light-hover'}`
                }
              `}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Importer fichier</span>
            </Link>
          </nav>

          {/* File Info */}
          {fileName && (
            <div className="px-4 mb-4">
              <div className={`
                p-3 rounded-xl border
                ${isDark ? 'bg-dark-panel border-dark-border' : 'bg-light-panel border-light-border'}
              `}>
                <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Fichier actif</p>
                <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {fileName}
                </p>
                <button
                  onClick={clearResults}
                  className="mt-2 text-xs text-accent-rose hover:text-accent-rose/80 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className={`
                flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-dark-hover' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-light-hover'
                }
              `}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{isDark ? 'Mode clair' : 'Mode sombre'}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              H.FERDJANI Version V1
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
