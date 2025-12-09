import {useEffect, useState} from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {createBoard} from "../api/boardApi.js";
import axios from "axios";   // ← 이동을 위한 추가

export default function BoardWrite(){

  const nav = useNavigate();   // 페이지 이동 준비

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        console.log("🔑 accessToken:", token);

        axios.get("http://localhost:8080/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                console.log("👤 로그인 유저:", res.data);
                setUserId(res.data.email);
            })
            .catch(err => console.error("유저 정보 조회 실패:", err));
    }, []);

  async function handleSubmit() {
    if(!title.trim()) return alert("제목을 입력해주세요.");
    if(!content.trim()) return alert("내용을 입력해주세요.");

      try {
          const data = {
              title: title,
              content: content
          };

          await createBoard(userId, data);

          alert("게시글이 등록되었습니다.");
          nav("/board");  // ← 글 작성 후 게시판 목록으로 이동
      } catch (err) {
          console.error("등록 오류:", err);
          alert("게시글 등록에 실패했습니다.");
      }
  }

  return (
    <Box sx={{ maxWidth:800, margin:"0 auto", mt:6 }}>
      <h2>📌 새 글 작성</h2>

      <TextField
        label="제목"
        fullWidth
        value={title}
        onChange={e=>setTitle(e.target.value)}
        sx={{ mb:2 }}
      />

      <TextField
        label="내용"
        fullWidth
        multiline
        rows={10}
        value={content}
        onChange={e=>setContent(e.target.value)}
        sx={{ mb:2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
      >
        등록
      </Button>
    </Box>
  );
}
