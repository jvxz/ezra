import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface State {
  rate: number
}

interface Actions {
  setRate: (rate: number) => void
}

const initialState: State = {
  rate: 0,
}

export const usePrefs = create<State & Actions>()(persist(
  set => ({
    ...initialState,
    setRate: (rate) => {
      set({
        rate,
      })
    },
  }),
  {
    name: 'prefs-storage',
    storage: createJSONStorage(() => localStorage),
  },
))
