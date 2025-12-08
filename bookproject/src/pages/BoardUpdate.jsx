import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

export default function BoardUpdate() {
//테스트
  const { id } = useParams();     // /board/123/edit → 123
  const nav = useNavigate();

  // 🔹 수정 전 기존 데이터 (백엔드 연동 시 GET 요청으로 받을 예정)
  const original = {
    title: "📄 게시글 상세 샘플",
    writer: "user01",
    content: "여기는 게시판 상세 내용이 들어가는 영역입니다.\n책 후기, 질문, 정보 공유 등 자유롭게 작성할 수 있어요.",
    likes: 6,
    dislikes: 1,
    updated: "2025-12-05 14:22",
  };

  const [form, setForm] = useState(original);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 저장 버튼
  const save = () => {
    if(!form.title.trim()) return alert("제목을 입력해주세요.");
    if(!form.content.trim()) return alert("내용을 입력해주세요.");

    alert("수정 완료! (백엔드 연동 시 PUT 요청 예정)");
    nav(`/board/${id}`);   // 수정 후 상세보기로 이동
  };

  return (
    <Box sx={{ maxWidth:900, margin:"0 auto", mt:6 }}>

      <Typography fontSize={22} fontWeight="bold" color="#666" mb={4}>
        게시판 &gt; 글 수정
      </Typography>

      <Typography fontSize={20} fontWeight={700}>제목</Typography>
      <TextField
        fullWidth
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb:3 }}
      />

      <Typography fontSize={20} fontWeight={700}>내용</Typography>
      <TextField
        fullWidth
        name="content"
        value={form.content}
        multiline
        rows={10}
        onChange={handleChange}
        sx={{ mb:3 }}
      />

      {/* 작성자 / 수정일 표시 (수정 불가) */}
      <Typography fontSize={14} color="#666" sx={{mt:1}}>
        작성자: {original.writer}
      </Typography>
      <Typography fontSize={14} color="#666" sx={{mb:4}}>
        마지막 수정: {original.updated}
      </Typography>

      {/* 하단 버튼 영역 */}
      <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:4 }}>
        <Button
          variant="contained"
          sx={{ px:6, py:1.4, fontSize:18, bgcolor:"#00b6b8" }}
          onClick={save}
        >
          저장하기
        </Button>

        <Button
          variant="outlined"
          sx={{ px:6, py:1.4, fontSize:18, borderColor:"#ff4b4b", color:"#ff4b4b" }}
          onClick={()=>nav(`/board/${id}`)}
        >
          취소
        </Button>
      </Box>

    </Box>
  );
}
