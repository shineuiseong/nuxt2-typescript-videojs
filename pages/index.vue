<template>
  <div>
    <VideoPlayer
      ref="video"
      :src="videoSrc"
      :width="800"
      :height="800"
      controls
      loop
      muted
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import VideoPlayer from '~/components/VideoPlayer.vue'

const videoSrc = '/exampleVideo.mp4'
const video = ref<any>(null)
/**
 *  muted props 설정하면 자동재생이 된다
 * https://github.com/surmon-china/videojs-player 참고
 *
 * */
</script>
