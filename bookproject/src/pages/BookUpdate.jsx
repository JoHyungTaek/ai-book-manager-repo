// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";
import {updateBook, fetchBookDetail} from "../api/bookApi";

export default function BookUpdate() {

    const { id } = useParams();
    const nav = useNavigate();
//     const [form, setForm] = useState(original);
//    const [apiKey, setApiKey] = useState(""); // ← openAI 키 입력값
    const categories = ["소설", "시/에세이", "과학/기술", "철학", "자기계발", "역사", "사회", "기타"];

    
    // 수정 전 기존 데이터 (백엔드 연동 시 GET)
//     const original = {
//         title: "책 먹는 여우",
//         author: "프란치스카 비어만",
//         category: "유아도서",
//         content: "너무 책을 좋아해서 먹어버린다는 이야기...",
//         img: "https://image.aladin.co.kr/product/8/47/cover/s9788937864472.jpg",
//         likes: 4,
//         writer: "에이블스쿨08",
//         updated: "2025-12-04 16:11"
//     };

        const [form, setForm] = useState({
            bookTitle: "",
            author: "",
            category: "",
            content: "",
            bookImageUrl: "",
            likes: 0,
            writer: "",
            updated: ""
    });

    useEffect(() => {
        const loadBook = async () => {
            try {
                const data = await fetchBookDetail(id);

                // 여기에서 localStorage 값을 같이 반영
                const storedCover = localStorage.getItem("aiSelectedCover");

                if (storedCover) {
                    setForm({
                        ...data,
                        // 서버에서 온 값 대신, AI로 선택한 이미지를 우선 사용
                        bookImageUrl: storedCover,
                    });
                } else {
                    setForm(data);
                }
            } catch (err) {
                console.error("도서 불러오기 실패:", err);
                alert("도서 정보를 가져오지 못했습니다."); 
            }
        };
        loadBook();
    }, [id]);


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    

    // 저장
    const save = async () => {
        try {
            await updateBook(id, form);
            alert("수정 완료!");

            const updatedData = await fetchBookDetail(id);
            setForm(updatedData);
            
            localStorage.removeItem("aiSelectedCover");

            nav(`/book/${id}`);
        } catch (err) {
            console.error("도서 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
            if (form.bookImageUrl && form.bookImageUrl.length > 1024) {
               alert(
                 `책 표지 URL이 너무 깁니다.\n\n` +
                 `현재 길이: ${form.bookImageUrl.length}자\n` +
                 `허용 최대: 1000자\n\n` +
                 `▶ URL을 줄이거나, 다른 방식(직접 업로드 등)으로 저장해 주세요.`
                   );            
                }
        }
    };

    

    return(
        <Box sx={{ width:"100%", maxWidth:"1100px", mx:"auto", mt:4 }}>

            <Typography fontSize={22} fontWeight="bold" color="#666" mb={4}>
                메인페이지 &gt; 도서 수정
            </Typography>

            <Box sx={{ display:"flex", gap:5 }}>

                {/* 좌측 — 이미지 */}
                <Box>
                    {form.bookImageUrl ? (
                      <img
                        src={form.bookImageUrl}
                        alt={form.bookTitle}
                        style={{ width: "300px", height: "420px", borderRadius: "6px" }}
                      />
                    ) : (
                      <Typography color="#999">이미지 없음</Typography>
                    )}
                </Box>

                {/* 우측 — 수정 가능한 필드 */}
                <Box sx={{ flex:1 }}>

                    <Typography fontSize={20} fontWeight={700} mt={0}>카테고리</Typography>
                    <TextField select fullWidth name="category" value={form.category} onChange={handleChange} sx={{mb:2}}>
                        {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>

                    <Typography fontSize={20} fontWeight={700}>제목</Typography>
                    <TextField fullWidth name="bookTitle" value={form.bookTitle} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700}>저자</Typography>
                    <TextField fullWidth name="author" value={form.author} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700}>내용</Typography>
                    <TextField fullWidth name="content" value={form.content} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700} mt={1}>책 표지 URL</Typography>
                    <TextField fullWidth name="bookImageUrl" value={form.bookImageUrl} onChange={handleChange} sx={{mb:4}}/>

                    

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ py: 1.4, mb: 3 }}
                        onClick={() => {
                            nav("/book/update/ai-book-cover", {
                              state: {
                                bookId: id,
                                bookTitle: form.bookTitle,  // 현재 도서 제목
                                content: form.content,      // 현재 도서 내용
                                author: form.author,        // 현재 작가명
                                category: form.category     // 현재 도서 카테고리
                              }
                            });
                        }}
                        >
                        🔥 이미지 생성하기
                    </Button>

                    {/* 좋아요/작성자 표시(수정불가 영역) */}
                    <Box sx={{ opacity: 0.6, display: "flex", alignItems: "center", gap: 1 }}>
                      <ThumbUpAltIcon /> {form.likes}
                      <ThumbDownAltIcon sx={{ ml: 2 }} /> {form.dislikes}
                      <PersonIcon sx={{ ml: 2 }} /> {form.writer}
                    </Box>

                    <Typography fontSize={13} color="#666" mt={1} mb={3}>
                        마지막 수정: {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "정보 없음"}
                    </Typography>
                </Box>
            </Box>

            {/* 하단 버튼 */}
            <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:5 }}>
                <Button variant="contained" sx={{px:6, py:1.4, fontSize:18, bgcolor:"#00b6b8"}} onClick={save}>
                    저장하기
                </Button>
                <Button variant="outlined" sx={{px:6, py:1.4, fontSize:18, borderColor:"#ff4b4b", color:"#ff4b4b"}} onClick={()=>nav(`/book/${id}`)}>
                    취소
                </Button>
            </Box>

        </Box>
    );
}