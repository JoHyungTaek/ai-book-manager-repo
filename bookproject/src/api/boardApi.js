import api from "./axios";

/* =========================
   게시글 목록
========================= */
export async function getBoards(params = {}) {
    const res = await api.get("/api/boards", { params });
    return res.data;
}

/* ✅ 기존 코드 호환용 */
export async function fetchBoard(params = {}) {
    return await getBoards(params);
}

/* =========================
   게시글 상세
========================= */
export async function getBoardDetail(boardId) {
    const res = await api.get(`/api/boards/${boardId}`);
    return res.data;
}

/* ✅ 기존 코드 호환용 */
export async function fetchBoardDetail(boardId) {
    return await getBoardDetail(boardId);
}

/* =========================
   게시글 등록
========================= */
export async function createBoard(data, userId) {
    const res = await api.post("/api/boards", data, {
        params: { userId },
    });
    return res.data;
}

/* =========================
   게시글 삭제
========================= */
export async function deleteBoard(boardId) {
    const res = await api.delete(`/api/boards/${boardId}`);
    return res.data;
}