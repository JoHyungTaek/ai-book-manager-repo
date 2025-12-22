import api from "./axios";

// 게시글 리스트 조회
export const getBoards = async () => {
    const response = await api.get("/api/boards");
    return response.data;
};

// 게시글 단건 조회 (기존)
export const fetchBoard = async (id) => {
    const response = await api.get(`/api/boards/${id}`);
    return response.data;
};

// ✅ BoardDetail/BoardUpdate에서 사용하는 이름으로도 export
export const fetchBoardDetail = fetchBoard;

// 게시글 생성
export const createBoard = async (data) => {
    const response = await api.post("/api/boards", data);
    return response.data;
};

// ✅ 게시글 수정
export const updateBoard = async (id, data) => {
    const response = await api.put(`/api/boards/${id}`, data);
    return response.data;
};

// ✅ 게시글 삭제
export const deleteBoard = async (id) => {
    const response = await api.delete(`/api/boards/${id}`);
    return response.data;
};
