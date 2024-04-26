<script setup>
import { useStore } from '../stores/store'
import { Search, Select, Close, Delete } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'

const store = useStore()

</script>

<template>
  <section class="container">
    <div class="search-block">
      <el-input
        v-model="store.tableSearchInput"
        class="ip-search-table"
        placeholder="Поиск по таблице"
        :prefix-icon="Search"
      />
    </div>
    {{ store.hoveredQueryCopyBtn }}
    <el-table
      :data="store.filterednSortedIpDataList"
      border
      max-height="400px"
      ref="selectableTableRef"
      @cell-mouse-enter="store.toggleCopyBtn"
      @cell-mouse-leave="store.toggleCopyBtn"
      @selection-change="store.handleSelectionChange">
      <el-table-column v-model="store.selectedRows" type="selection" width="40" />
      <el-table-column>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>IP</div>
            <div v-if="store.selectedRows.length > 1">
              <el-button
                size="small"
                type="danger"
                plain
                @click="store.removeSelected">
                Удалить выбранные
              </el-button>
            </div>
          </div>
        </template>
        <template #default="scope">
          <div style="display: flex; justify-content: space-between; align-items: center">
          <div class="ip-address-col">
            <img :src="`https://flagsapi.com/${scope.row.countryCode}/flat/64.png`" class="country-img"/>
            <div>
              {{ scope.row.query }}
            </div>
          </div>
            <el-button
              v-if="store.isSelected(scope.row.query)"
              link
              type="danger"
              @click="store.removeSingleRow(scope.row.query)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>Country</div>
            <div>
              <el-select-v2
                v-model="store.sortByCountry"
                :options="store.optionsBySortCountry"
                placeholder="Сортировка"
                clearable
                size="small"
                style="width: 120px;">
                <template #header>
                  <div class="custom-sort-select-header">Сортировка</div>
                </template>
                <template #default="{ item }">
                  <div class="custom-sort-select-option">
                    <div style="height: 10px; padding: 0">{{ item.label }}</div>
                    <el-icon v-if="item.value === store.sortByCountry">
                      <Select />
                    </el-icon>
                  </div>
                </template>
              </el-select-v2>
            </div>
          </div>
        </template>
        <template #default="scope">
          {{ scope.row.country }}
        </template>
      </el-table-column>
      <el-table-column label="City/Town" prop="city" />
      <el-table-column width="54">
        <template #default="scope">
          <el-tooltip v-if="scope.row.status === 'success'" placement="top" content="Успешно" effect="light">
            <el-button style="padding: 0; width: 100%">
              <el-icon>
                <Select />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip v-else-if="scope.row.status === 'fail'" placement="top" content="Не успешно" effect="light">
            <el-button style="padding: 0; width: 100%">
              <el-icon>
                <Close />
              </el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style scoped>
.container {
  margin: 80px auto 0;
  width: 1240px;
  .search-block {
    margin-bottom: 20px;
    max-width: 50%;
    .ip-search-table {
      height: 44px;
    }
  }
  .ip-address-col {
    display: flex;
    align-items: center;
    gap: 10px;
    .country-img {
      width: 21px;
      height: 15px;
      object-fit: cover;
    }
  }
}
.custom-sort-select-header {
  padding: 0;
  color: #929496;
  font-size: 12px;
}
.custom-sort-select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 12px;
}

</style>