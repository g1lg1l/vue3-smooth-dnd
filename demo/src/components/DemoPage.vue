<script setup>
import { useRoute } from 'vue-router'
import { sourceUrl } from '../demos'

const props = defineProps({
  /** Let the content use the full width instead of the reading column. */
  wide: Boolean,
  /** Override the demo registry entry, for pages that are not demos. */
  title: String,
  summary: String,
})

const demo = {
  ...(useRoute().meta.demo ?? {}),
  ...(props.title && { title: props.title, summary: props.summary }),
}
</script>

<template>
  <article :class="[wide ? '' : 'mx-auto w-full max-w-6xl', demo.fill ? 'flex min-h-0 flex-1 flex-col' : '']">
    <header class="mb-8 flex shrink-0 flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div class="max-w-2xl">
        <h1 class="text-[2rem] leading-tight font-semibold tracking-tight">{{ demo.title }}</h1>
        <p class="mt-2 text-pretty text-muted">{{ demo.summary }}</p>
      </div>
      <a v-if="demo.file" :href="sourceUrl(demo.file)" class="link text-sm" target="_blank" rel="noopener">
        Source on GitHub
      </a>
    </header>

    <div
      v-if="$slots.controls"
      class="mb-6 grid shrink-0 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-x-8 gap-y-3 rounded-card border border-line bg-surface px-5 py-4"
    >
      <slot name="controls" />
    </div>

    <div :class="demo.fill ? 'flex min-h-0 flex-1 flex-col' : ''">
      <slot />
    </div>
  </article>
</template>
