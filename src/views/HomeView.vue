<script setup>
import { useStore } from '../stores/store'

const {
  form,
  submitData
} = useStore()

</script>

<template>
  <section class="container">
    <el-form
      :model="form"
      label-width="auto"
    >
    <el-input
      v-model="form.ipList"
      :autosize="{ minRows: 4, maxRows: 8 }"
      size="large"
      type="textarea"
      placeholder="Введите IP адреса"
      class="ip-list"
    />
    <div class="form-actions">
      <el-button size="large" @click="submitData">
        Отправить
      </el-button>
    </div>
    </el-form>
    <pre>
      7.7.7.7
      8.8.8.8
      24.48.0.1
      195.16.32.227
    </pre>
  </section>
</template>

<style scoped>
  .container {
    margin: 80px auto 0;
    width: 1240px;
    .ip-list {
      width: 620px;
      font-size: 16px;
    }
    .form-actions {
      margin-top: 20px;
    }
  }
</style>