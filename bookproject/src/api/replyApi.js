import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080", // 백엔드 주소
});

// ✅ 모든 요청에 Authorization 헤더 자동 추가
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;

// 댓글 등록
export const createReply = async (userId, data) => {
    const response = await instance.post(`/api/boards/reply?userId=${userId}`, data);
    return response.data;
};

// 댓글 수정
export const updateReply = async (replyId, data) => {
    const response = await instance.put(`/api/boards/reply/${replyId}`, data);
    return response.data;
};

// 댓글 삭제
export const fetchBookDetail = async (replyId) => {
    const response = await instance.get(`/api/boards/reply/${replyId}`);
    return response.data;
};

// 댓글 목록 조회
// 게시판 아이디에 해당하는 댓글 목록 조회
export const fetchReplies = async (boardId) => {
    const response = await instance.get(`/api/boards/reply/${boardId}`);
    return response.data.content; // Page 객체의 content 배열만 사용
};
