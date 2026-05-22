import React from 'react'
import ReactDOM from 'react-dom/client'
import { CarInsuranceForm } from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarInsuranceForm
      onSubmit={(data) => console.log('Submitted:', data)}
      onBack={() => {}}
      language="en"
    />
  </React.StrictMode>,
)
