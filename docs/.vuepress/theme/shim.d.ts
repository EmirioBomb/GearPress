declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.less'