/* eslint-disable style/function-paren-newline style/comma-dangle style/indent */

import { createIDBPersister, queryClient } from '@/lib/query-client.ts'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@/assets/globals.css'

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
        </PersistQueryClientProvider>
    </React.StrictMode>,)
