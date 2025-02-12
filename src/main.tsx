import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './app/App'
import React from 'react'

createRoot(document.getElementById('root')!).render(
    <App />
)
