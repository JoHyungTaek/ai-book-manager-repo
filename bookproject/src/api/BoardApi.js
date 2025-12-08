import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080", // 백엔드 주소
});

export default instance;

/* 게시판 등록
* url : /boards
* method: post
* type: cb (자유게시판), review(책 후기)
* */
export const createBoard = async (userId, data) => {
    const response = await instance.post(`/boards?userId=${userId}`, data);
    return response.data;
};

/* 게시판 목록 불러오기
* url: /boards/{type}
* method: get
* type: cb (자유게시판), review(책 후기)
* */
export const fetchBoard = async () => {
    const response = await instance.get("/boards");
    return response.data.content; // Page 객체의 content 배열만 사용
};

/* 게시판 상세 조회
* url: /boards/{type}/{boardId}
* method: get
* type: cb (자유게시판), review(책 후기)
* boardId: 게시판 아이디
* */
export const fetchBoardDetail = async (boardId) => {
    const response = await instance.get(`/boards/${boardId}`);
    return response.data;
};

/* 게시판 수정
* url: /boards/{type}/{boardId}
* method: put
* type: cb (자유게시판), review(책 후기)
* boardId: 게시판 아이디
* */
export const updateBoard = async (boardId, data) => {
    const response = await instance.put(`/boards/${boardId}`, data);
    return response.data;
};

/* 게시판 삭제
* url: /boards/{type}
* method: delete
* type: cb (자유게시판), review(책 후기)
* boardId: 게시판 아이디
* */
export const deleteBoard = async (boardId) => {
    const response = await instance.delete(`/boards/${boardId}`);
    return response.data;
};