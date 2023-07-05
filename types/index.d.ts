import { NuxtApp } from '@nuxt/types/app'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $axios: NuxtAxiosInstance

  }

  interface Context {
    $axios: NuxtAxiosInstance
  }
}
declare global {
  const $nuxt: NuxtApp
}
