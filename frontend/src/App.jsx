import React, { useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Validation from './components/Validation'
import Declarations from './components/Declarations'
import UploadZone from './components/UploadZone'
import Charts from './components/Charts'
import Comparison from './components/Comparison'
import { CalculatorProvider } from './context/CalculatorContext'

function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/validation" element={<Validation />} />
              <Route path="/declarations" element={<Declarations />} />
              <Route path="/upload" element={<UploadZone />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/comparison" element={<Comparison />} />
            </Routes>
          </Layout>
        </Router>
      </CalculatorProvider>
    </ThemeProvider>
  )
}

export default App
