# element plus 动态 columns 

```vue
// columns-el.vue
<template>
	<div>
		<el-table :data="data">
			<component
					v-for="item in tableColumns"
					:is="item"
					v-bind="item"
			></component>
		</el-table>
	</div>
</template>

<script lang="tsx">
import { ElTable, ElTableColumn } from 'element-plus'
import { isVNode } from 'vue'

export default {
	components: { ElTableColumn, ElTable },
	props: {
		columns: Array,
		data: Array,
	},
	data() {
		return []
	},
	computed: {
		tableColumns() {
			let slots = this.$slots.default()
			console.log()

			let list = [...slots, ...this.columns]
			return list.map(slot => {
				if (isVNode(slot)) {
					return slot
				}
				if (typeof slot.render === 'function') {
					return (
						<ElTableColumn { ...slot }>
							{ {
								default: scoped => {
									if (!slot.render) {
										return scoped.row[slot.key]
									}
									if (typeof slot.render === 'function') {
										return slot.render(scoped)
									} else if (typeof slot.render === 'string') {
										return slot.render
									}
								},
							} }
						</ElTableColumn>
					)
				} else if (typeof slot.render === 'string') {
					return <ElTableColumn { ...slot }>{ slot.render }</ElTableColumn>
				}
			})
		},
		/*tableColumns() {
		 let slots: [] = this.$slots.default() ?? []

		 slots = slots.map(slot => {
		 slot.
		 })
		 return slots.concat(this.columns.map(column => {
		 return (
		 <ElTableColumn { ...column }>
		 { {
		 default: (scoped) => {
		 if (!column.render) {
		 return scoped.row[column.key]
		 }
		 if (typeof column.render === 'function') {
		 return column.render(scoped)
		 } else if (typeof column.render === 'string') {
		 return column.render
		 }
		 }
		 } }
		 </ElTableColumn>
		 )
		 }))
		 }*/
	},
}
</script>

```


```vue
// 父组件

<template>
	<div>
		<ColumnsEl
				:data="data"
				:columns="columns"
		>
			<el-table-column
					label="Name"
					width="180"
			>
				<template #default="scope">
					{{ scope.row.name }}
				</template>
			</el-table-column>
		</ColumnsEl>
	</div>
</template>

<script lang="tsx">
import ColumnsEl from './columns-el.vue'
import { ElTableColumn, ElButton, ElTag } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
	components: { ElTableColumn, ElButton, ElTag, ColumnsEl },
	data() {
		return {
			data: [
				{
					date: '2016-05-03',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles',
				},
				{
					date: '2016-05-02',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles',
				},
				{
					date: '2016-05-04',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles',
				},
				{
					date: '2016-05-01',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles',
				},
			],
			columns: [
				{
					label: 'Name1',
					render: scope =>
						h(ElButton, null, {
							default: scope.row.address,
						}),
				},
			],
		}
	},
}
</script>

```