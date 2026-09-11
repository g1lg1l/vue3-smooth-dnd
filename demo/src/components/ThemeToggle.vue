<script setup>
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="grid size-9 place-items-center rounded-control hover:bg-surface-2"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <SunIcon v-if="isDark" class="size-5" />
    <MoonIcon v-else class="size-5" />
  </button>
</template>
