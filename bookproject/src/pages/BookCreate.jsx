// 2025-12-05 16:34 형택님 마지막 수정으로 복구

import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { createBook } from "../api/bookApi";
import axios from "axios";
import AiBookCover from "./AiBookCover";

export default function BookCreate() {
    const nav = useNavigate();
    const [userId, setUserId] = useState(null);

    // 🔹 AI 표지 생성 팝업 상태
    const [openCover, setOpenCover] = useState(false);

    // 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        console.log("🔑 accessToken:", token);

        axios
            // ✅ FIX: 루트(/) 호출하면 백엔드 Security에서 403 나서 /auth/me로 호출해야 함
            .get(
                "http://k8s-default-backends-3f4da00310-50ce291275241507.elb.us-east-2.amazonaws.com/auth/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((res) => {
                console.log("👤 로그인 유저:", res.data);
                setUserId(res.data.id);
            })
            .catch((err) => console.error("유저 정보 조회 실패:", err));
    }, []);

    const [form, setForm] = useState({
        title: "",
        author: "",
        content: "",
        category: "",
        bookImageUrl: "",
    });

    const categories = [
        "문학",
        "과학",
        "경제",
        "역사",
        "철학",
        "기술",
        "예술",
        "기타",
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return alert("제목을 입력해주세요.");
        if (!form.author.trim()) return alert("저자를 입력해주세요.");
        if (!form.content.trim()) return alert("책 내용을 입력해주세요.");
        if (!form.category.trim()) return alert("카테고리를 선택해주세요.");

        if (!userId) {
            alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            nav("/login");
            return;
        }

        const payload = {
            title: form.title,
            author: form.author,
            content: form.content,
            category: form.category,
            bookImageUrl: form.bookImageUrl,
        };

        try {
            await createBook(payload, userId, token);
            alert("책이 등록되었습니다!");
            nav("/books");
        } catch (e) {
            console.error(e);
            alert("책 등록 실패");
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 5 }}>
            <Typography fontSize={22} fontWeight="bold">
                메인페이지 &gt; 도서 등록
            </Typography>

            {/* 제목 */}
            <Typography fontSize={22} fontWeight="bold" mt={3}>
                1. 제목 (필수)
            </Typography>
            <TextField
                fullWidth
                placeholder="책 제목을 입력하세요"
                name="title"
                value={form.title}
                onChange={handleChange}
                sx={{ mt: 1 }}
            />

            {/* 저자 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>
                3. 저자 (필수)
            </Typography>
            <TextField
                fullWidth
                placeholder="저자를 입력하세요"
                name="author"
                value={form.author}
                onChange={handleChange}
                sx={{ mt: 1 }}
            />

            {/* 책 내용 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>
                2. 책 내용 (필수)
            </Typography>
            <TextField
                fullWidth
                placeholder="책 내용을 입력하세요"
                name="content"
                value={form.content}
                onChange={handleChange}
                sx={{ mt: 1 }}
            />

            {/* 카테고리 */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>
                3. 카테고리
            </Typography>
            <TextField
                select
                fullWidth
                name="category"
                value={form.category}
                onChange={handleChange}
                sx={{ mt: 1 }}
            >
                <MenuItem value="">카테고리를 선택하세요</MenuItem>
                {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                        {c}
                    </MenuItem>
                ))}
            </TextField>

            {/* 책표지 URL */}
            <Typography fontSize={22} fontWeight="bold" mt={4}>
                4. 책표지 URL (선택)
            </Typography>
            <TextField
                fullWidth
                placeholder="이미지 주소를 입력하세요 (선택)"
                name="bookImageUrl"
                value={form.bookImageUrl}
                onChange={handleChange}
                sx={{ mt: 1 }}
            />

            <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2, height: 55, fontSize: 16 }}
                onClick={() => setOpenCover(true)}
            >
                🔥 이미지 생성하기
            </Button>

            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 4, height: 60, fontSize: 18 }}
                onClick={handleSubmit}
            >
                등록하기
            </Button>

            {/* AI 표지 생성 팝업 */}
            <Dialog open={openCover} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    AI 책표지 생성
                    <IconButton onClick={() => setOpenCover(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AiBookCover
                        title={form.title}
                        author={form.author}
                        content={form.content}
                        category={form.category}
                        onSelect={(url) => {
                            if (url) setForm((prev) => ({ ...prev, bookImageUrl: url }));
                            setOpenCover(false);
                        }}
                        onClose={() => setOpenCover(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
