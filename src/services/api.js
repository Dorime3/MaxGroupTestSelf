import axios from 'axios'

const axiosApiInstance = axios.create({
  baseURL: 'http://ip-api.com/json/'
})

export default axiosApiInstance