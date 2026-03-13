import { create } from 'zustand'

interface IngredientsFiltersState {
  skinType: string[]
  concern: string[]
  action: string[]
  category: string[]
  search: string

  toggleFilter: (key: 'skinType' | 'concern' | 'action' | 'category', value: string) => void
  setSearch: (value: string) => void
  resetFilters: () => void
  activeFilterCount: () => number
}

const initialFilters = {
  skinType: [] as string[],
  concern: [] as string[],
  action: [] as string[],
  category: [] as string[],
  search: '',
}

export const useIngredientsFiltersStore = create<IngredientsFiltersState>((set, get) => ({
  ...initialFilters,

  toggleFilter: (key, value) =>
    set((state) => {
      const current = state[key]
      return {
        [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      }
    }),

  setSearch: (value) => set({ search: value }),

  resetFilters: () => set(initialFilters),

  activeFilterCount: () => {
    const { skinType, concern, action, category } = get()
    return skinType.length + concern.length + action.length + category.length
  },
}))
