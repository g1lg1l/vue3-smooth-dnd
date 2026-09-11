<script setup>
import { ref } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { TrashIcon } from '@heroicons/vue/24/outline'
import DemoPage from '../components/DemoPage.vue'
import EventLog from '../components/EventLog.vue'
import { useEventLog } from '../composables/useEventLog'
import { list } from '../data/mock'
import { applyDrag } from '../utils/applyDrag'

const source = list(4, 'Item')
const target = ref([])
const { entries, clear, listeners } = useEventLog()

let copies = 0
const getChildPayload = (index) => ({ id: `copy-${++copies}`, text: `${source[index].text}, copy ${copies}` })
const onDrop = (dropResult) => (target.value = applyDrag(target.value, dropResult))
</script>

<template>
  <DemoPage>
    <ol class="mb-6 max-w-2xl shrink-0 list-decimal space-y-1 pl-5 text-sm text-muted">
      <li>Drag three or more items into the right list.</li>
      <li>Delete them with the buttons, or clear the list.</li>
      <li>
        Drag one in again and read <code class="font-mono text-ink">addedIndex</code> in the log: it must be
        0.
      </li>
    </ol>

    <div class="grid min-h-0 flex-1 gap-6 lg:grid-cols-3">
      <section class="flex min-h-0 flex-col">
        <h2 class="mb-2 shrink-0 text-sm font-medium">
          Source, <code class="font-mono">behaviour="copy"</code>
        </h2>
        <Container
          v-bind="listeners('copy')"
          data-testid="source-list"
          class="dnd-list min-h-0 flex-1 overflow-y-auto"
          behaviour="copy"
          group-name="copy-contain"
          :get-child-payload="getChildPayload"
          drag-class="lifted"
          drop-class="dropping"
        >
          <Draggable v-for="item in source" :key="item.id">
            <div class="dnd-item dnd-item-hover">{{ item.text }}</div>
          </Draggable>
        </Container>
      </section>

      <section class="flex min-h-0 flex-col">
        <h2 class="mb-2 flex shrink-0 items-center text-sm font-medium">
          <span>Target, <code class="font-mono">behaviour="contain"</code></span>
          <button type="button" class="link ml-auto" @click="target = []">Clear list</button>
        </h2>
        <Container
          v-bind="listeners('contain', { onDrop })"
          data-testid="target-list"
          class="dnd-list min-h-0 flex-1 overflow-y-auto"
          behaviour="contain"
          group-name="copy-contain"
          non-drag-area-selector="button"
          drag-class="lifted"
          drop-class="dropping"
        >
          <Draggable v-for="(item, index) in target" :key="item.id">
            <div class="dnd-item dnd-item-hover">
              {{ item.text }}
              <button
                type="button"
                class="ml-auto rounded p-1 text-muted hover:bg-lift/10 hover:text-lift"
                aria-label="Delete"
                @click="target.splice(index, 1)"
              >
                <TrashIcon class="size-4" />
              </button>
            </div>
          </Draggable>
        </Container>
      </section>

      <EventLog :entries="entries" @clear="clear" />
    </div>
  </DemoPage>
</template>
