import { create } from 'zustand'

interface State {
  selectedItems: Set<string>
}

interface Actions {
  resetItems: () => void
  addItem: (item: string) => void
  removeItem: (item: string) => void
  setItems: (items: Set<string>) => void
}

const initialState: State = {
  selectedItems: new Set(),
}

export const useSelectedItems = create<State & Actions>(set => ({
  ...initialState,
  resetItems: () => set(initialState),
  addItem: (item: string) => set((state) => {
    state.selectedItems.add(item)
    return {
      selectedItems: state.selectedItems,
    }
  }),
  removeItem: (item: string) => set((state) => {
    state.selectedItems.delete(item)
    return {
      selectedItems: state.selectedItems,
    }
  }),
  setItems: (items: Set<string>) => set({
    selectedItems: items,
  }),
}))
