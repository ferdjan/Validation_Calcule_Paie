import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCalculator } from '../context/CalculatorContext'
import { useNavigate } from 'react-router-dom'

export default function UploadZone() {
  const { isDark } = useTheme()
  const { calculate, loading, error, results } = useCalculator()
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      calculate(file)
    }
  }, [calculate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  React.useEffect(() => {
    if (results) {
      navigate('/')
    }
  }, [results, navigate])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Importer un fichier
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Chargez votre centralisateur Excel ou PDF pour effectuer les calculs
        </p>
      </div>

      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? 'border-accent-blue bg-accent-blue/5 scale-[1.02]' 
            : isDark 
              ? 'border-gray-700 hover:border-gray-500 bg-dark-panel' 
              : 'border-gray-300 hover:border-gray-400 bg-light-panel'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className={`
          w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center
          ${isDark ? 'bg-dark-card' : 'bg-light-card'}
        `}>
          {loading ? (
            <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
          ) : (
            <Upload className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>

        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {loading ? 'Calcul en cours...' : isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier'}
        </h3>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          ou cliquez pour sélectionner un fichier (.xlsx, .xls, .pdf)
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            ${isDark ? 'bg-dark-card text-gray-400' : 'bg-light-card text-gray-500'}
          `}>
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </div>
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            ${isDark ? 'bg-dark-card text-gray-400' : 'bg-light-card text-gray-500'}
          `}>
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-accent-rose flex-shrink-0" />
          <p className="text-accent-rose">{error}</p>
        </div>
      )}

      {results && (
        <div className="mt-6 p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-emerald flex-shrink-0" />
          <p className="text-accent-emerald">Calcul terminé avec succès ! Redirection...</p>
        </div>
      )}

      {/* Instructions */}
      <div className={`
        mt-8 p-6 rounded-2xl
        ${isDark ? 'bg-dark-panel border border-dark-border' : 'bg-light-panel border border-light-border'}
      `}>
        <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Formats supportés
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`
            p-4 rounded-xl
            ${isDark ? 'bg-dark-card' : 'bg-light-card'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-accent-emerald" />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Excel</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Fichiers .xlsx ou .xls avec colonnes: CODE, GAIN, RETENUE
            </p>
          </div>

          <div className={`
            p-4 rounded-xl
            ${isDark ? 'bg-dark-card' : 'bg-light-card'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-accent-amber" />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>PDF</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Centralisateur PDF exporté depuis votre logiciel de paie
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/10">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <strong className="text-accent-blue">💡 Astuce:</strong> Les fichiers PDF doivent contenir un tableau structuré avec les colonnes CODE, LIBELLE, N/BASE, GAIN, RETENUE et EFF.
          </p>
        </div>
      </div>
    </div>
  )
}
