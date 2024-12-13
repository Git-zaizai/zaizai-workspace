const state = reactive({
	sum: 1
})

export const useStore = () => {

	return {
		state
	}
}