import { DevTools } from '@/components/dev-tools.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StatusToaster } from '@/components/status-toaster.tsx'
import { createIDBPersister, queryClient } from '@/lib/query-client.ts'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { scan } from 'react-scan'
import App from './App.tsx'
import '@/assets/globals.css'

scan({
    enabled: process.env.NODE_ENV === 'development',
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: createIDBPersister(),
                maxAge: 1000 * 60 * 60 * 24,
            }}
        >
            <App />
            {process.env.NODE_ENV === 'development' && <DevTools />}
            <StatusToaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    </React.StrictMode>
)
