export default defineUnlistedScript({
  main() {
    const theme = localStorage.getItem('theme')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
})
