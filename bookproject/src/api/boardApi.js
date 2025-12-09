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

/* 게시판 등록
* url : /boards
* method: post
* */
export const createBoard = async (userId, data) => {
    const response = await instance.post(`/api/boards?userId=${userId}`, data);
    return response.data;
};

/* 게시판 목록 불러오기
* url: /boards
* method: get
* */
export const fetchBoard = async () => {
    const response = await instance.get("/api/boards");
    return response.data.content; // Page 객체의 content 배열만 사용
};

/* 게시판 상세 조회
* url: /boards/{boardId}
* method: get
* boardId: 게시판 아이디
* */
export const fetchBoardDetail = async (boardId) => {
    const response = await instance.get(`/api/boards/${boardId}`);
    return response.data;
};

/* 게시판 수정
* url: /boards/{boardId}
* method: put
* boardId: 게시판 아이디
* */
export const updateBoard = async (boardId, data) => {
    const response = await instance.put(`/api/boards/${boardId}`, data);
    return response.data;
};

/* 게시판 삭제
* url: /boards/{boardId}
* method: delete
* boardId: 게시판 아이디
* */
export const deleteBoard = async (boardId) => {
    const response = await instance.delete(`/api/boards/${boardId}`);
    return response.data;
};