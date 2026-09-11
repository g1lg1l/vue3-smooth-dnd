<script setup>
defineProps({
  label: { type: String, required: true },
})
const model = defineModel({ type: Boolean })
</script>

<template>
  <label class="relative inline-flex cursor-pointer items-center gap-3 text-sm select-none">
    <!-- the real checkbox covers the whole label, invisible but clickable and focusable -->
    <input
      v-model="model"
      type="checkbox"
      class="peer absolute inset-0 z-10 m-0 cursor-pointer appearance-none opacity-0"
    />
    <span
      class="relative h-5 w-9 shrink-0 rounded-full bg-line transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
    />
    <span>{{ label }}</span>
  </label>
</template>
