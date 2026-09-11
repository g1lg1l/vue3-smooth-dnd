<script setup>
import { ref } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import DemoPage from '../components/DemoPage.vue'
import { list } from '../data/mock'
import { applyDrag } from '../utils/applyDrag'

const rows = ref(list(40, 'Row'))
const boxed = ref(list(30, 'Boxed'))
const cards = ref(list(30, 'Card'))
</script>

<template>
  <DemoPage>
    <p class="mb-6 max-w-2xl text-sm text-muted">
      Auto scroll is on by default for every scrollable ancestor and for the window. To keep one element
      still, add the class <code class="font-mono text-ink">smooth-dnd-prevent-auto-scroll-class</code> to it.
    </p>

    <div class="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 class="mb-2 text-sm font-medium">The window: drag a row to the top or bottom of the viewport</h2>
        <Container
          data-testid="rows-list"
          class="dnd-list"
          drag-class="lifted"
          drop-class="dropping"
          @drop="rows = applyDrag(rows, $event)"
        >
          <Draggable v-for="item in rows" :key="item.id">
            <div class="dnd-item dnd-item-hover">{{ item.text }}</div>
          </Draggable>
        </Container>
      </section>

      <div class="space-y-6 self-start lg:sticky lg:top-20">
        <section>
          <h2 class="mb-2 text-sm font-medium">A scrollable element</h2>
          <Container
            data-testid="boxed-list"
            class="dnd-list h-96 overflow-y-auto"
            drag-class="lifted"
            drop-class="dropping"
            @drop="boxed = applyDrag(boxed, $event)"
          >
            <Draggable v-for="item in boxed" :key="item.id">
              <div class="dnd-item dnd-item-hover">{{ item.text }}</div>
            </Draggable>
          </Container>
        </section>

        <section>
          <h2 class="mb-2 text-sm font-medium">A horizontal strip</h2>
          <Container
            data-testid="strip-list"
            class="dnd-list flex gap-2 overflow-x-auto"
            orientation="horizontal"
            drag-class="lifted"
            drop-class="dropping"
            @drop="cards = applyDrag(cards, $event)"
          >
            <Draggable v-for="item in cards" :key="item.id" class="shrink-0">
              <div class="dnd-item dnd-item-hover h-24 w-28 justify-center">{{ item.text }}</div>
            </Draggable>
          </Container>
        </section>
      </div>
    </div>
  </DemoPage>
</template>
