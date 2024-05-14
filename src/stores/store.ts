import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import axiosApiInstance from '../services/api';
import router from '@/router/index';
import { ElNotification } from 'element-plus';

interface IpData {
    country: string;
    query: string;
}

interface StoreState {
    form: {
        ipList: string;
    };
    tableSearchInput: string;
    ipDataList: IpData[];
    selectedRows: IpData[];
    sortByCountry: string;
    hoveredQueryCopyBtn: string[];
    isDebounce: boolean;
    optionsBySortCountry: { value: string; label: string }[];
}

export const useStore = defineStore('store', () => {
    const form = reactive({
        ipList: '',
    });
    const tableSearchInput = ref('');
    const ipDataList = ref<IpData[]>([]);
    const selectedRows = ref<IpData[]>([]);
    const sortByCountry = ref('');
    const hoveredQueryCopyBtn = ref<string[]>([]);
    const isDebounce = ref(false);
    const route = useRoute();

    onMounted(async () => {
        const logQueryOnce = async () => {
            if (!route.query.ips) {
                return;
            }
            form.ipList = route.query.ips.replace(/,/g, '\n');
            await getAllData();
        };
        await logQueryOnce();
    });

    const handleSelectionChange = (val: IpData[]) => {
        selectedRows.value = val;
    };

    const optionsBySortCountry = Object.freeze([
        {
            value: '+',
            label: 'A-Z',
        },
        {
            value: '-',
            label: 'Z-A',
        },
    ]);

    const copyQueryBtn = async () => {
        try {
            await navigator.clipboard.writeText(hoveredQueryCopyBtn.value[0]);
        } catch (e) {
            console.log(e);
        }
    };

    const getData = async (ip: string) => {
        try {
            const res = await axiosApiInstance.get(ip);
            if (res.data.status === 'fail') {
                throw new Error(res.data.message);
            }
            return res;
        } catch (e) {
            ElNotification({
                title: 'Error',
                message: e,
                type: 'error',
            });
        }
    };

    const sortedIpDataList = computed(() => {
        const res = [...ipDataList.value];

        if (sortByCountry.value === '+') {
            res.sort((a, b) => (a.country < b.country ? -1 : 1));
        } else if (sortByCountry.value === '-') {
            res.sort((a, b) => (a.country > b.country ? -1 : 1));
        }

        return res;
    });

    const toggleCopyBtn = (row: IpData) => {
        if (hoveredQueryCopyBtn.value.includes(row.query)) {
            hoveredQueryCopyBtn.value = hoveredQueryCopyBtn.value.filter(query => row.query !== query);
        } else {
            hoveredQueryCopyBtn.value.push(row.query);
        }
    };

    const formatInputData = (string: string) => {
        return string.split('\n').map(ip => ip.trim());
    };

    const getAllData = async () => {
        const formattedIpList = formatInputData(form.ipList);
        try {
            isDebounce.value = true;
            const responses = await Promise.allSettled(formattedIpList.map(ip => {
                return getData(ip);
            }));

            ipDataList.value = responses.filter(data => data?.value?.data?.status === 'success').map(ip => ip?.value?.data);
        } catch (e) {
            throw new Error(e);
        } finally {
            isDebounce.value = false;
        }
    };

    const filterednSortedIpDataList = computed(() => {
        const searchInput = tableSearchInput.value.toLowerCase();
        return sortedIpDataList.value.filter(item => {
            return item.country.toLowerCase().includes(searchInput);
        });
    });

    const isSelected = (query: string) => {
        return selectedRows.value.some(row => row.query === query);
    };

    const removeSelected = () => {
        ipDataList.value = ipDataList.value.filter(ip => {
            return !selectedRows.value.some(selected => selected.query === ip.query);
        });
    };

    const removeSingleRow = (query: string) => {
        ipDataList.value = ipDataList.value.filter(ip => ip.query !== query);
    };

    const submitData = async () => {
        await getAllData();
        if (!!ipDataList.value.length) {
            const query = formatInputData(form.ipList).join(',');
            await router.push({
                path: '/results',
                query: {
                    ips: query,
                },
            });
        }
    };

    return {
        form,
        submitData,
        ipDataList,
        selectedRows,
        copyQueryBtn,
        tableSearchInput,
        sortByCountry,
        sortedIpDataList,
        optionsBySortCountry,
        handleSelectionChange,
        removeSelected,
        isDebounce,
        isSelected,
        removeSingleRow,
        filterednSortedIpDataList,
        toggleCopyBtn,
        hoveredQueryCopyBtn,
    };
});
