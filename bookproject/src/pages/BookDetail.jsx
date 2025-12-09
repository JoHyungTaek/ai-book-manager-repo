// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { Box, Typography, Button, Divider } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { fetchBookDetail, deleteBook, likeBook, dislikeBook } from "../api/bookApi";

export default function BookDetail() {

    const nav = useNavigate();
    const { id } = useParams(); // URL의 /book/:id 가져옴
    const [book, setBook] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    // 📌 임시 도서데이터 (백엔드 연결 전까지)
//     const book = {
//         id,
//         title:"책 먹는 여우",
//         author:"프란치스카 비어만",
//         category:"유아도서",
//         content:"...",
//         img:"https://image.aladin.co.kr/product/8/47/cover/s9788937864472.jpg",
//         likes:4,
//         writer:"에이블스쿨08",
//         updated:"2025-12-04 16:11",
//     };


    useEffect(() => {
            const loadBook = async () => {
                try {
                    const data = await fetchBookDetail(id);
                    setBook(data);

                    // ✅ 현재 로그인한 사용자 닉네임과 비교
                    const currentNickname = localStorage.getItem("nickname");

                    console.log("현재 로그인 닉네임:", currentNickname);
                    console.log("책 작성자 닉네임:", data.writer);

                    if (currentNickname && data.writer === currentNickname) {
                        setIsOwner(true);
                    }
                } catch (err) {
                    console.error("도서 상세정보 로드 실패:", err);
                    alert("도서 정보를 불러오지 못했습니다.");
                }
            };
            loadBook();
    }, [id]);

//     // 페이지 로드 시 백엔드에서 도서 상세정보 가져오기
//     useEffect(() => {
//         const loadBook = async () => {
//             try {
//                 const data = await fetchBookDetail(id);
//                 setBook(data);
//             } catch (err) {
//                 console.error("도서 상세정보 로드 실패:", err);
//                 alert("도서 정보를 불러오지 못했습니다.");
//             }
//         };
//         loadBook();
//     }, [id]);

    // 데이터 로딩 중 표시
    if (!book) {
        return <Typography align="center" mt={10}>📚 도서 정보를 불러오는 중...</Typography>;
    }

    // 수정 페이지 이동
    const goUpdate = () => nav(`/book/update/${id}`);

    // 삭제 클릭
    const handleDelete = async () => {
        if (confirm("정말 삭제할까요?")) {
            try {
                console.log("삭제 요청 ID:", id);
                await deleteBook(id);
                alert("삭제 완료!");
                nav("/books"); // 삭제 후 목록 페이지로 이동
            } catch (err) {
                console.error("도서 삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return(
        <Box sx={{ width:"100%", maxWidth:"1100px", mx:"auto", mt:3 }}>

            <Typography fontSize={22} fontWeight="bold" color="#666" mb={4}>
                메인페이지 &gt; 상세페이지
            </Typography>

            <Box sx={{ display:"flex", gap:5 }}>

                {/* ===== 이미지 ===== */}
                <Box>
                    <img
                        src={book.bookImageUrl}
                        alt={book.bookTitle}
                        style={{ width:"300px", height:"420px", borderRadius:"6px" }}
                    />
                </Box>

                {/* ===== 책 정보 ===== */}
                <Box sx={{ flex:1 }}>

                    <Typography fontSize={22} fontWeight="700" mt={1}>
                        카테고리: <span style={{fontWeight:"400"}}>{book.category}</span>
                    </Typography>

                    <Typography fontSize={22} fontWeight="700" mt={2}>
                        제목: <span style={{fontWeight:"400"}}>{book.bookTitle}</span>
                    </Typography>

                    <Typography fontSize={22} fontWeight="700" mt={2}>
                        저자: <span style={{fontWeight:"400"}}>{book.author}</span>
                    </Typography>

                    <Typography fontSize={22} fontWeight="700" mt={2} mb={2}>
                        내용: <span style={{fontWeight:"400"}}>{book.content}</span>
                    </Typography>

                    <Box sx={{ opacity:0.6, mt:10 }}>
                        <Typography fontSize={14}>
                            마지막 수정: {""}
                            {book.updatedAt
                                ? new Date(book.updatedAt).toLocaleString()
                                : "정보 없음"}
                        </Typography>
                    </Box>

                    {/* 좋아요/싫어요 + 작성자 */}
{/*                     <Box sx={{ display:"flex", alignItems:"center", gap:1, mt:1 }}> */}
{/*                         <ThumbUpAltIcon /> {book.likes} */}
{/*                         <ThumbDownAltIcon sx={{ml:2}} /> */}
{/*                         <PersonIcon sx={{ml:2, opacity:0.7}} /> {book.writer} */}
{/*                     </Box> */}
                    <Box sx={{ display:"flex", alignItems:"center", gap:1, mt:1 }}>
                      <ThumbUpAltIcon
                       sx={{ cursor: "pointer" }}
                       onClick={async () => {
                           try {
                               const updated = await likeBook(id);
                               setBook(updated);
                           } catch (err) {
                               console.error("좋아요 실패:", err);
                               alert("좋아요 처리 중 오류가 발생했습니다.");
                           }
                       }}
                      />
                      {book.likes}

                      <ThumbDownAltIcon
                       sx={{ ml:2, cursor: "pointer" }}
                       onClick={async () => {
                           try {
                               const updated = await dislikeBook(id);
                               setBook(updated);
                           } catch (err) {
                               console.error("싫어요 실패:", err);
                               alert("싫어요 처리 중 오류가 발생했습니다.");
                           }
                       }}
                      />
                      {book.dislikes}

                       <PersonIcon sx={{ ml:2, opacity:0.7 }} /> {book.writer}
{/*                         <PersonIcon sx={{ ml:2, opacity:0.7 }} /> {book.user?.nickname} */}

                    </Box>
                </Box>
            </Box>

            <Divider sx={{mt:3, mb:4}}/>

            {/* ===== 버튼 구역 ===== */}
            <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:2 }}>
                <Button
                    variant="outlined"
                    sx={{width:200, py:1.4, fontSize:"18px", borderColor:"#1a9bff"}}
                    onClick={goUpdate}
                    disabled={!isOwner} // ✅ 비활성화
                >
                    수정하기
                </Button>

                <Button
                    variant="outlined"
                    sx={{width:200, py:1.4, fontSize:"18px", borderColor:"#ff4b4b", color:"#ff4b4b"}}
                    onClick={handleDelete}
                    disabled={!isOwner} // ✅ 비활성화
                >
                    삭제하기
                </Button>
            </Box>
        </Box>
    );
}