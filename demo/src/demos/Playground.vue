<script setup>
import { reactive } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import DemoPage from '../components/DemoPage.vue'
import EventLog from '../components/EventLog.vue'
import Field from '../components/Field.vue'
import GripIcon from '../components/GripIcon.vue'
import SelectField from '../components/SelectField.vue'
import ToggleField from '../components/ToggleField.vue'
import { useEventLog } from '../composables/useEventLog'
import { list } from '../data/mock'
import { applyDrag } from '../utils/applyDrag'

const options = reactive({
  hover: true,
  placeholder: false,
  ghostClasses: true,
  dragHandle: false,
  removeOnDropOut: false,
  filter: false, // a CSS filter on the lists: an ancestor like that used to offset the drag ghost
  lockAxis: '',
  dragBeginDelay: 0,
  animationDuration: 250,
})

const axes = [
  { value: '', label: 'none' },
  { value: 'x', label: 'x' },
  { value: 'y', label: 'y' },
]

const lists = reactive({ A: list(6, 'A'), B: list(4, 'B') })
const { entries, clear, listeners } = useEventLog()
const onDrop = (name) => (dropResult) => (lists[name] = applyDrag(lists[name], dropResult))
</script>

<template>
  <DemoPage>
    <template #controls>
      <ToggleField v-model="options.hover" label="Hover styles" />
      <ToggleField v-model="options.placeholder" label="Drop placeholder" />
      <ToggleField v-model="options.ghostClasses" label="Ghost classes" />
      <ToggleField v-model="options.dragHandle" label="Drag handle only" />
      <ToggleField v-model="options.removeOnDropOut" label="removeOnDropOut" />
      <ToggleField v-model="options.filter" label="Filter on ancestor" />
      <SelectField v-model="options.lockAxis" label="lockAxis" :options="axes" />
      <Field label="dragBeginDelay" suffix="ms">
        <input
          v-model.number="options.dragBeginDelay"
          type="number"
          min="0"
          step="50"
          class="control w-24 pr-9"
        />
      </Field>
      <Field label="animationDuration" suffix="ms">
        <input
          v-model.number="options.animationDuration"
          type="number"
          min="0"
          step="50"
          class="control w-24 pr-9"
        />
      </Field>
    </template>

    <div class="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_1fr_minmax(20rem,1.15fr)]">
      <section v-for="name in ['A', 'B']" :key="name" class="flex min-h-0 flex-col">
        <h2 class="mb-2 shrink-0 text-sm font-medium">List {{ name }}</h2>
        <Container
          v-bind="listeners(name, { onDrop: onDrop(name) })"
          :data-testid="`list-${name}`"
          class="dnd-list min-h-0 flex-1 overflow-y-auto"
          :class="{ 'drop-shadow-2xl': options.filter }"
          group-name="playground"
          :get-child-payload="(index) => lists[name][index]"
          :remove-on-drop-out="options.removeOnDropOut"
          :lock-axis="options.lockAxis || undefined"
          :drag-begin-delay="options.dragBeginDelay"
          :animation-duration="options.animationDuration"
          :drag-handle-selector="options.dragHandle ? '.handle' : undefined"
          :drop-placeholder="
            options.placeholder && { className: 'dnd-placeholder my-1', animationDuration: 150 }
          "
          :drag-class="options.ghostClasses ? 'lifted' : undefined"
          :drop-class="options.ghostClasses ? 'dropping' : undefined"
        >
          <Draggable v-for="item in lists[name]" :key="item.id">
            <div class="dnd-item" :class="{ 'dnd-item-hover': options.hover }">
              <GripIcon
                class="handle size-4 shrink-0"
                :class="options.dragHandle ? 'text-lift' : 'text-muted'"
              />
              {{ item.text }}
            </div>
          </Draggable>
        </Container>
      </section>

      <EventLog :entries="entries" @clear="clear" />
    </div>
  </DemoPage>
</template>
