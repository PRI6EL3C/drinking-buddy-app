import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx' // localStorage version
// import App from './AppWithFirebase.jsx' // Firebase version
import App from './AppWithSupabase.jsx' // Supabase version - works across devices, no credit card needed!
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
