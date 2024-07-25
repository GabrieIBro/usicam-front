import axios from "axios";

const axiosInstance = axios.create({
    baseURL:`http://${import.meta.env.VITE_SERVER_DOMAIN}/api`,
    withCredentials: true
})

export default axiosInstance;