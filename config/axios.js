import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://192.168.1.104:8080/api",
    withCredentials: true
})

export default axiosInstance;