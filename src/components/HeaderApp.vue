<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'

const inputVal = ref('')
const navLinks = [
  {
    text: 'Documentation',
    path: '/documentation'
  },
  {
    text: 'Contacts',
    path: '/contacts'
  },
  {
    text: 'Log in',
    path: '/login'
  }
]
</script>

<template>
  <header>
    <div class="container">
      <RouterLink to="/">
        <el-link :underline="false" class="logo">
          ip-pn.com
        </el-link>
      </RouterLink>
      <div class="search-block">
        <el-input
          v-model="inputVal"
          class="ip-search-input"
          placeholder="95.213.138.174"
          :prefix-icon="Search"
        />
      </div>
      <div class="nav-links">
        <div v-for="({text, path}, idx) in navLinks" :key="idx" class="nav-link">
          <RouterLink :to="path">
            <el-link :underline="false">
              <el-text size="large">
                {{ text }}
              </el-text>
            </el-link>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  header {
    background-color: #F2F0F0;
    width: 100%;
    height: 100px;
    border-radius: 0 0 16px 16px;
  }
  .container {
    margin: 0 auto;
    width: 1240px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      color: #000;
      font-size: 24px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .search-block {
      .ip-search-input {
        width: 460px;
        height: 48px;
      }
    }
    .nav-links {
      display: flex;
      gap: 0 10px;
    }
  }
</style>
