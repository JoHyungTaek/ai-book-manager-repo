import { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi";
import api from "../api/axios";

export default function BoardWrite() {
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // ✅ /auth/me로 로그인 사용자 정보 가져오기
        api
            .get("/auth/me")
            .then((res) => {
                console.log("👤 로그인 유저:", res.data);
                // 게시판은 String userId를 받는 구조라 email 사용
                setUserId(res.data.email);
            })
            .catch((err) => {
                console.error("유저 정보 조회 실패:", err);
                alert("로그인이 필요합니다. 다시 로그인 해주세요.");
                nav("/login");
            });
    }, [nav]);

    async function handleSubmit() {
        if (!title.trim()) return alert("제목을 입력해주세요.");
        if (!content.trim()) return alert("내용을 입력해주세요.");
        if (!userId) return alert("로그인 정보가 없습니다.");

        try {
            const data = { title, content };
            await createBoard(data, userId);
            alert("등록 완료!");
            nav("/board");
        } catch (e) {
            console.error(e);
            alert("등록 실패");
        }
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
            <h2>게시글 작성</h2>

            <TextField
                fullWidth
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ my: 2 }}
            />

            <TextField
                fullWidth
                label="내용"
                multiline
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ my: 2 }}
            />

            <Button variant="contained" fullWidth onClick={handleSubmit}>
                등록
            </Button>
        </Box>
    );
}
