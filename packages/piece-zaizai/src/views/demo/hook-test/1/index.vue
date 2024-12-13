<template>
	<h1>方法1：直接在 store中定于全局</h1>
	<div class="flex-y-center w-full gap-10px">
		<div class="flex-y-center gap-10px">
			<h1>父组件：</h1>
			content.sum {{ state.sum }}
			<n-button
					type="success"
					@click="state.sum++"
			>点击
			</n-button
			>
		</div>
		<div class="h-10 w-2px bg-amber mx-10"></div>
		<Zi />
	</div>
</template>

<script
		setup
		lang="ts"
>
import { useStore } from './store'

import Zi from './zi-1.vue'

const { state } = useStore()
</script>

<style scoped></style>
