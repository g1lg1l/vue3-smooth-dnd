import { ref, watchEffect } from 'vue'

// index.html applies the class before the first paint; this keeps it in sync afterwards
const isDark = ref(document.documentElement.classList.contains('dark'))

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {
    /* storage unavailable */
  }
})

export const useTheme = () => ({ isDark, toggle: () => (isDark.value = !isDark.value) })
