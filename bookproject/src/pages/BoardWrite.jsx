import { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi.js";
import axios from "axios"; // ← 이동을 위한 추가

export default function BoardWrite() {
    const nav = useNavigate(); // 페이지 이동 준비

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState(null);

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
                setUserId(res.data.email);
            })
            .catch((err) => console.error("유저 정보 조회 실패:", err));
    }, []);

    async function handleSubmit() {
        if (!title.trim()) return alert("제목을 입력해주세요.");
        if (!content.trim()) return alert("내용을 입력해주세요.");

        try {
            const data = {
                title: title,
                content: content,
            };

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
