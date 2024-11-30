export const content = () => {
  const state = reactive({
    sum: 1,
  })

  return {
    state,
  }
}
