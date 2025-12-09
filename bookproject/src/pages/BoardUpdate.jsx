import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import axios from "axios";
 
export default function BoardUpdate() {
  const { id } = useParams();     // /board/update/:id
  const nav = useNavigate();
 
  const [loginUser, setLoginUser] = useState(null); // 로그인 사용자 이메일
  const [form, setForm] = useState(null);           // 수정폼 데이터
  const [loading, setLoading] = useState(true);
 
  // ===========================
  // 🔐 로그인 유저 정보 불러오기
  // ===========================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
 
    axios.get("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setLoginUser(res.data.email))
    .catch(err => console.error("로그인 사용자 조회 실패:", err));
  }, []);
 
  // ===========================
  // 📌 기존 게시글 불러오기
  // ===========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBoardDetail(id);
       
        // 수정 권한 확인
        if (data.user.email !== loginUser && loginUser !== null) {
          alert("해당 게시글에 대한 수정 권한이 없습니다.");
          return nav(`/board/${id}`);
        }
 
        setForm({
          title: data.title,
          content: data.content,
          writer: data.user.nickname || data.user.email,
          updated: data.updatedAt ?? "정보 없음"
        });
 
        setLoading(false);
       
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글 정보를 불러올 수 없습니다.");
      }
    };
    load();
  }, [id, loginUser]);
 
  if (loading || !form) {
    return <Typography align="center" mt={10}>게시글을 불러오는 중...</Typography>;
  }
 
  // ===========================
  // ✏ 입력 변경 처리
  // ===========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  // ===========================
  // 💾 저장하기
  // ===========================
  const save = async () => {
    if (!form.title.trim()) return alert("제목을 입력해주세요.");
    if (!form.content.trim()) return alert("내용을 입력해주세요.");
 
    try {
      await updateBoard(id, {
        title: form.title,
        content: form.content,
      });
 
      alert("수정이 완료되었습니다!");
      nav(`/board/${id}`);
 
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
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
        multiline
        rows={10}
        name="content"
        value={form.content}
        onChange={handleChange}
        sx={{ mb:3 }}
      />
 
      {/* 작성자 / 수정일 */}
      <Typography fontSize={14} color="#666" sx={{mt:1}}>
        작성자: {form.writer}
      </Typography>
      <Typography fontSize={14} color="#666" sx={{mb:4}}>
        마지막 수정: {form.updated}
      </Typography>
 
      {/* 버튼 영역 */}
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
          onClick={() => nav(`/board/${id}`)}
        >
          취소
        </Button>
      </Box>
 
    </Box>
  );
}
