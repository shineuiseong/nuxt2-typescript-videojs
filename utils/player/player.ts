import videoJs, { VideoJsPlayerOptions } from 'video.js'
import { propsConfig, Props, PropKey } from './props'
import { events, EventKey } from './events'
import type { VideoJsPlayer } from './type'

const standardizeClass = (className: string | void) => {
  const trimmed = className?.trim().replace(/\s+/g, ' ')
  return trimmed ? trimmed.split(' ') ?? [] : []
}

export interface CreatePlayerOptions {
  props: Props
  element: HTMLElement
  className?: string
  onEvent(eventName: EventKey, payload: Event): void
}

// eslint-disable-next-line no-use-before-define
export type PlayerResult = ReturnType<typeof createPlayer>
export const createPlayer = ({
  props,
  element,
  className,
  onEvent
}: CreatePlayerOptions) => {
  // Exclude fallback options.
  const { options: fallbackOptions = {}, ...optProps } = props

  // Exclude undefined value.
  const propOptions: Omit<Props, 'options'> = {}
  const optPropKeys = Object.keys(optProps) as Array<keyof typeof optProps>
  optPropKeys.forEach((key) => {
    const value = optProps[key]
    if (value !== undefined) {
      // @ts-ignore
      propOptions[key] = value
    }
  })

  // Merge fallback options & exclude component options.
  const { volume, playbackRate, ...initOptions } = {
    ...propOptions,
    ...fallbackOptions
  }

  // Merge some confusing prop names.
  const videoJsOptions = {
    ...initOptions,
    playsinline: initOptions.playsinline ?? initOptions.playsInline
  }

  const player = videoJs(element, videoJsOptions, function () {
    // Stringing video.js events to vue emits.
    events.forEach((eventKey: string | string[] | undefined) => {
      this.on(eventKey, (payload) => {
        // @ts-ignore
        onEvent(eventKey, payload)
      })
    })

    // init src
    if (initOptions.src && !initOptions.sources) {
      this.src(initOptions.src)
    }

    // init volume
    if (volume && Number.isFinite(volume)) {
      this.volume(volume)
    }

    // init playbackRate

    if (playbackRate && Number.isFinite(playbackRate)) {
      // Video always reads defaultPlaybackRate as the initial playbackRate when switching video sources.
      this.defaultPlaybackRate(playbackRate)
      // Ensures that all synchronization code has been executed by the time playbackRate is executed.
      setTimeout(() => {
        this.playbackRate(playbackRate)
      }, 0)
    }
  }) as VideoJsPlayer

  if (className) {
    standardizeClass(className).map((name) => player.addClass(name))
  }

  // Set new class names to Video.js container element.
  const updateClassNames = (
    oldClassName: string | void,
    newClassName: string | void
  ) => {
    standardizeClass(oldClassName).map((name) => player.removeClass(name))
    standardizeClass(newClassName).map((name) => player.addClass(name))
  }

  // Set new options to Video.js config.
  const updateOptions = (options: VideoJsPlayerOptions) => {
    player.options?.(options ?? {})
  }

  // Set new prop value to Video.js config.
  const updatePropOption = <K extends PropKey>(key: K, value: Props[K]) => {
    updateOptions({ [key]: value })
    propsConfig[key]?.onChange?.(player, value as never)
  }

  const disposePlayer = () => player.dispose()

  return {
    player,
    dispose: disposePlayer,
    updateClassNames,
    updateOptions,
    updatePropOption
  }
}
