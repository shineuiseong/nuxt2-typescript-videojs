import type { VideoJsPlayer as Player } from 'video.js/index'

export interface VideoJsPlayer extends Player {
  playbackRates(newRates?: number[]): number[]
}
