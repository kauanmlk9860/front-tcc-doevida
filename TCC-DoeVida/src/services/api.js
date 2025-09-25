import axios from 'axios'

const api = axios.create({
    baseURL: "http://10.107.144.3:8080/v1/doevida"
})

export default api