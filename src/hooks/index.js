// 提供复用逻辑的函数（钩子）
// target DOM对象 api 含税
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export const useLazyData = (apiFn) => {
//   const targetIsVisible = ref(false)
  const result = ref([])
  const target = ref(null)

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
    //   targetIsVisible.value = isIntersecting
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    { threshold: 0 }
  )
  return { result, target }
}
