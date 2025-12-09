import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default instance;

// 댓글 목록 조회
export const fetchReplies = async (boardId) => {
    const res = await instance.get(`/api/boards/reply/${boardId}`);
    return res.data.content;
};

// 댓글 생성 (PK 기반)
export const addReply = async (boardId, content, userId) => {
    return instance.post(`/api/boards/reply?userId=${userId}`, {
        boardId,
        content,
    });
};

// 댓글 삭제
export const deleteReply = async (replyId) => {
    return instance.delete(`/api/boards/reply/${replyId}`);
};
