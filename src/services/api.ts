import axios, { AxiosInstance } from 'axios'

const axiosApiInstance: AxiosInstance = axios.create({
  baseURL: 'http://ip-api.com/json/',
})

export default axiosApiInstance