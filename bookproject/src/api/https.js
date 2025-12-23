import axios from "axios";

// ✅ 같은 Origin(=프론트 도메인) 기준으로 /api 호출
// nginx가 /api 를 백엔드로 프록시 해줌
const api = axios.create({
    baseURL: "",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
