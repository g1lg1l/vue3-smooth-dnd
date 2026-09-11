/**
 * Applies a Container `drop` result to an array and returns the new array.
 * Works for the source container (removedIndex set), the target (addedIndex set) and reordering (both set).
 */
export function applyDrag(items, { removedIndex, addedIndex, payload }) {
  if (removedIndex === null && addedIndex === null) return items
  const result = [...items]
  const item = removedIndex !== null ? result.splice(removedIndex, 1)[0] : payload
  if (addedIndex !== null) result.splice(addedIndex, 0, item)
  return result
}
