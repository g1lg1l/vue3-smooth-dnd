<script setup>
import { ref } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import CodeBlock from '../components/CodeBlock.vue'
import GripIcon from '../components/GripIcon.vue'
import { applyDrag } from '../utils/applyDrag'

const films = ref([
  { id: 1, title: 'Princess Mononoke' },
  { id: 2, title: 'Spirited Away' },
  { id: 3, title: 'My Neighbor Totoro' },
  { id: 4, title: "Howl's Moving Castle" },
  { id: 5, title: "Kiki's Delivery Service" },
])

const install = 'npm install vue3-smooth-dnd'

// the closing script tag below is hex-escaped so the SFC parser does not end this block early
const usage = `<script setup lang="ts">
import { ref } from 'vue'
import { Container, Draggable, type DropResult } from 'vue3-smooth-dnd'

const films = ref([{ id: 1, title: 'Princess Mononoke' }, { id: 2, title: 'Spirited Away' }])

function onDrop({ removedIndex, addedIndex, payload }: DropResult) {
  if (removedIndex === null && addedIndex === null) return
  const next = [...films.value]
  const film = removedIndex !== null ? next.splice(removedIndex, 1)[0] : payload
  if (addedIndex !== null) next.splice(addedIndex, 0, film)
  films.value = next
}
<\x2fscript>

<template>
  <Container @drop="onDrop">
    <Draggable v-for="film in films" :key="film.id">
      <div class="card">{{ film.title }}</div>
    </Draggable>
  </Container>
</template>`
</script>

<template>
  <article class="mx-auto max-w-6xl">
    <section class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h1 class="text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-[3.25rem]">
          Drag and drop for Vue 3 that feels like moving real things.
        </h1>
        <p class="mt-5 max-w-lg text-lg text-pretty text-muted">
          Two components, your own markup, CSS transitions for every move. Sortable lists, kanban boards, copy
          and drop zones, drop placeholders and auto scroll, with TypeScript types included.
        </p>
        <div class="mt-8 max-w-md">
          <CodeBlock :code="install" />
        </div>
        <p class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <router-link to="/kanban" class="link">Try the kanban board</router-link>
          <router-link to="/reference" class="link"> Read the reference </router-link>
        </p>
      </div>

      <div>
        <p class="mb-2 text-sm text-muted">Rank them. Grab any row.</p>
        <Container
          data-testid="hero-list"
          class="dnd-list"
          drag-class="lifted"
          drop-class="dropping"
          @drop="films = applyDrag(films, $event)"
        >
          <Draggable v-for="(film, index) in films" :key="film.id">
            <div class="dnd-item dnd-item-hover py-3">
              <span class="w-5 text-muted tabular-nums">{{ index + 1 }}</span>
              <span class="film-title flex-1 text-base">{{ film.title }}</span>
              <GripIcon class="size-4 text-muted" />
            </div>
          </Draggable>
        </Container>
      </div>
    </section>

    <section class="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">The list above, in full</h2>
        <p class="mt-3 max-w-md text-pretty text-muted">
          A container emits <code class="font-mono text-ink">drop</code> with the removed and added index. You
          update your data, Vue re-renders, the library never touches your DOM.
        </p>
        <dl class="mt-8 space-y-5 text-sm">
          <div class="border-t border-line pt-4">
            <dt class="font-medium">Every behaviour</dt>
            <dd class="mt-1 text-muted">
              Move, copy, contain and drop-zone containers, groups, drag handles, locked axes, delays,
              placeholders.
            </dd>
          </div>
          <div class="border-t border-line pt-4">
            <dt class="font-medium">Nested and scrolled</dt>
            <dd class="mt-1 text-muted">
              Containers inside draggables, auto scroll for elements and the window, a ghost that stays under
              the pointer even inside transformed parents.
            </dd>
          </div>
          <div class="border-t border-line pt-4">
            <dt class="font-medium">Typed and self-contained</dt>
            <dd class="mt-1 text-muted">
              Written in TypeScript with the smooth-dnd core bundled and maintained here. Vue is the only
              dependency.
            </dd>
          </div>
        </dl>
      </div>
      <CodeBlock :code="usage" />
    </section>
  </article>
</template>
