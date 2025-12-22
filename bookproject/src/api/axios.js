import axios from "axios";

const api = axios.create({
    baseURL: "http://k8s-default-backends-3f4da00310-50ce291275241507.elb.us-east-2.amazonaws.com",
    withCredentials: false, // ✅ 쿠키 인증 안 쓰면 반드시 false
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
});

export default api;