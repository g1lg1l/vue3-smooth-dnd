import { defineComponent, h } from 'vue'
import { constants } from '../smooth-dnd'
import { resolveTag, tagProp } from '../utils'

export default defineComponent({
  name: 'Draggable',
  props: {
    tag: tagProp,
  },
  setup(props, { slots }) {
    return () => {
      const { value, props: tagProps } = resolveTag(props.tag, constants.wrapperClass)
      return h(value, tagProps, slots.default?.())
    }
  },
})
