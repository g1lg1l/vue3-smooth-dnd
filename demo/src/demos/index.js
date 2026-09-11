/**
 * Every demo registers here once. The router, the sidebar and each page header are built from this list.
 * `component` is lazy so every demo ships as its own chunk.
 */
export const groups = [
  {
    title: 'Showcase',
    demos: [
      {
        path: '/kanban',
        title: 'Kanban board',
        summary:
          'Draggable columns holding draggable cards. Nested containers, a drag handle, drop placeholders and ghost classes in one board.',
        file: 'Kanban.vue',
        fill: true,
        component: () => import('./Kanban.vue'),
      },
    ],
  },
  {
    title: 'Options',
    demos: [
      {
        path: '/playground',
        title: 'Playground',
        summary:
          'Two lists in one group with every option switchable while you drag, and a log of everything the containers emit.',
        file: 'Playground.vue',
        fill: true,
        component: () => import('./Playground.vue'),
      },
    ],
  },
  {
    title: 'Scenarios',
    demos: [
      {
        path: '/copy-contain',
        title: 'Copy into contain',
        summary:
          'A copy source feeding a contain target whose items get deleted again. The next drop must report addedIndex 0.',
        file: 'CopyContain.vue',
        fill: true,
        component: () => import('./CopyContain.vue'),
      },
      {
        path: '/auto-scroll',
        title: 'Auto scroll',
        summary:
          'Dragging within 100px of an edge scrolls the window, a scrollable element or a horizontal strip.',
        file: 'AutoScroll.vue',
        component: () => import('./AutoScroll.vue'),
      },
    ],
  },
]

export const demos = groups.flatMap((group) => group.demos)

export const repo = 'https://github.com/g1lg1l/vue3-smooth-dnd'
export const sourceUrl = (file) => `${repo}/blob/main/demo/src/demos/${file}`
