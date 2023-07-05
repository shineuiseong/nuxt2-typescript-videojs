<template>
  <div>
    <video ref="videoElement" class="video-js v-video-player"></video>
    <slot
      v-if="mounted"
      name="videoSlot"
      :video="videoElement"
      :player="videoJsPlayer"
      :state="readOnlyState"
    ></slot>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  shallowRef,
  ref,
  computed,
  readonly,
  watch,
  toRaw,
  DeepReadonly,
  defineProps,
  defineEmits
} from 'vue'

import {
  createPlayer,
  createPlayerState,
  propKeys,
  PlayerState,
  PlayerResult
} from '~/utils/player'
import {
  normalizedEvents,
  normalizedProps,
  bindPropUpdateEvent
} from '~/utils/player/helper'

import './videoPlayer.css'

// eslint-disable-next-line vue/require-default-prop
const props = defineProps({ ...normalizedProps, className: String })
const emits = defineEmits([...normalizedEvents, 'mounted', 'unmounted'])

const mounted = shallowRef(false)
const videoElement = shallowRef<HTMLVideoElement | null>(null)
const playerResult = shallowRef<PlayerResult | null>(null)
const videoJsPlayer = computed(() => {
  return playerResult.value ? playerResult.value.player : null
})

const state = ref<PlayerState | null>(null)
const readOnlyState = computed<DeepReadonly<PlayerState> | null>(() => {
  return state.value ? readonly(state.value) : null
})

onMounted(() => {
  // create player
  const { className: _, ...rawProps } = toRaw(props)
  const playerRes = createPlayer({
    element: videoElement.value!,
    props: rawProps,
    onEvent: emits
  })

  // Sync Video.js config change to update:prop event.
  bindPropUpdateEvent({
    player: playerRes.player,
    onEvent: emits
  })

  // Sync Vue class name to Video.js container.
  watch(
    () => props.className,
    (newClassName, oldClassName) => {
      playerRes.updateClassNames(oldClassName, newClassName)
    },
    { immediate: true }
  )

  // Sync fallback options to Video.js config.
  watch(
    () => props.options,
    (newOptions) => playerRes.updateOptions(newOptions ?? {}),
    { deep: true }
  )

  // Sync component props to Video.js config.
  propKeys
    .filter((key) => key !== 'options')
    .forEach((key) => {
      watch(
        () => props[key],
        (newValue) => playerRes.updatePropOption(key, newValue),
        { deep: true }
      )
    })

  // create player state
  createPlayerState(playerRes.player, {
    onInit(initState) {
      state.value = initState
    },
    onUpdate(key, value) {
      if (state.value) {
        state.value[key] = value
      }
    }
  })

  // emit mounted event
  playerResult.value = playerRes
  mounted.value = true
  emits('mounted', {
    video: videoElement.value,
    player: videoJsPlayer.value,
    state: readOnlyState.value
  })
})

onBeforeUnmount(() => {
  if (playerResult.value) {
    playerResult.value.dispose()
    playerResult.value = null
    state.value = null
    emits('unmounted')
  }
})

// TODO: 외부 호출용 이벤트 (autoPlay 정책상 안되므로 구현)
const videoPlay = () => {
  if (videoJsPlayer.value) {
    videoJsPlayer.value?.play()
  }
}

defineExpose({ videoPlay })
</script>
