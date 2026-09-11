<script setup>
defineProps({
  entries: { type: Array, required: true },
})
defineEmits(['clear'])
</script>

<template>
  <section data-testid="event-log" class="flex min-h-0 flex-col rounded-card border border-line bg-surface">
    <header class="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm">
      <h2 class="font-medium">
        Events <span class="text-muted tabular-nums">{{ entries.length }}</span>
      </h2>
      <button type="button" class="link" @click="$emit('clear')">Clear</button>
    </header>
    <ol class="max-h-[32rem] min-h-0 flex-1 overflow-y-auto p-2 font-mono text-xs leading-5 lg:max-h-none">
      <li v-if="!entries.length" class="p-2 font-sans text-sm text-muted">
        Drag an item to see what the containers emit.
      </li>
      <li
        v-for="entry in entries"
        :key="entry.id"
        :data-source="entry.source"
        :data-event="entry.event"
        class="grid grid-cols-[auto_auto_auto_minmax(0,1fr)] gap-x-3 rounded px-2 py-0.5 hover:bg-surface-2"
      >
        <span class="text-muted">{{ entry.time }}</span>
        <span class="text-accent">{{ entry.source }}</span>
        <span class="font-medium">{{ entry.event }}</span>
        <code class="truncate" :title="entry.detail">{{ entry.detail }}</code>
      </li>
    </ol>
  </section>
</template>
