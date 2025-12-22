import api from "./axios";

// 게시글 목록
export async function getBoards(params = {}) {
    const res = await api.get("/api/boards", { params });
    return res.data;
}

// ✅ BoardList.jsx에서 import { fetchBoard } 를 사용하고 있어서 호환용 alias 제공
export async function fetchBoard(params = {}) {
    return getBoards(params);
}

// 게시글 상세
export async function fetchBoardDetail(boardId) {
    const res = await api.get(`/api/boards/${boardId}`);
    return res.data;
}

// 게시글 등록 🔑 (JWT 필요)
export async function createBoard(data) {
    const res = await api.post("/api/boards", data);
    return res.data;
}

// 게시글 수정 🔑 (JWT 필요)
export async function updateBoard(boardId, data) {
    const res = await api.put(`/api/boards/${boardId}`, data);
    return res.data;
}

// ✅ 게시글 삭제 🔑 (JWT 필요)  ← 이번 빌드 에러 원인 해결
export async function deleteBoard(boardId) {
    const res = await api.delete(`/api/boards/${boardId}`);
    return res.data;
}
