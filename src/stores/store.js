import { ref, reactive, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import axiosApiInstance  from '../services/api'
import router from '@/router/index.js'

export const useStore = defineStore('store', () => {
  const form = reactive({
    ipList: ''
  })
  const tableSearchInput = ref('')
  const ipDataList = ref([])
  const selectedRows = ref([])
  const sortByCountry = ref('')

  const handleSelectionChange = (val) => {
    selectedRows.value = val
  }

  const optionsBySortCountry = Object.freeze([
    {
      value: '+',
      label: 'A-Z'
    },
    {
      value: '-',
      label: 'Z-A'
    },
  ])

  const getData = async (ip) => {
    try {
      return await axiosApiInstance.get(ip)
    } catch (e) {
      console.error(e)
    }
  }

  const sortedIpDataList = computed(() => {
    const res = [...ipDataList.value];

    if (sortByCountry.value === '+') {
      res.sort((a, b) => (a.country < b.country ? -1 : 1));
    } else if (sortByCountry.value === '-') {
      res.sort((a, b) => (a.country > b.country ? -1 : 1));
    }

    return res;
  });

  const formatInputData = (string) => {
    return string.split('\n').map(ip => ip.trim())
  }

  const getAllData = async () => {
    const formattedIpList = formatInputData(form.ipList)
    const responses = await Promise.allSettled(formattedIpList.map(ip => {
      return getData(ip)
    }))

    ipDataList.value = responses.filter(data => data?.value?.data?.status === 'success').map(ip => ip?.value?.data)
  }

  const filterednSortedIpDataList = computed(() => {
    const searchInput = tableSearchInput.value.toLowerCase();
    return sortedIpDataList.value.filter(item => {
      return item.country.toLowerCase().includes(searchInput);
    });
  });

  const isSelected = (query) => {
    return selectedRows.value.some(row => row.query === query);
  };

  const removeSelected = () => {
    ipDataList.value = ipDataList.value.filter(ip => {
      return !selectedRows.value.some(selected => selected.query === ip.query);
    });
  }

  const removeSingleRow = (query) => {
    ipDataList.value = ipDataList.value.filter(ip => ip.query !== query);
  }

  const submitData = async () => {
    await getAllData();
    if (!!ipDataList.value.length) {
      await router.push('/results')
    }
  }

  return {
    form,
    submitData,
    ipDataList,
    selectedRows,
    tableSearchInput,
    sortByCountry,
    sortedIpDataList,
    optionsBySortCountry,
    handleSelectionChange,
    removeSelected,
    isSelected,
    removeSingleRow,
    filterednSortedIpDataList
  }
})