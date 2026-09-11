/**
 * Descriptions for the Reference page. The prop and event *names* come from the components at runtime
 * (`Container.props`, `Container.emits`, `Draggable.props`), so a prop added to the library without an entry
 * here shows up as undocumented instead of missing. Keep the wording in sync with README.md.
 */

export const containerProps = {
  orientation: {
    type: `'vertical' | 'horizontal'`,
    default: `'vertical'`,
    description: 'Layout direction of the container. Read once at mount; re-key the component to change it.',
  },
  behaviour: {
    type: `'move' | 'copy' | 'drop-zone' | 'contain'`,
    default: `'move'`,
    description:
      'What happens to the dragged item. move: it leaves this container. copy: it stays here and a copy is dropped elsewhere. drop-zone: this container accepts drops without sorting, addedIndex is always 0. contain: items can only be reordered inside this container.',
  },
  groupName: {
    type: 'string',
    description:
      'Containers sharing a group name accept each other’s items. Without one a container only sorts its own items. should-accept-drop overrides this.',
  },
  lockAxis: {
    type: `'x' | 'y'`,
    description: 'Restrict the ghost to one axis while dragging.',
  },
  dragHandleSelector: {
    type: 'string',
    description: 'CSS selector. A drag only starts from a matching element inside the draggable.',
  },
  nonDragAreaSelector: {
    type: 'string',
    description:
      'CSS selector. Matching elements never start a drag, for buttons and inputs inside items. Wins over drag-handle-selector.',
  },
  dragBeginDelay: {
    type: 'number',
    default: '0',
    description:
      'Milliseconds to hold before the drag starts, 200 on touch devices when unset. Moving more than 5px during the delay cancels it.',
  },
  animationDuration: {
    type: 'number',
    default: '250',
    description: 'Duration in ms of the reorder animation and of the drop animation.',
  },
  autoScrollEnabled: {
    type: 'boolean',
    default: 'true',
    description:
      'Scroll scrollable ancestors and the window when the pointer is within 100px of an edge. Add the class smooth-dnd-prevent-auto-scroll-class to an element to keep it still.',
  },
  removeOnDropOut: {
    type: 'boolean',
    default: 'false',
    description:
      'When the item is dropped outside every relevant container, emit drop with a removedIndex instead of animating it back.',
  },
  dragClass: {
    type: 'string',
    description:
      'Class added to the ghost’s element while dragging. It is added after the ghost is in the DOM, so transitions run.',
  },
  dropClass: {
    type: 'string',
    description: 'Class added to the ghost’s element when the drop animation starts.',
  },
  dropPlaceholder: {
    type: 'boolean | { className?, animationDuration?, showOnTop? }',
    description:
      'Show a placeholder where the item would land. className styles it, animationDuration moves it smoothly, showOnTop renders it above the items.',
  },
  getChildPayload: {
    type: '(index: number) => any',
    description:
      'Returns the payload for the item at index. It travels with the drag and arrives in every event, so the target knows what was dropped.',
  },
  shouldAnimateDrop: {
    type: '(sourceOptions, payload) => boolean',
    description: 'Return false to skip the drop animation for this drop.',
  },
  shouldAcceptDrop: {
    type: '(sourceOptions, payload) => boolean',
    description:
      'Called on every container when a drag starts. Return whether this container accepts the item; overrides group-name.',
  },
  getGhostParent: {
    type: '() => HTMLElement',
    description:
      'Element the ghost is appended to. By default the container itself, or body when a transformed ancestor would offset the ghost.',
  },
  tag: {
    type: 'string | Component | { value, props }',
    default: `'div'`,
    description: 'Root element or component. Attributes and classes on the component fall through to it.',
  },
}

const dropResult = '{ removedIndex, addedIndex, payload, element }'
const dragParams = '{ isSource, payload, willAcceptDrop }'

export const containerEvents = {
  drop: {
    payload: dropResult,
    description:
      'After the drop animation, from the source container with removedIndex and from the target container with addedIndex. Both are set when reordering inside one container, null when not applicable.',
  },
  'drop-ready': {
    payload: dropResult,
    description: 'From the hovered container every time the index where the item would land changes.',
  },
  'drag-start': {
    payload: dragParams,
    description: 'From every container when a drag starts. isSource tells which one the item comes from.',
  },
  'drag-end': {
    payload: dragParams,
    description: 'From every container when a drag ends, right before drop.',
  },
  'drag-enter': {
    payload: '',
    description: 'From a container when the ghost enters it.',
  },
  'drag-leave': {
    payload: '',
    description: 'From a container when the ghost leaves it.',
  },
}

export const draggableProps = {
  tag: containerProps.tag,
}

export const globals = [
  { name: 'smoothDnD.isDragging()', description: 'Whether a drag is in progress.' },
  {
    name: 'smoothDnD.cancelDrag()',
    description: 'Abort the current drag; everything animates back to where it was.',
  },
  { name: 'smoothDnD.maxScrollSpeed', description: 'Auto scroll speed in px/s. Default 1500.' },
  {
    name: 'smoothDnD.useTransformForGhost',
    description: 'Move the ghost with translate3d instead of top/left. Default false.',
  },
  { name: 'constants', description: 'The class names listed under Styling, as constants.' },
  {
    name: 'DropResult, DragStartParams, DragEndParams, ContainerOptions, DropPlaceholderOptions',
    description: 'TypeScript types for the event payloads and options.',
  },
]

export const cssClasses = [
  {
    name: 'smooth-dnd-container',
    description: 'On every container root, together with vertical or horizontal.',
  },
  { name: 'smooth-dnd-draggable-wrapper', description: 'On every Draggable root.' },
  {
    name: 'smooth-dnd-ghost',
    description: 'On the element that follows the pointer, a clone of the wrapper.',
  },
  { name: 'smooth-dnd-dragging', description: 'On body while a drag is running.' },
  {
    name: 'smooth-dnd-drop-preview-constant-class',
    description:
      'On the drop placeholder wrapper; your dropPlaceholder.className goes on the element inside it.',
  },
  {
    name: 'smooth-dnd-prevent-auto-scroll-class',
    description: 'Add it to an element to exclude it from auto scroll.',
  },
]

export const stylingNotes = [
  'A style block with the required layout rules is injected once. It is unlayered: position: relative and min-height: 30px on containers, display: table on horizontal ones, display: block and overflow: hidden on wrappers in vertical ones. With cascade layers such as Tailwind 4 utilities, an unlayered rule always wins, so use the important modifier (flex!, min-h-64!), an inline style or an unlayered rule of your own to override them.',
  'While dragging, draggables get pointer-events: none so hover styles do not fire on the items under the ghost. Restore them with .smooth-dnd-dragging .smooth-dnd-draggable-wrapper { pointer-events: auto }.',
  'The ghost is position: fixed. An ancestor with transform, filter, perspective or contain would offset it, so the ghost is re-parented to body when that is detected, unless get-ghost-parent is set.',
  'Keep margins on the element inside a Draggable, not on the Draggable itself: the ghost is a clone of the wrapper and a margin would offset it.',
]
