import instance from "./bookApi";
// bookApi.js 에서 만든 axios instance 재사용

// 내 정보 조회 (GET /auth/me)
export const getMyInfo = async () => {
    // 로그인 시 저장해둔 accessToken 사용
    const token = localStorage.getItem("accessToken");

    const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const res = await instance.get("/auth/me", { headers });
    return res.data;
};

// 내 정보 수정
export const updateMyInfo = async (data) => {
    const token = localStorage.getItem("accessToken");

    const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const res = await instance.put("/auth/me", data, { headers });
    return res.data;
};
