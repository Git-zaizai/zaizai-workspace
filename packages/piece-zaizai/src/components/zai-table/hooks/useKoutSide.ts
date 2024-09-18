import type { DropdownOption } from 'naive-ui'
import { type ZaiTableEmitType } from './useTableEmits'
import type { EmitFn } from 'vue'
import { NButton } from 'naive-ui'

const options: DropdownOption[] = [
  {
    label: () =>
      h(
        NButton,
        { text: true, type: 'primary' },
        {
          default: () => '编辑',
        }
      ),
    key: 'actionUpdate',
  },
  {
    label: () =>
      h(
        NButton,
        { text: true, type: 'error' },
        {
          default: () => '删除',
        }
      ),
    key: 'actionDelete',
  },
]

export const useKoutSide = (emits: EmitFn<ZaiTableEmitType>) => {
  const showDropdownRef = ref(false)
  const dropdownXY = reactive({ x: 0, y: 0 })

  let row, index

  const rowProps = (_row: any, _index: number) => {
    return {
      onContextmenu: (e: MouseEvent) => {
        row = _row
        index = _index
        e.preventDefault()
        nextTick().then(() => {
          showDropdownRef.value = true
          dropdownXY.x = e.clientX
          dropdownXY.y = e.clientY
        })
      },
    }
  }

  const onClickoutside = () => (showDropdownRef.value = false)

  const handleSelect = (key: 'actionUpdate' | 'actionDelete') => {
    showDropdownRef.value = false
    // @ts-ignore
    emits(key, row, index, key === 'actionUpdate' ? 'edit' : 'delete')
  }

  return {
    showDropdownRef,
    dropdownXY,
    rowProps,
    dropdownOptions: options,
    onClickoutside,
    handleSelect,
  }
}
