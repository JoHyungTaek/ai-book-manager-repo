// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBook } from "../api/bookApi"; // 경로는 프로젝트 구조에 맞게 수정

export default function BookCreate() {

    const nav = useNavigate();

    const [form, setForm] = useState({
        title: "",
        author: "",
        content: "",
        category: "",
        imageUrl: "",
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
    const userId = 1;

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
            bookImageUrl: form.imageUrl,
        };

            await createBook(userId, data);

            alert("도서 등록 성공!");
            nav("/books");
        } catch (err) {
            console.error("등록 오류:", err);
            alert("도서 등록에 실패했습니다.");
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
                name="imageUrl"
                value={form.imageUrl}
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
