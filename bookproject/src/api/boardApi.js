import api from "./axios";

// 게시글 목록 (권장)
export async function getBoards(params = {}) {
    const res = await api.get("/api/boards", { params });
    return res.data;
}

// ✅ 기존 코드 호환용 (BoardList.jsx가 fetchBoard를 import 중이라서 추가)
export async function fetchBoard(params = {}) {
    return await getBoards(params);
}

// 게시글 등록
export async function createBoard(data, userId) {
    const res = await api.post("/api/boards", data, {
        params: { userId },
    });
    return res.data;
}