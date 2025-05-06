import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { QueryClient } from '@tanstack/react-query'
import { createStore, del, get, set } from 'idb-keyval'

export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery'): Persister {
  const store = createStore('cache', 'queries')
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client, store)
    },
    restoreClient: async () => {
      return get<PersistedClient>(idbValidKey, store)
    },
    removeClient: async () => {
      await del(idbValidKey, store)
    },
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
})
