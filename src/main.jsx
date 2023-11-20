import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App'
import './index.css'

const env = import.meta.env

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={env.VITE_REACT_APP_GOOGLE_API_TOKEN}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
