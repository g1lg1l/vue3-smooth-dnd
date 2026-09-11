<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import pkg from '../../package.json'
import GripIcon from './components/GripIcon.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { groups, repo } from './demos'

const route = useRoute()
// fill pages own the viewport and never scroll the window; the others scroll like a normal page
const fill = computed(() => Boolean(route.meta.demo?.fill))
</script>

<template>
  <div class="flex flex-col" :class="fill ? 'h-dvh overflow-hidden' : 'min-h-dvh'">
    <header
      class="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-ground/90 px-4 backdrop-blur lg:px-6"
      :class="{ 'sticky top-0': !fill }"
    >
      <router-link to="/" class="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
        <span class="grid size-7 place-items-center rounded-[7px] bg-ink text-ground">
          <GripIcon class="size-3.5" />
        </span>
        vue3-smooth-dnd
      </router-link>
      <span
        class="hidden rounded-full border border-line px-2 py-0.5 text-xs text-muted tabular-nums sm:inline"
      >
        v{{ pkg.version }}
      </span>
      <div class="ml-auto flex items-center gap-1 text-sm">
        <a
          :href="repo"
          class="rounded-control px-2.5 py-1.5 hover:bg-surface-2"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/vue3-smooth-dnd"
          class="hidden rounded-control px-2.5 py-1.5 hover:bg-surface-2 sm:inline"
          target="_blank"
          rel="noopener"
        >
          npm
        </a>
        <ThemeToggle />
      </div>
    </header>

    <div class="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <nav
        aria-label="Pages"
        class="shrink-0 border-b border-line lg:overflow-y-auto lg:border-r lg:border-b-0"
        :class="{ 'lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)]': !fill }"
      >
        <div class="flex gap-5 overflow-x-auto px-3 py-2 lg:flex-col lg:gap-6 lg:px-4 lg:py-6">
          <router-link to="/" class="nav-link" exact-active-class="nav-link-active">Overview</router-link>
          <router-link to="/reference" class="nav-link" active-class="nav-link-active">Reference</router-link>
          <div v-for="group in groups" :key="group.title" class="flex gap-1 lg:flex-col">
            <p class="hidden px-2.5 pb-1 text-xs text-muted lg:block">{{ group.title }}</p>
            <router-link
              v-for="demo in group.demos"
              :key="demo.path"
              :to="demo.path"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ demo.title }}
            </router-link>
          </div>
        </div>
      </nav>

      <main
        class="min-w-0 px-4 py-6 lg:px-10 lg:py-10"
        :class="{ 'flex min-h-0 flex-1 flex-col overflow-y-auto': fill }"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
