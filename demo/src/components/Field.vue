<script setup>
defineProps({
  label: { type: String, required: true },
  /** Unit shown inside the control, e.g. "ms". */
  suffix: String,
})
</script>

<template>
  <label class="inline-flex items-center gap-3 text-sm">
    <span class="text-muted">{{ label }}</span>
    <span class="relative">
      <slot />
      <span
        v-if="suffix"
        class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted"
      >
        {{ suffix }}
      </span>
    </span>
  </label>
</template>
