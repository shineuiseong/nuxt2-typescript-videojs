import videojs from 'video.js'
import type { VideoJsPlayerOptions } from 'video.js'
import type { VideoJsPlayer } from './type'

type PropType<T = any> = { (): T }
type InferPropType<T> = T extends PropType<infer V> ? V : T

const prop = <T>(options: {
  type: PropType<T>
  default?: any
  onChange?: (player: VideoJsPlayer, newValue: T, oldValue?: T) => any
  onEvent?: (player: VideoJsPlayer, callback: (newValue: T) => void) => any
}) => options

const videoProps = {
  src: prop({
    type: String,
    onChange: (player, src) => player.src(src)
  }),
  width: prop({
    type: Number,
    onChange: (player, width) => player.width(width),
    onEvent: (player, cb) => {
      player.on(['playerresize', 'resize'], () => cb(player.width()))
    }
  }),
  height: prop({
    type: Number,
    onChange: (player, height) => player.height(height),
    onEvent: (player, cb) => {
      player.on(['playerresize', 'resize'], () => cb(player.height()))
    }
  }),
  preload: prop({
    type: String as PropType<'auto' | 'metadata' | 'none'>,
    onChange: (player, preload) => player.preload(preload as any)
  }),
  loop: prop({
    type: Boolean,
    onChange: (player, loop) => player.loop(loop)
  }),
  play: prop({
    type: Boolean,
    onChange: (player) => player.play()
  }),
  muted: prop({
    type: Boolean,
    onChange: (player, muted) => player.muted(muted),
    onEvent: (player, cb) => player.on('volumechange', () => cb(player.muted()))
  }),
  poster: prop({
    type: String,
    onChange: (player, poster) => player.poster(poster),
    onEvent: (player, cb) =>
      player.on('posterchange', () => cb(player.poster()))
  }),
  controls: prop({
    type: Boolean,
    onChange: (player, controls) => player.controls(controls),
    onEvent: (player, cb) => {
      player.on('controlsenabled', () => cb(true))
      player.on('controlsdisabled', () => cb(false))
    }
  }),

  autoplay: prop({
    type: [Boolean, String] as unknown as PropType<
      boolean | 'muted' | 'play' | 'any'
    >,
    onChange: (player, autoplay) => player.autoplay(autoplay)
  }),

  crossorigin: prop({
    type: String,
    onChange: (player, value) => player.crossOrigin(value as any)
  }),
  crossOrigin: prop({
    type: String,
    onChange: (player, value) => player.crossOrigin(value as any)
  }),
  playsinline: prop({
    type: Boolean,
    onChange: (player, value) => player.playsinline(value)
  }),
  playsInline: prop({
    type: Boolean,
    onChange: (player, value) => player.playsinline(value)
  })
}

const videoJsProps = {
  id: prop({ type: String }),
  sources: prop({
    type: Array as PropType<NonNullable<VideoJsPlayerOptions['sources']>>,
    onChange: (player, sources) => player.src(sources)
  }),
  tracks: prop({
    type: Array as PropType<NonNullable<VideoJsPlayerOptions['tracks']>>,
    onChange: (player, newTracks) => {
      const oldTracks = player.remoteTextTracks()
      let index = oldTracks?.length || 0
      while (index--) {
        player.removeRemoteTextTrack(
          oldTracks[index] as any as HTMLTrackElement
        )
      }
      // Add new text tracks.
      player.ready(() => {
        newTracks.forEach((track) => player.addRemoteTextTrack(track, false))
      })
    }
  }),
  textTrackSettings: prop({
    type: Object as PropType<
      NonNullable<VideoJsPlayerOptions['textTrackSettings']>
    >,
    onChange: (player, value) =>
      (player as any).textTrackSettings.options(value)
  }),
  language: prop({
    type: String,
    onChange: (player, language) => player.language(language),
    onEvent: (player, cb) =>
      player.on('languagechange', () => cb(player.language()))
  }),

  languages: prop({
    type: Object as PropType<NonNullable<VideoJsPlayerOptions['languages']>>
  }),
  playbackRates: prop({
    type: Array as PropType<NonNullable<VideoJsPlayerOptions['playbackRates']>>,
    onChange: (player, newRates) => player.playbackRates(newRates ?? []),
    onEvent: (player, cb) => {
      player.on('playbackrateschange', () => cb(player.playbackRates()))
    }
  }),
  audioOnlyMode: prop({
    type: Boolean,
    onChange: (player, value) => player.audioOnlyMode(value)
  }),
  audioPosterMode: prop({
    type: Boolean,
    onChange: (player, value) => player.audioPosterMode(value)
  }),
  responsive: prop({
    type: Boolean,
    onChange: (player, value) => player.responsive(value)
  }),
  breakpoints: prop({
    type: Object as PropType<Partial<videojs.Breakpoint>>,
    onChange: (player, value) => player.breakpoints(value)
  }),
  fluid: prop({
    type: Boolean,
    onChange: (player, value) => player.fluid(value)
  }),

  fill: prop({
    type: Boolean,
    onChange: (player, value) => player.fill(value)
  }),
  aspectRatio: prop({
    type: String,
    onChange: (player, ratio) => player.aspectRatio(ratio)
  }),

  fullscreen: prop({
    type: Object as PropType<NonNullable<VideoJsPlayerOptions['fullscreen']>>
  }),
  liveui: prop({ type: Boolean }),
  liveTracker: prop({
    type: Object as PropType<
      Partial<{
        trackingThreshold: number
        liveTolerance: number
        [key: string]: any
      }>
    >
  }),
  disablePictureInPicture: prop({
    type: Boolean,
    onChange: (player, value) => player.disablePictureInPicture(value)
  }),
  notSupportedMessage: prop({ type: String }),
  normalizeAutoplay: prop({ type: Boolean }),
  noUITitleAttributes: prop({ type: Boolean }),
  preferFullWindow: prop({ type: Boolean }),
  suppressNotSupportedError: prop({ type: Boolean }),
  techCanOverridePoster: prop({ type: Boolean }),
  reportTouchActivity: prop({ type: Boolean }),
  techOrder: prop({ type: Array as PropType<Array<string>> }),

  inactivityTimeout: prop({ type: Number }),
  userActions: prop({
    type: Object as PropType<NonNullable<VideoJsPlayerOptions['userActions']>>
  }),

  plugins: prop({
    type: Object as PropType<NonNullable<VideoJsPlayerOptions['plugins']>>
  }),
  restoreEl: prop({
    type: [Boolean, Object] as unknown as PropType<boolean | Element>
  }),
  'vtt.js': prop({ type: String })
}

const videoJsComponentProps = {
  children: prop({
    type: [Array, Object] as unknown as PropType<
      NonNullable<VideoJsPlayerOptions['children']>
    >
  }),

  controlBar: prop({
    type: Object as PropType<NonNullable<VideoJsPlayerOptions['controlBar']>>,
    onChange: (player, value) => player.controlBar.options(value)
  })
}

const videoJsTechProps = {
  html5: prop({
    type: Object as PropType<
      Partial<{
        vhs: any
        nativeControlsForTouch: boolean
        nativeAudioTracks: boolean
        nativeTextTracks: boolean
        nativeVideoTracks: boolean
        preloadTextTracks: boolean
      }>
    >
  })
}

const componentProps = {
  volume: prop({
    type: Number,
    onChange: (player, volume) => player.volume(volume),
    onEvent: (player, cb) =>
      player.on('volumechange', () => cb(player.volume()))
  }),
  playbackRate: prop({
    type: Number,
    onChange(player, rate) {
      player.playbackRate(rate)
      player.defaultPlaybackRate(rate)
    },
    onEvent(player, callback) {
      player.on('ratechange', () => {
        callback(player.playbackRate())
      })
    }
  }),
  options: prop({
    type: Object as PropType<VideoJsPlayerOptions>
  })
}

export const propsConfig = {
  ...videoProps,
  ...videoJsProps,
  ...videoJsComponentProps,
  ...videoJsTechProps,
  ...componentProps
} as const

export type PropsConfig = typeof propsConfig
export type PropKey = keyof PropsConfig
export type Props = {
  [K in PropKey]?: InferPropType<(typeof propsConfig)[K]['type']>
}

export const propKeys = Object.keys(propsConfig) as Array<PropKey>
