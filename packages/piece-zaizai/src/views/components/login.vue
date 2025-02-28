<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import { useUserStore } from '@/store/user'

const emits = defineEmits<{
  change: [value: boolean]
}>()
const userStore = useUserStore()

const form = ref({
  un: 'ONE_PIECE_ZAIZAI',
  pwd: 'zaizai',
})
const formRef = useTemplateRef('formRef')
const rules: FormRules = {
  un: { required: true, message: '请输入', trigger: 'blur' /* unocss-disable */ },
  pwd: { required: true, message: '请输入', trigger: 'blur' /* unocss-disable */ },
}

const submit = () => {
  formRef.value?.validate(async errors => {
    if (!errors) {
      const is = await userStore.login(form.value)
      is && window.$message.success('获取成功')
      emits('change', is)
    }
  })
}

const touristSubmit = () => {
  form.value = {
    un: '10086',
    pwd: '10077',
  }
  submit()
}

const deleteInfo = () => {
  userStore.info.secretkey = ''
  window.$message.success('清除完成')
}
</script>

<template>
  <div class="flex p-3.5">
    <n-form
      ref="formRef"
      class="flex-1"
      :model="form"
      :rules="rules"
      size="small"
      @submit.prevent="submit"
    >
      <n-form-item
        path="un"
        :show-label="false"
      >
        <n-input
          v-model:value="form.un"
          clearable
        />
      </n-form-item>
      <n-form-item
        path="pwd"
        :show-label="false"
      >
        <n-input
          type="password"
          clearable
          v-model:value="form.pwd"
          @keydown.enter="submit"
        />
      </n-form-item>
      <n-button
        @click="submit"
        block
        size="small"
        >submit</n-button
      >
      <n-button
        @click="touristSubmit"
        class="mt-3"
        size="small"
        block
        >游客</n-button
      >
      <n-button
        v-if="userStore.info.secretkey !== ''"
        @click="deleteInfo"
        class="mt-3"
        size="small"
        type="warning"
        block
        >清楚令牌</n-button
      >
    </n-form>
  </div>
</template>

<style lang="scss" scoped></style>
