import { useState } from "react";
import { 
  Box, Typography, Button, Divider, TextField, Paper, IconButton 
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";

export default function BoardDetail(){

  const nav = useNavigate();
  const { id } = useParams();   // /board/:id

  const loginUser = "user01";   // 로그인 사용자 (백 연결 후 변경 예정)

  // 📌 게시글
  const [post, setPost] = useState({
    id,
    title: "📄 게시글 상세 샘플",
    writer: "user01",
    content: "여기는 게시판 상세 내용이 들어가는 영역입니다.\n책 후기, 질문, 정보 공유 등 자유롭게 작성할 수 있어요.",
    likes: 6,
    dislikes: 1,
    updated: "2025-12-05 14:22",
  });

  // 👍👎 상태
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // 👍 좋아요 토글
  const handleLike = () => {
    if(isLiked){
      setPost({...post, likes: post.likes - 1});
      setIsLiked(false);
    } else {
      setPost({...post, likes: post.likes + 1});
      setIsLiked(true);

      if(isDisliked){
        setPost(prev => ({...prev, dislikes: prev.dislikes - 1}));
        setIsDisliked(false);
      }
    }
  };

  // 👎 싫어요 토글
  const handleDislike = () => {
    if(isDisliked){
      setPost({...post, dislikes: post.dislikes - 1});
      setIsDisliked(false);
    } else {
      setPost({...post, dislikes: post.dislikes + 1});
      setIsDisliked(true);

      if(isLiked){
        setPost(prev => ({...prev, likes: prev.likes - 1}));
        setIsLiked(false);
      }
    }
  };

  // ✍️ 댓글 영역
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([
    { id:1, user:"readerA", text:"잘 읽었습니다!", date:"2025-12-04 10:40" },
    { id:2, user:"readerB", text:"좋은 글이네요!", date:"2025-12-05 12:10" }
  ]);

  const handleAdd = () => {
    if(!comment.trim()) return alert("댓글을 입력하세요!");

    const time = new Date().toISOString().slice(0,16).replace("T"," ");

    setCommentList([...commentList, {
      id: Date.now(),
      user: loginUser,
      text: comment,
      date: time
    }]);
    setComment("");
  };

  const handleDeleteComment = (id, user) =>{
    if(user !== loginUser) return alert("본인 댓글만 삭제 가능합니다.");
    setCommentList(commentList.filter(c=>c.id!==id));
  };

  // 🔥 게시글 삭제 (본인만)
  const handlePostDelete = () =>{
    if(loginUser !== post.writer) return alert("삭제 권한이 없습니다.");
    if(confirm("정말 삭제하시겠습니까?")){
      alert("게시글이 삭제되었습니다.");
      nav("/board");
    }
  };

  // 🔧 수정 페이지 이동
  const goUpdate = () => {
    if(loginUser !== post.writer) return alert("수정 권한이 없습니다.");
    nav(`/board/update/${id}`);
  }

  return(
    <Box sx={{ maxWidth:900, margin:"0 auto", py:5 }}>

      {/* 뒤로가기 */}
      <Button variant="outlined" sx={{mb:3}} onClick={()=>nav("/board")}>
        ← 게시판으로 돌아가기
      </Button>

      {/* 제목 */}
      <Typography variant="h5" fontWeight={700}>{post.title}</Typography>
      <Typography color="gray" fontSize="0.95rem" mt={1}>
        작성자 : {post.writer} · 마지막 수정 {post.updated}
      </Typography>

      {/* 내용 */}
      <Box mt={3} fontSize="1.15rem" sx={{whiteSpace:"pre-line", lineHeight:1.7}}>
        {post.content}
      </Box>

      {/* 좋아요/싫어요 */}
      <Box sx={{ display:"flex", alignItems:"center", gap:2, mt:4, mb:3 }}>
        <ThumbUpAltIcon 
          onClick={handleLike}
          sx={{cursor:"pointer", color:isLiked?"#1e88e5":"inherit"}}
        /> {post.likes}

        <ThumbDownAltIcon 
          onClick={handleDislike}
          sx={{cursor:"pointer", ml:2, color:isDisliked?"#e53935":"inherit"}}
        /> {post.dislikes}

        <PersonIcon sx={{ml:2, opacity:.7}}/> {post.writer}
      </Box>

      <Divider sx={{my:4}}/>

      {/* 🔥 본인 작성글일 경우만 수정·삭제 */}
      {loginUser === post.writer && (
        <Box sx={{display:"flex", gap:2, justifyContent:"center"}}>
          <Button variant="outlined" onClick={goUpdate}>수정하기</Button>
          <Button variant="outlined" color="error" onClick={handlePostDelete}>삭제하기</Button>
        </Box>
      )}

      {/* 댓글 목록 */}
      <Box mt={6}>
        <Typography variant="h6" mb={2}>💬 댓글 {commentList.length}개</Typography>

        {commentList.map(c=>(
          <Paper key={c.id} sx={{p:2, mb:1, display:"flex", justifyContent:"space-between"}}>
            <Box>
              <b>{c.user}</b> : {c.text}
              <Typography fontSize={12} color="gray">📅 {c.date}</Typography>
            </Box>

            {c.user === loginUser && (
              <IconButton onClick={()=>handleDeleteComment(c.id, c.user)}>
                <DeleteIcon/>
              </IconButton>
            )}
          </Paper>
        ))}

        {/* 댓글 작성 */}
        <TextField 
          fullWidth 
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          placeholder="댓글을 입력하세요..." 
          sx={{mt:2}} 
        />
        <Button variant="contained" fullWidth sx={{mt:1}} onClick={handleAdd}>
          댓글 등록
        </Button>
      </Box>
    </Box>
  );
}
