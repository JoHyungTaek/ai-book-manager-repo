import { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Button, Divider, TextField, Paper, IconButton
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";

import { fetchBoardDetail, deleteBoard } from "../api/boardApi";
import { fetchReplies, addReply, deleteReply } from "../api/replyApi";
import axios from "axios";

export default function BoardDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loginUser, setLoginUser] = useState(null); // { id, email }
  const [post, setPost] = useState(null);

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // ============================
  // 로그인 사용자 정보 조회
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios.get("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setLoginUser({
          id: res.data.id,
          email: res.data.email
        });
      })
      .catch(() => setLoginUser(null));
  }, []);

  // ============================
  // 게시글 상세
  // ============================
//   useEffect(() => {
//     const loadPost = async () => {
//       console.log("🔍 fetchBoardDetail 호출");
//       try {
//         const data = await fetchBoardDetail(id);
//         setPost(data);
//       } catch (err) {
//         console.error("게시글 불러오기 실패:", err);
//       }
//     };
//     loadPost();
//   }, [id]);

    const didFetch = useRef(false);

    useEffect(() => {
      if (didFetch.current) return;
      didFetch.current = true;

      const loadPost = async () => {
        try {
          const data = await fetchBoardDetail(id);
          setPost(data);
        } catch (err) {
          console.error("게시글 불러오기 실패:", err);
        }
      };

      loadPost();
    }, [id]);

  // ============================
  // 댓글 목록 로드
  // ============================
  useEffect(() => {
    const loadReplies = async () => {
      try {
        const list = await fetchReplies(id);
        console.log("👇 서버에서 받은 댓글 데이터");
        console.log(list);
        setCommentList(list);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };
    loadReplies();
  }, [id]);

  if (!post) {
    return <Typography align="center" mt={10}>게시글을 불러오는 중...</Typography>;
  }

  // ============================
  // 좋아요 / 싫어요
  // ============================
  const handleLike = () => setIsLiked(prev => !prev);
  const handleDislike = () => setIsDisliked(prev => !prev);

  // ============================
  // 댓글 등록
  // ============================
  const handleAddComment = async () => {
    if (!loginUser) return alert("로그인 후 댓글 작성 가능합니다.");
    if (!comment.trim()) return alert("댓글을 입력하세요!");

    try {
      const res = await addReply(id, comment, loginUser.id); 
      const saved = res.data ?? res;
      setCommentList([...commentList, saved]);
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // ============================
  // 댓글 삭제
  // ============================
  const handleDeleteComment = async (replyId) => {
  if (!loginUser) return alert("로그인 후 이용 가능합니다.");

  const reply = commentList.find(c => c.replyId === replyId);
  if (!reply) return alert("댓글 정보를 불러올 수 없습니다.");

  // 본인 댓글인지 확인
  if (reply.user.id !== loginUser.id) {
    return alert("본인의 댓글만 삭제할 수 있습니다.");
  }

  // 🔥 삭제 확인 알림 추가
  if (!confirm("댓글을 삭제하시겠습니까?")) return;

  try {
    await deleteReply(replyId);
    setCommentList(commentList.filter(c => c.replyId !== replyId));
  } catch (err) {
    console.error("댓글 삭제 실패:", err);
    alert("댓글 삭제 중 오류가 발생했습니다.");
  }
};

  // ============================
  // 게시글 삭제
  // ============================
  const handlePostDelete = async () => {
    if (!loginUser || loginUser.email !== post.user.email) {
      return alert("삭제 권한이 없습니다.");
    }
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteBoard(id);
      alert("게시글이 삭제되었습니다.");
      nav("/board");
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // ============================
  // 게시글 수정 이동
  // ============================
  const goUpdate = () => {
    if (!loginUser || loginUser.email !== post.user.email) {
      return alert("수정 권한이 없습니다.");
    }
    nav(`/board/update/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", py: 5 }}>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => nav("/board")}>
        ← 게시판으로 돌아가기
      </Button>

      <Typography variant="h5" fontWeight={700}>{post.title}</Typography>
      <Typography color="gray" fontSize="0.95rem" mt={1}>
        작성자 : {post.user.nickname || post.user.email} · 조회수 {post.views}
      </Typography>

      <Box mt={3} fontSize="1.15rem" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
        {post.content}
      </Box>

      {/* 좋아요 / 싫어요 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
        <ThumbUpAltIcon
          sx={{ cursor: "pointer", color: isLiked ? "#1e88e5" : "inherit" }}
          onClick={handleLike}
        />
        <ThumbDownAltIcon
          sx={{ cursor: "pointer", ml: 2, color: isDisliked ? "#e53935" : "inherit" }}
          onClick={handleDislike}
        />
        <PersonIcon sx={{ ml: 2, opacity: 0.7 }} />
        {post.user.nickname || post.user.email}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 본인만 수정/삭제 버튼 */}
      {loginUser && loginUser.email === post.user.email && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={goUpdate}>수정하기</Button>
          <Button variant="outlined" color="error" onClick={handlePostDelete}>삭제하기</Button>
        </Box>
      )}

      {/* 댓글 목록 */}
      <Box mt={6}>
        <Typography variant="h6" mb={2}>💬 댓글 {commentList.length}개</Typography>

        {commentList.map(c => (
          <Paper key={c.replyId} sx={{ p: 2, mb: 1, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <b>{c.user?.nickname || c.user?.email || "익명"}</b> : {c.content}
              <Typography fontSize={12} color="gray">
                📅 {c.createAt}
              </Typography>
            </Box>

            {/* 본인만 삭제 버튼 보임 */}
            {loginUser && c.user?.id === loginUser.id && (
  <IconButton onClick={() => handleDeleteComment(c.replyId)}>
    <DeleteIcon />
  </IconButton>
)}
          </Paper>
        ))}

        {/* 댓글 입력 */}
        <TextField
          fullWidth
          multiline
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          sx={{ mt: 2 }}
        />
        <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleAddComment}>
          댓글 등록
        </Button>
      </Box>
    </Box>
  );
}
