// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBook } from "../api/bookApi"; // 경로는 프로젝트 구조에 맞게 수정
import axios from "axios";

export default function BookCreate() {

    const nav = useNavigate();
    const [userId, setUserId] = useState(null);

    // 로그인한 사용자 정보 가져오기
//       useEffect(() => {
//         const token = localStorage.getItem("accessToken");
//         console.log("🔑 accessToken:", token);
//         if (!token) return;
//
//         axios.get("http://localhost:8080/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(res => setUserId(res.data.id))   // 백엔드 UserResponse에 id 포함되어 있어야 함
//         .catch(err => console.error("유저 정보 조회 실패:", err));
//       }, []);

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      console.log("🔑 accessToken:", token);

      axios.get("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log("👤 로그인 유저:", res.data);
        setUserId(res.data.id);
      })
      .catch(err => console.error("유저 정보 조회 실패:", err));
    }, []);

    const [form, setForm] = useState({
        title: "",
        author: "",
        content: "",
        category: "",
        bookImageUrl: "",
    });

    const categories = ["소설", "시/에세이", "과학/기술", "철학", "자기계발", "역사", "사회", "기타"];

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // 📌 제출 (백엔드 API 연동 전까지는 alert로 테스트)
    function handleSubmit() {
        if(!form.title || !form.content || !form.category){
            alert("필수 항목을 모두 입력하세요.");
            return;
        }
        alert("등록 완료! (백엔드 연결 전 테스트)");
        nav("/books"); // 등록 후 목록으로 이동
    }

    // userId가 임시로 1이라 가정
//     const userId = 1;

    async function handleSubmit() {
        if (!form.title || !form.content || !form.category) {
            alert("필수 항목을 모두 입력하세요.");
            return;
        }

        try {
        const data = {
            bookTitle: form.title,
            author: form.author,
            content: form.content,
            category: form.category,
            bookImageUrl: form.bookImageUrl,
        };

            await createBook(userId, data);

            alert("도서 등록 성공!");
            nav("/books");
        } catch (err) {
            console.error("등록 오류:", err);
            alert("도서 등록에 실패했습니다.");
            if (form.bookImageUrl && form.bookImageUrl.length > 1024) {
               alert(
                 `책 표지 URL이 너무 깁니다.\n\n` +
                 `현재 길이: ${form.bookImageUrl.length}자\n` +
                 `허용 최대: 1000자\n\n` +
                 `▶ URL을 줄이거나, 다른 방식(직접 업로드 등)으로 저장해 주세요.`
                   );            
                }
        }
    }

    return (
        <Box sx={{ maxWidth:"800px", mx:"auto", mt:5, p:3 }}>

            <Typography variant="h5" fontWeight="bold" color="#666" mb={4}>
                메인페이지 &gt; 도서 등록
            </Typography>

            {/* 제목 */}
            <Typography fontSize={22} fontWeight="bold" mt={3}>1. 제목 (필수)</Typography>
            <TextField
                fullWidth
                placeholder="책 제목을 입력하세요"
                name="title"
                value={form.title}
                onChange={handleChange}
                sx={{ mt:1 }}
            />

            {/* 저자 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>3. 저자 (필수)</Typography>
            <TextField
                fullWidth
                placeholder="저자를 입력하세요"
                name="author"
                value={form.author || ""}
                onChange={handleChange}
                sx={{ mt: 1 }}
            />

            {/* 내용 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>2. 책 내용 (필수)</Typography>
            <TextField
                fullWidth
                placeholder="책 내용을 입력하세요"
                name="content"
                value={form.content}
                onChange={handleChange}
                sx={{ mt:1 }}
            />

            {/* 카테고리 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>3. 카테고리</Typography>
            <TextField
                select fullWidth
                name="category"
                value={form.category}
                onChange={handleChange}
                sx={{ mt:1 }}
                SelectProps={{ displayEmpty:true }}
                placeholder="카테고리를 선택하세요"
            >
                <MenuItem value="" disabled>카테고리를 선택하세요</MenuItem>
                {categories.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>

            {/* 이미지 URL */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>4. 책표지 URL (선택)</Typography>
            <TextField
                fullWidth
                placeholder="이미지 주소를 입력하세요 (선택)"
                name="bookImageUrl"
                value={form.bookImageUrl}
                onChange={handleChange}
                sx={{ mt:1, mb:5 }}
            />

            {/* 등록 버튼 */}
            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                sx={{ py:1.5, fontSize:"18px", borderRadius:"8px", bgcolor:"#00b6b8" }}
            >
                등록하기
            </Button>

        </Box>
    );
}
