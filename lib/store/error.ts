import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface State {
  message: string
}

interface Actions {
  reset: () => void
  setError: (state: State) => void
}

const initialState: State = {
  message: '',
}

const useErrorStore = create(immer<State & Actions>(set => ({
  ...initialState,
  reset: () => set(initialState),
  setError: (state: State) => set(state),
})))

export { useErrorStore }
