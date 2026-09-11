import { ref } from 'vue'

const timestamp = () => {
  const now = new Date()
  return `${now.toLocaleTimeString('en-GB', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`
}

// DOM nodes inside a drop result are noise in a log line
const replacer = (_key, value) => (value instanceof Node ? `<${value.nodeName.toLowerCase()}>` : value)

let nextId = 0

/**
 * Collects Container events, newest first.
 * `listeners(source, handlers)` returns `onDrop`, `onDragStart`, … for `v-bind` on a <Container>: each event is
 * logged, then forwarded to the matching handler if there is one.
 */
export function useEventLog() {
  const entries = ref([])

  const clear = () => {
    entries.value = []
  }

  const log = (source, event, detail) => {
    entries.value.unshift({
      id: nextId++,
      time: timestamp(),
      source,
      event,
      detail: detail === undefined ? '' : JSON.stringify(detail, replacer),
    })
    if (entries.value.length > 200) entries.value.length = 200
  }

  const listeners = (source, handlers = {}) => {
    const wrap = (event, key) => (payload) => {
      log(source, event, payload)
      handlers[key]?.(payload)
    }
    return {
      onDragStart: wrap('drag-start', 'onDragStart'),
      onDragEnd: wrap('drag-end', 'onDragEnd'),
      onDragEnter: wrap('drag-enter', 'onDragEnter'),
      onDragLeave: wrap('drag-leave', 'onDragLeave'),
      onDropReady: wrap('drop-ready', 'onDropReady'),
      onDrop: wrap('drop', 'onDrop'),
    }
  }

  return { entries, log, clear, listeners }
}
