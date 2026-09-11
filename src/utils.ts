import type { Component, PropType } from 'vue'

/** `tag` can be a tag name / component, or `{ value, props }` to also pass props to the root element. */
export interface TagObject {
  value?: string | Component
  props?: Record<string, unknown>
}
export type Tag = string | TagObject

export const tagProp = {
  type: [String, Object] as PropType<Tag>,
  default: 'div',
}

export function resolveTag(tag: Tag | undefined, extraClass?: string) {
  const value = (typeof tag === 'object' ? tag.value : tag) || 'div'
  const props: Record<string, unknown> = typeof tag === 'object' && tag.props ? { ...tag.props } : {}
  if (extraClass) {
    props.class = props.class ? [extraClass, props.class] : extraClass
  }
  return { value, props }
}
