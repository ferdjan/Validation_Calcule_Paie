import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Extrait la période (YYYY-MM) depuis le nom du fichier
// Ex: 'EX 01-2026' → '2026-01', 'Salaires_02-2026' → '2026-02', '03/2026' → '2026-03'
const extractPeriodFromFilename = (filename) => {
  // Cherche le pattern MM-YYYY ou MM/YYYY ou MM.YYYY
  const match = filename.match(/(\d{1,2})[-\/.](\d{4})/)
  if (match) {
    const month = match[1].padStart(2, '0') // '1' → '01'
    const year = match[2]
    return `${year}-${month}` // Format: 2026-01 (pour tri chronologique)
  }
  // Fallback: mois courant
  return new Date().toISOString().slice(0, 7)
}

// Formate YYYY-MM → "Janvier 2026" pour l'affichage
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const formatPeriod = (period) => {
  if (!period || !period.includes('-')) return period
  const [year, month] = period.split('-')
  const monthIndex = parseInt(month, 10) - 1
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${MONTHS[monthIndex]} ${year}`
  }
  return `${month}/${year}`
}

const CalculatorContext = createContext()

const API_URL = 'http://localhost:5000/api'

export function CalculatorProvider({ children }) {
  const [results, setResults] = useState(null)
  const [validation, setValidation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('payroll_history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('payroll_history', JSON.stringify(history))
  }, [history])

  const calculate = async (file) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/calculate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        const newResults = response.data.data.calculations
        const newValidation = response.data.data.validation

        setResults(newResults)
        setValidation(newValidation)
        setFileName(file.name)

        const monthKey = extractPeriodFromFilename(file.name)
        const historyEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          month: monthKey,
          monthLabel: formatPeriod(monthKey), // "Janvier 2026"
          fileName: file.name,
          results: newResults,
          validation: newValidation
        }

        setHistory(prev => {
          const filtered = prev.filter(h => h.month !== monthKey)
          return [historyEntry, ...filtered].slice(0, 12)
        })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du calcul')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    if (!validation) return

    try {
      const response = await axios.post(`${API_URL}/export-csv`, {
        validation: validation
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `paie_validation_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError("Erreur lors de l'export CSV")
    }
  }

  const exportPDF = async () => {
    if (!results) return

    try {
      const response = await axios.post(`${API_URL}/export-pdf`, {
        results: results
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `declarations_${new Date().toISOString().slice(0,10)}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError("Erreur lors de l'export PDF")
    }
  }

  const clearResults = () => {
    setResults(null)
    setValidation(null)
    setFileName(null)
    setError(null)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('payroll_history')
  }

  return (
    <CalculatorContext.Provider value={{
      results, validation, loading, error, fileName, history,
      calculate, exportCSV, exportPDF, clearResults, clearHistory
    }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext)
  if (!context) throw new Error('useCalculator must be used within CalculatorProvider')
  return context
}
