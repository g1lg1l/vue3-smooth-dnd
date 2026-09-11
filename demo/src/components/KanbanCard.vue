<script setup>
import { Draggable } from 'vue3-smooth-dnd'
import { ArrowPathIcon } from '@heroicons/vue/16/solid'

defineProps({
  card: { type: Object, required: true },
  hover: Boolean,
})
</script>

<template>
  <Draggable>
    <article
      class="mx-3 my-2 cursor-grab rounded-card border border-line bg-surface p-3 active:cursor-grabbing"
      :class="{ 'dnd-card-hover': hover }"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="rounded-full px-2 py-0.5 text-[11px] font-medium" :class="card.tag.classes">{{
          card.tag.name
        }}</span>
        <span class="text-xs text-muted tabular-nums">#{{ card.number }}</span>
      </div>
      <p class="mt-2 text-sm leading-snug">{{ card.text }}</p>
      <div class="mt-3 flex items-center justify-between">
        <span class="grid size-6 place-items-center rounded-full bg-surface-2 text-sm" title="Assignee">{{
          card.emoji
        }}</span>
        <span v-if="card.loading" class="flex items-center gap-1 text-xs text-muted">
          <ArrowPathIcon class="size-3.5 animate-spin" />
          Saving
        </span>
      </div>
    </article>
  </Draggable>
</template>
