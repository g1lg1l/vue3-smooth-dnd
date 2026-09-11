<script setup>
import { ref } from 'vue'

defineProps({
  code: { type: String, required: true },
})

const copied = ref(false)
async function copy(code) {
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="relative min-w-0 rounded-card border border-line bg-surface">
    <pre class="overflow-x-auto p-4 font-mono text-[13px] leading-6"><code>{{ code }}</code></pre>
    <button
      type="button"
      class="absolute top-2 right-2 rounded-control border border-line bg-surface px-2 py-1 text-xs text-muted hover:text-ink"
      @click="copy(code)"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
  </div>
</template>
