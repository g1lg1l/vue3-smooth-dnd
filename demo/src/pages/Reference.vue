<script setup>
import { Container, Draggable } from 'vue3-smooth-dnd'
import DemoPage from '../components/DemoPage.vue'
import {
  containerEvents,
  containerProps,
  cssClasses,
  draggableProps,
  globals,
  stylingNotes,
} from '../data/reference'

const kebab = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

// names come from the components, so nothing can be missing; a missing entry in reference.js is flagged
const rows = (names, docs) => names.map((name) => ({ name, ...(docs[name] ?? { undocumented: true }) }))

const containerPropRows = rows(Object.keys(Container.props), containerProps)
const containerEventRows = rows(Object.keys(Container.emits), containerEvents)
const draggablePropRows = rows(Object.keys(Draggable.props), draggableProps)

const sections = [
  ['container', 'Container props'],
  ['events', 'Container events'],
  ['draggable', 'Draggable'],
  ['globals', 'Globals and types'],
  ['styling', 'Styling'],
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
</script>

<template>
  <DemoPage
    title="Reference"
    summary="Every prop, event and global of the two components, and what each one does."
  >
    <nav aria-label="Sections" class="mb-10 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      <a
        v-for="[id, label] in sections"
        :key="id"
        :href="`#/reference#${id}`"
        class="link"
        @click.prevent="scrollTo(id)"
      >
        {{ label }}
      </a>
    </nav>

    <section id="container" class="scroll-mt-20">
      <h2 class="text-2xl font-semibold tracking-tight">
        <code class="font-mono">&lt;Container&gt;</code> props
      </h2>
      <p class="mt-2 max-w-2xl text-muted">
        Use them in kebab-case in templates. All props except <code class="font-mono">orientation</code> are
        reactive.
      </p>
      <div class="mt-5 overflow-x-auto">
        <table data-testid="container-props" class="ref-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in containerPropRows" :key="row.name">
              <td>
                <code>{{ kebab(row.name) }}</code>
              </td>
              <td>
                <code>{{ row.type }}</code>
              </td>
              <td>
                <code v-if="row.default">{{ row.default }}</code>
              </td>
              <td :data-undocumented="row.undocumented || undefined">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="events" class="mt-14 scroll-mt-20">
      <h2 class="text-2xl font-semibold tracking-tight">
        <code class="font-mono">&lt;Container&gt;</code> events
      </h2>
      <p class="mt-2 max-w-2xl text-muted">
        The library never touches your DOM. Handle <code class="font-mono">drop</code>, update your data, and
        Vue re-renders.
      </p>
      <div class="mt-5 overflow-x-auto">
        <table data-testid="container-events" class="ref-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in containerEventRows" :key="row.name">
              <td>
                <code>@{{ row.name }}</code>
              </td>
              <td>
                <code v-if="row.payload">{{ row.payload }}</code>
              </td>
              <td :data-undocumented="row.undocumented || undefined">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="draggable" class="mt-14 scroll-mt-20">
      <h2 class="text-2xl font-semibold tracking-tight"><code class="font-mono">&lt;Draggable&gt;</code></h2>
      <p class="mt-2 max-w-2xl text-muted">
        Wraps one item and renders it with the class
        <code class="font-mono">smooth-dnd-draggable-wrapper</code>. Attributes and classes fall through to
        that element.
      </p>
      <div class="mt-5 overflow-x-auto">
        <table data-testid="draggable-props" class="ref-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in draggablePropRows" :key="row.name">
              <td>
                <code>{{ kebab(row.name) }}</code>
              </td>
              <td>
                <code>{{ row.type }}</code>
              </td>
              <td>
                <code v-if="row.default">{{ row.default }}</code>
              </td>
              <td :data-undocumented="row.undocumented || undefined">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="globals" class="mt-14 scroll-mt-20">
      <h2 class="text-2xl font-semibold tracking-tight">Globals and types</h2>
      <p class="mt-2 max-w-2xl text-muted">
        Everything is exported from <code class="font-mono">vue3-smooth-dnd</code>, for example
        <code class="font-mono">import { smoothDnD, type DropResult } from 'vue3-smooth-dnd'</code>.
      </p>
      <div class="mt-5 overflow-x-auto">
        <table class="ref-table">
          <thead>
            <tr>
              <th>Export</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in globals" :key="row.name">
              <td>
                <code>{{ row.name }}</code>
              </td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="styling" class="mt-14 scroll-mt-20">
      <h2 class="text-2xl font-semibold tracking-tight">Styling</h2>
      <div class="mt-5 overflow-x-auto">
        <table class="ref-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Where</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in cssClasses" :key="row.name">
              <td>
                <code>{{ row.name }}</code>
              </td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="mt-6 max-w-3xl space-y-3 text-sm text-muted">
        <li v-for="note in stylingNotes" :key="note" class="border-t border-line pt-3">{{ note }}</li>
      </ul>
    </section>
  </DemoPage>
</template>
