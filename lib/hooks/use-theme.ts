import { themeStorage } from '@/lib/local-storage/theme'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

function useTheme() {
  const { data: theme, refetch } = useQuery({
    queryKey: ['theme'],
    queryFn: async () => themeStorage.getValue(),
  })

  const { mutate } = useMutation({
    mutationFn: async () => {
      const theme = localStorage.getItem('theme')
      const newTheme = theme === 'light' ? 'dark' : 'light'

      localStorage.setItem('theme', newTheme)

      document.documentElement.classList.toggle('dark', newTheme === 'dark')

      await themeStorage.setValue(newTheme)

      void refetch()

      return true
    },
  })

  const handleThemeToggle = useCallback(() => mutate(), [mutate])

  return {
    handleThemeToggle,
    theme,
  }
}

export { useTheme }
