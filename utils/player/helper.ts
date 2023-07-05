import type { PropsConfig, PropKey, EventKey, VideoJsPlayer } from './index'
import { propsConfig, propKeys, events } from './index'

const twoWayPropKeys = propKeys.filter((key) =>
  Boolean(propsConfig[key].onEvent)
)
const getPropUpdateEventName = (key: PropKey) => `update:${key}`

export const bindPropUpdateEvent = (options: {
  player: VideoJsPlayer
  onEvent: (key: EventKey, value: any) => void
}) => {
  twoWayPropKeys.forEach((key) => {
    propsConfig[key]?.onEvent?.(options.player, (newValue: unknown) => {
      options.onEvent(getPropUpdateEventName(key) as EventKey, newValue)
    })
  })
}

export const normalizedEvents = [
  ...events,
  ...twoWayPropKeys.map(getPropUpdateEventName)
] as typeof events

export const normalizedProps = propKeys.reduce((result, key) => {
  const prop = propsConfig[key]
  const types = Array.isArray(prop.type) ? prop.type : [prop.type]
  const newProp = { ...prop }
  if (types.includes(Boolean)) {
    // eslint-disable-next-line no-void
    newProp.default = void 0
  }

  return { ...result, [key]: newProp }
}, {} as PropsConfig)
