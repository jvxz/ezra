import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface State {
  message: string
  timestamp: number
  type: 'error' | 'success' | 'info'
}

interface Actions {
  reset: () => void
  setStatus: (state: State) => void
}

const initialState: State = {
  message: '',
  timestamp: 0,
  type: 'info',
}

const useStatusStore = create(immer<State & Actions>(set => ({
  ...initialState,
  reset: () => set(initialState),
  setStatus: (state: State) => set(state),
})))

export { useStatusStore }
