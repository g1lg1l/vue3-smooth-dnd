import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import { constants, dropHandlers, smoothDnD } from '../smooth-dnd'
import { defaultOptions } from '../smooth-dnd/defaults'
import type {
  ContainerOptions,
  DragEndParams,
  DragStartParams,
  DropPlaceholderOptions,
  DropResult,
  SmoothDnD,
} from '../smooth-dnd'
import { resolveTag, tagProp } from '../utils'

// Vue owns the DOM: smooth-dnd must only report drops, never move nodes or wrap children itself.
smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler
smoothDnD.wrapChild = false

export default defineComponent({
  name: 'Container',
  props: {
    /** Read once at mount. Re-key the component to change it. */
    orientation: String as PropType<'vertical' | 'horizontal'>,
    behaviour: String as PropType<'move' | 'copy' | 'drop-zone' | 'contain'>,
    groupName: String,
    lockAxis: String as PropType<'x' | 'y'>,
    dragHandleSelector: String,
    nonDragAreaSelector: String,
    dragBeginDelay: Number,
    animationDuration: Number,
    autoScrollEnabled: { type: Boolean, default: true },
    removeOnDropOut: Boolean,
    dragClass: String,
    dropClass: String,
    dropPlaceholder: [Object, Boolean] as PropType<DropPlaceholderOptions | boolean>,
    getChildPayload: Function as PropType<(index: number) => any>,
    shouldAnimateDrop: Function as PropType<
      (sourceContainerOptions: ContainerOptions, payload: any) => boolean
    >,
    shouldAcceptDrop: Function as PropType<
      (sourceContainerOptions: ContainerOptions, payload: any) => boolean
    >,
    getGhostParent: Function as PropType<() => HTMLElement>,
    tag: tagProp,
  },
  emits: {
    drop: (_result: DropResult) => true,
    'drag-start': (_params: DragStartParams) => true,
    'drag-end': (_params: DragEndParams) => true,
    'drag-enter': () => true,
    'drag-leave': () => true,
    'drop-ready': (_result: DropResult) => true,
  },
  setup(props, { slots, emit }) {
    const el = ref<HTMLElement>()
    let instance: SmoothDnD | undefined
    // Vue owns `class` on the root element: classes smooth-dnd only adds to the DOM would be wiped by the next class patch
    const runtimeClasses = [constants.containerClass, props.orientation || defaultOptions.orientation]

    const buildOptions = (): ContainerOptions => {
      const { tag: _tag, ...options } = props
      return {
        ...options,
        onDragStart: (params) => emit('drag-start', params),
        onDragEnd: (params) => emit('drag-end', params),
        onDrop: (result) => emit('drop', result),
        onDragEnter: () => emit('drag-enter'),
        onDragLeave: () => emit('drag-leave'),
        onDropReady: (result) => emit('drop-ready', result),
      }
    }

    onMounted(() => {
      instance = smoothDnD(el.value!, buildOptions())
    })
    watch(
      () => ({ ...props }),
      () => instance?.setOptions(buildOptions(), false),
    )
    onBeforeUnmount(() => instance?.dispose())

    return () => {
      const { value, props: tagProps } = resolveTag(props.tag)
      return h(value, { ...tagProps, class: [tagProps.class, ...runtimeClasses], ref: el }, slots.default?.())
    }
  },
})
