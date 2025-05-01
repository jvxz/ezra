import { DevTools } from '@/components/dev-tools.tsx'
import { StatusToaster } from '@/components/status-toaster.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { scan } from 'react-scan'
import App from './App.tsx'
import '@/assets/globals.css'

scan({
    enabled: process.env.NODE_ENV === 'development',
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            {process.env.NODE_ENV === 'development' && <DevTools />}
            <StatusToaster />
        </QueryClientProvider>
    </React.StrictMode>,)
