<script setup>
import { reactive, ref } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import DemoPage from '../components/DemoPage.vue'
import GripIcon from '../components/GripIcon.vue'
import KanbanCard from '../components/KanbanCard.vue'
import ToggleField from '../components/ToggleField.vue'
import { columns as makeColumns } from '../data/mock'
import { applyDrag } from '../utils/applyDrag'

const columns = ref(makeColumns(8))

// "Filter on columns" puts a CSS filter on each column: an ancestor like that used to offset the drag ghost.
const options = reactive({ hover: true, placeholder: true, removeOnDropOut: false, filter: false })

function onColumnDrop(dropResult) {
  columns.value = applyDrag(columns.value, dropResult)
}

function onCardDrop(column, dropResult) {
  const { removedIndex, addedIndex } = dropResult
  if (removedIndex === null && addedIndex === null) return
  if (removedIndex === null) {
    // the card came from another column: pretend to save it and lock it meanwhile
    dropResult.payload.loading = true
    setTimeout(() => (dropResult.payload.loading = false), Math.random() * 3000 + 1000)
  }
  column.cards = applyDrag(column.cards, dropResult)
}
</script>

<template>
  <DemoPage wide>
    <template #controls>
      <ToggleField v-model="options.hover" label="Hover styles" />
      <ToggleField v-model="options.placeholder" label="Drop placeholder" />
      <ToggleField v-model="options.removeOnDropOut" label="removeOnDropOut" />
      <ToggleField v-model="options.filter" label="Filter on columns" />
    </template>

    <!-- bleeds into the main padding so the horizontal scrollbar sits on the viewport edge -->
    <Container
      data-testid="board"
      class="-mx-4 -mb-6 flex min-h-0 flex-1 gap-5 overflow-x-auto px-4 pb-3 lg:-mx-10 lg:-mb-10 lg:px-10"
      group-name="columns"
      orientation="horizontal"
      drag-handle-selector=".column-handle"
      drag-class="lifted"
      drop-class="dropping"
      @drop="onColumnDrop"
    >
      <Draggable v-for="column in columns" :key="column.id" class="h-full w-[19rem] shrink-0">
        <section
          class="flex h-full flex-col rounded-card border border-line bg-surface-2/70"
          :class="{ 'drop-shadow-2xl': options.filter }"
        >
          <header
            class="column-handle flex cursor-grab items-center gap-2.5 px-3.5 py-3 active:cursor-grabbing"
          >
            <span class="size-2.5 shrink-0 rounded-full" :style="{ background: column.color }" />
            <h2 class="column-name truncate text-sm font-semibold">{{ column.name }}</h2>
            <span class="ml-auto rounded-full bg-surface px-2 py-0.5 text-xs text-muted tabular-nums">
              {{ column.cards.length }}
            </span>
            <GripIcon class="size-4 text-muted/70" />
          </header>

          <Container
            class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-1"
            group-name="cards"
            :should-accept-drop="(source, payload) => source.groupName === 'cards' && !payload.loading"
            :get-child-payload="(index) => column.cards[index]"
            :remove-on-drop-out="options.removeOnDropOut"
            :drop-placeholder="
              options.placeholder && {
                className: 'dnd-placeholder mx-3 my-2',
                animationDuration: 150,
                showOnTop: true,
              }
            "
            drag-class="lifted"
            drop-class="dropping"
            @drop="onCardDrop(column, $event)"
          >
            <KanbanCard v-for="card in column.cards" :key="card.id" :card="card" :hover="options.hover" />
          </Container>
        </section>
      </Draggable>
    </Container>
  </DemoPage>
</template>
