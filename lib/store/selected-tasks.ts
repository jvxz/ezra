import { create } from 'zustand'

interface State {
  selectedTasks: Set<string>
}

interface Actions {
  resetTasks: () => void
  addTask: (task: string) => void
  removeTask: (task: string) => void
  setTasks: (tasks: Set<string>) => void
}

const initialState: State = {
  selectedTasks: new Set(),
}

export const useSelectedTasks = create<State & Actions>(set => ({
  ...initialState,
  resetTasks: () => set(initialState),
  addTask: (task: string) => set((state) => {
    state.selectedTasks.add(task)
    return {
      selectedTasks: state.selectedTasks,
    }
  }),
  removeTask: (task: string) => set((state) => {
    state.selectedTasks.delete(task)
    return {
      selectedTasks: state.selectedTasks,
    }
  }),
  setTasks: (tasks: Set<string>) => set({
    selectedTasks: tasks,
  }),
}))
