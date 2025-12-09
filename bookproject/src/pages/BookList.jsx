// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { Box, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/bookApi";

export default function BookList() {

    const nav = useNavigate();
    const [books, setBooks] = useState([]);

    //* 📌 임시 데이터 — 백엔드 연동 전까지 테스트용
//     const books = [
//         // 등록된 책 없을 땐 빈 배열 [] 로 변경하면 됨
//         {
//           id:1, title:"책먹는 여우", author:"프란치스카 비어만", category:"유아도서",
//           img:"https://image.aladin.co.kr/product/8/47/cover/s9788937864472.jpg", likes:4, writer:"에이블스쿨08"
//         },
//         {
//           id:2, title:"누가 내 머리에 똥쌌어?", author:"프란치스카 비어만", category:"유아도서",
//           img:"https://image.aladin.co.kr/product/284/49/cover/s9788958762148.jpg", likes:6, writer:"에이블스쿨07"
//         }
//     ];

    // 페이지 로드 시 도서 목록 가져오기
        useEffect(() => {
            const loadBooks = async () => {
                try {
                    const data = await fetchBooks();
                    setBooks(data);
                } catch (err) {
                    console.error("도서 목록 가져오기 실패:", err);
                }
            };
            loadBooks();
        }, []);

    const isEmpty = books.length === 0;

    return (
        <Box sx={{ width:"100%", maxWidth:"1000px", mx:"auto", mt:4 }}>

            <Typography fontSize={22} fontWeight="bold" mb={4} color="#666">
                메인페이지 &gt; 도서 목록
            </Typography>

            {/* =====================================================================================
          ① 책이 없을 경우
      ===================================================================================== */}
            {isEmpty && (
                <Box sx={{ textAlign:"center", mt:10 }}>
                    <Typography fontSize={24} fontWeight="600" mb={3}>
                        등록된 도서가 없습니다 📚
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ fontSize:18, borderRadius:3, bgcolor:"#00b6b8", px:4, py:1.2 }}
                        onClick={() => nav("/book/create")}
                    >
                        📖 책 등록하러 가기
                    </Button>
                </Box>
            )}

            {/* =====================================================================================
          ② 책이 있을 경우 목록 렌더링
      ===================================================================================== */}
            {!isEmpty && books.map(book => (
                <Card
                    key={book.bookId}
                    sx={{
                        p:2, mb:4, display:"flex", alignItems:"center",
                        borderRadius:4, boxShadow:"0 0 10px rgba(0,0,0,0.08)",
                        cursor:"pointer"
                    }}
                    onClick={() => nav(`/book/${book.bookId}`)}
                >
                    {/* 이미지 */}
                    <CardMedia
                        component="img"
                        src={book.bookImageUrl}
                        alt={book.bookTitle}
                        sx={{ width:120, height:160, borderRadius:2, mr:3 }}
                    />

                    {/* 본문 */}
                    <CardContent sx={{ flexGrow:1 }}>

                        <Typography fontSize={18} fontWeight="600">
                            {book.bookId}. {book.category}
                        </Typography>

                        <Typography fontSize={22} fontWeight="700" mt={1}>
                            제목 : {book.bookTitle}
                        </Typography>

                        <Typography fontSize={22} fontWeight="700" mt={1}>
                            저자 : {book.author}
                        </Typography>

                        <Box sx={{ display:"flex", alignItems:"center", gap:1, mt:2 }}>
                            👍 {book.likes}
                            <Typography ml={1} color="#555" fontSize={14}>
                                {book.writer}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            {/* 목록이 있을 때만 더보기 버튼 */}
            {!isEmpty && (
                <Box sx={{ display:"flex", justifyContent:"center", mt:3 }}>
                    <Button variant="outlined" sx={{ px:4, py:1.2, fontSize:18 }}>
                        더보기
                    </Button>
                </Box>
            )}
        </Box>
    );
}
