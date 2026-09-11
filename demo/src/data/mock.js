const words =
  'sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam quia voluptas aspernatur aut odit fugit consequuntur magni dolores eos qui ratione sequi nesciunt neque porro quisquam est dolorem ipsum dolor amet consectetur adipisci velit non numquam eius modi tempora incidunt labore magnam aliquam quaerat minima veniam nostrum exercitationem ullam corporis suscipit laboriosam aliquid ex ea commodi consequatur'.split(
    ' ',
  )

const emojis = [...'🎈🪁🧩🎲🧸🎨🎧🎸🎯🛼🪀🧭🔭🛠️🧲🪄🎁🍉🍋🥑🌿🌵🍄🐙🦊🐝🦋🐢🪐🌙']

export const tags = [
  { name: 'Design', classes: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
  { name: 'Bug', classes: 'bg-rose-500/15 text-rose-700 dark:text-rose-300' },
  { name: 'Docs', classes: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
  { name: 'Feature', classes: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
]

const columnColors = ['#5b4fe9', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#14b8a6', '#8b5cf6', '#ff6b35']

const random = (n) => Math.floor(Math.random() * n)

export const phrase = (count) => {
  let index = random(words.length)
  return Array.from({ length: Math.ceil(count) }, () => words[index++ % words.length]).join(' ')
}

export const emoji = () => emojis[random(emojis.length)]

/** `count` simple items: `{ id, text }`. */
export const list = (count, prefix = 'Item') =>
  Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: `${prefix} ${i + 1}` }))

/** Kanban columns. The first one always has enough cards to scroll. */
export const columns = (count) =>
  Array.from({ length: count }, (_, c) => ({
    id: `column-${c}`,
    name: phrase(random(2) + 1),
    color: columnColors[c % columnColors.length],
    cards: Array.from({ length: c === 0 ? 12 : random(6) + 4 }, (_, i) => ({
      id: `card-${c}-${i}`,
      number: c * 100 + i + 1,
      emoji: emoji(),
      tag: tags[random(tags.length)],
      text: phrase(random(9) + 3),
      loading: false,
    })),
  }))
