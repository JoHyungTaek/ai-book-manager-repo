import api from "./axios";

// 게시글 목록
export async function getBoards(params = {}) {
    const res = await api.get("/api/boards", { params });
    return res.data;
}

// 게시글 등록
export async function createBoard(data, userId) {
    // 기존 코드가 /api/boards?userId=... 구조라 그대로 유지
    const res = await api.post(`/api/boards`, data, {
        params: { userId },
    });
    return res.data;
}
