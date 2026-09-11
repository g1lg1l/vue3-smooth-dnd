<script setup>
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'

defineProps({
  label: { type: String, required: true },
  /** `[{ value, label }]` */
  options: { type: Array, required: true },
})
const model = defineModel({ type: String })
</script>

<template>
  <label class="inline-flex items-center gap-3 text-sm">
    <span class="text-muted">{{ label }}</span>
    <span class="relative">
      <select v-model="model" class="control appearance-none pr-8">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronUpDownIcon
        class="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted"
      />
    </span>
  </label>
</template>
