import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { getSettings } from './lib/store'
import { applyTheme } from './lib/theme'

applyTheme(getSettings().theme) // before first paint, so there's no light/dark flash

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
