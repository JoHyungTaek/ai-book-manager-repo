import api from "./http";

/* 게시판 등록 */
export const createBoard = async (userId, data) => {
    const res = await api.post(`/api/boards?userId=${userId}`, data);
    return res.data;
};

/* 게시판 목록 */
export const fetchBoard = async () => {
    const res = await api.get("/api/boards");
    return res.data.content ?? res.data; // 백엔드 응답 형태가 달라도 안전하게
};

// 혹시 기존 코드가 fetchBoards로 쓰던 경우 대비(빌드 깨짐 방지)
export const fetchBoards = fetchBoard;

/* 게시판 상세 */
export const fetchBoardDetail = async (boardId) => {
    const res = await api.get(`/api/boards/${boardId}`);
    return res.data;
};

/* 게시판 수정 */
export const updateBoard = async (boardId, data) => {
    const res = await api.put(`/api/boards/${boardId}`, data);
    return res.data;
};

/* 게시판 삭제 */
export const deleteBoard = async (boardId) => {
    const res = await api.delete(`/api/boards/${boardId}`);
    return res.data;
};
