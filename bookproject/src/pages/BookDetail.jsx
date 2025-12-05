import { useState } from "react";
import { 
    Box, Typography, Button, Divider, TextField, Paper, IconButton 
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";

export default function BookDetail() {

    const nav = useNavigate();
    const { id } = useParams();

    // 로그인 사용자
    const loginUser = "aibles08";

    // 도서 상세 정보 state
    const [book, setBook] = useState({
        id,
        title:"책 먹는 여우",
        author:"프란치스카 비어만",
        category:"유아도서",
        content:"유익한 내용 요약 예시입니다.",
        img:"https://image.aladin.co.kr/product/8/47/cover/s9788937864472.jpg",
        likes: 4,
        dislikes: 1,
        writer:"aibles08",              // 해당 책을 등록한 사용자
        updated:"2025-12-04 16:11",
    });

    // 👍 좋아요/👎 싫어요 토글 상태 저장
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    // 👍 좋아요 토글
    const handleLike = () => {
        if(isLiked){
            setBook({...book, likes: book.likes - 1});
            setIsLiked(false);
        } else {
            setBook({...book, likes: book.likes + 1});
            setIsLiked(true);

            // 싫어요 눌린 상태면 취소
            if(isDisliked){
                setBook(prev => ({...prev, dislikes: prev.dislikes - 1}));
                setIsDisliked(false);
            }
        }
    };

    // 👎 싫어요 토글
    const handleDislike = () => {
        if(isDisliked){
            setBook({...book, dislikes: book.dislikes - 1});
            setIsDisliked(false);
        } else {
            setBook({...book, dislikes: book.dislikes + 1});
            setIsDisliked(true);

            // 좋아요 눌러져 있으면 취소
            if(isLiked){
                setBook(prev => ({...prev, likes: prev.likes - 1}));
                setIsLiked(false);
            }
        }
    };

    // 🔥 댓글 state
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([
        { id:1, user:"reader01", text:"재밌는 책이었어요!", date:"2025-12-04 10:21"},
        { id:2, user:"reader02", text:"아이랑 같이 읽었어요", date:"2025-12-05 09:14"}
    ]);

    // 댓글 추가 (날짜 자동 저장)
    const handleAddComment = () => {
        if(!comment.trim()) return alert("댓글 내용을 입력해주세요!");

        const now = new Date();
        const time = now.toISOString().slice(0,16).replace("T"," "); // YYYY-MM-DD HH:mm 형식

        setCommentList([...commentList, {
            id:Date.now(),
            user:loginUser,
            text:comment,
            date:time
        }]);

        setComment("");
    };

    // 댓글 삭제 (본인만 가능)
    const handleCommentDelete = (id, user) => {
        if(user !== loginUser) return alert("본인 댓글만 삭제할 수 있습니다.");
        setCommentList(commentList.filter(c => c.id !== id));
    };

    // 수정 페이지 이동
    const goUpdate = () => {
        if(loginUser !== book.writer) return alert("수정 권한이 없습니다.");
        nav(`/book/update/${id}`);
    };

    // 책 삭제
    const handleDeleteBook = () => {
        if(loginUser !== book.writer) return alert("삭제 권한이 없습니다.");
        if(confirm("정말 삭제하시겠습니까?")){
            alert("삭제 완료!");
            nav("/books");
        }
    };

    return(
        <Box sx={{ width:"100%", maxWidth:"1100px", mx:"auto", mt:3 }}>

            <Typography fontSize={22} fontWeight="bold" color="#666" mb={3}>
                📚 도서 상세 페이지
            </Typography>

            {/* 🔙 목록으로 돌아가기 */}
            <Button variant="outlined" sx={{mb:3}} onClick={()=>nav("/books")}>
                ← 목록으로 돌아가기
            </Button>

            {/* ----------- 책 정보 UI ----------- */}
            <Box sx={{ display:"flex", gap:5 }}>
                <img 
                    src={book.img} 
                    alt={book.title}
                    style={{width:"300px", height:"420px", borderRadius:"6px"}}
                />

                <Box sx={{flex:1}}>
                    <Typography fontSize={22}><b>카테고리:</b> {book.category}</Typography>
                    <Typography fontSize={22} mt={2}><b>제목:</b> {book.title}</Typography>
                    <Typography fontSize={22} mt={2}><b>저자:</b> {book.author}</Typography>
                    <Typography fontSize={22} mt={2}><b>내용:</b> {book.content}</Typography>

                    {/* 좋아요 / 싫어요 버튼 */}
                    <Box sx={{mt:4, display:"flex", alignItems:"center", gap:2}}>
                        <ThumbUpAltIcon 
                            onClick={handleLike}
                            sx={{cursor:"pointer", color:isLiked ? "#1e88e5" : "inherit"}}
                        /> {book.likes}

                        <ThumbDownAltIcon 
                            onClick={handleDislike}
                            sx={{cursor:"pointer", ml:2, color:isDisliked ? "#e53935" : "inherit"}}
                        /> {book.dislikes}

                        <PersonIcon sx={{ml:2}}/> {book.writer}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{mt:4, mb:4}}/>

            {/* 수정/삭제 — 본인글일 경우만 표시 */}
            {loginUser === book.writer && (
                <Box sx={{display:"flex", justifyContent:"center", gap:3}}>
                    <Button variant="outlined" onClick={goUpdate}>수정하기</Button>
                    <Button variant="outlined" color="error" onClick={handleDeleteBook}>삭제하기</Button>
                </Box>
            )}

            {/* ----------- 댓글영역 ----------- */}
            <Box sx={{mt:6}}>
                <Typography variant="h6" mb={2}>💬 댓글 {commentList.length}개</Typography>

                {commentList.map(c => (
                    <Paper key={c.id} sx={{p:2, mb:1, display:"flex", justifyContent:"space-between"}}>
                        <Box>
                            <b>{c.user}</b> : {c.text}
                            <Typography fontSize={12} color="gray">📅 {c.date}</Typography>
                        </Box>

                        {c.user === loginUser && (
                            <IconButton onClick={()=>handleCommentDelete(c.id, c.user)}>
                                <DeleteIcon/>
                            </IconButton>
                        )}
                    </Paper>
                ))}

                <TextField 
                    fullWidth 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요..." 
                    sx={{mt:2}} 
                />

                <Button fullWidth variant="contained" sx={{mt:1}} onClick={handleAddComment}>
                    댓글 등록
                </Button>
            </Box>
        </Box>
    );
}
