// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080", // 백엔드 주소
});

//  모든 요청에 Authorization 헤더 자동 추가
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

// 도서 등록
export const createBook = async (userId, data) => {
    const response = await instance.post(`/api/books?userId=${userId}`, data);
    return response.data;
};

// 도서 목록 불러오기
export const fetchBooks = async () => {
    const response = await instance.get("/api/books");
    return response.data.content; // Page 객체의 content 배열만 사용
};

// 도서 상세 조회
export const fetchBookDetail = async (bookId) => {
    const response = await instance.get(`/api/books/${bookId}`);
    return response.data;
};

// 도서 수정
export const updateBook = async (bookId, data) => {
    const response = await instance.put(`/api/books/${bookId}`, data);
    return response.data;
};

// 도서 삭제
export const deleteBook = async (bookId) => {
    const response = await instance.delete(`/api/books/${bookId}`);
    return response.data;
};

// 책 좋아요
export const likeBook = async (bookId) => {
    const response = await instance.post(`/api/books/${bookId}/like?liked=true`);
    return response.data;
};

// 책 싫어요
export const dislikeBook = async (bookId) => {
    const response = await instance.post(`/api/books/${bookId}/like?liked=false`);
    return response.data;
};
