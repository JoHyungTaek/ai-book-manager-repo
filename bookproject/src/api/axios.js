import axios from "axios";

const api = axios.create({
    baseURL: "http://k8s-default-backends-3f4da00310-50ce291275241507.elb.us-east-2.amazonaws.com",
    withCredentials: true,
});

// 요청마다 JWT 자동 첨부
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
