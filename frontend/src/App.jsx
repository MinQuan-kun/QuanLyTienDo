import { useState } from 'react'
import ProgressTracker from './components/ProgressTracker'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        <ProgressTracker />
      </div>
    </div>
  )
}

export default App
