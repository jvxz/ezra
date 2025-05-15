import { create } from 'zustand'

interface State {
  selectedSessions: Set<string>
}

interface Actions {
  resetSessions: () => void
  addSession: (session: string) => void
  removeSession: (session: string) => void
  setSessions: (sessions: Set<string>) => void
}

const initialState: State = {
  selectedSessions: new Set(),
}

export const useSelectedSessions = create<State & Actions>(set => ({
  ...initialState,
  resetSessions: () => set(initialState),
  addSession: (session: string) => set((state) => {
    state.selectedSessions.add(session)
    return {
      selectedSessions: state.selectedSessions,
    }
  }),
  removeSession: (session: string) => set((state) => {
    state.selectedSessions.delete(session)
    return {
      selectedSessions: state.selectedSessions,
    }
  }),
  setSessions: (sessions: Set<string>) => set({
    selectedSessions: sessions,
  }),
}))
