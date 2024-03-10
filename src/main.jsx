import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/viva-light/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PrimeReactProvider>
    </React.StrictMode>,
)
