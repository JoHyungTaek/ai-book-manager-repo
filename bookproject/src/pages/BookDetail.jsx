import { useState, useEffect } from "react";
import { 
    Box, Typography, Button, Divider, TextField, Paper, IconButton 
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";

export default function BookDetail(){

    const nav = useNavigate();
    const { id } = useParams();

    // 🔐 로그인 유저
    const loginUser = JSON.parse(localStorage.getItem("loginUser"))?.nickname || null;

    // 📌 책 데이터
    const [book, setBook] = useState(null);

    // 📌 댓글 관리
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        1) Book + 댓글 불러오기
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    useEffect(() => {
        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const target = books.find(b => b.id == id);

        if(!target){
            alert("존재하지 않는 책입니다.");
            return nav("/books");
        }

        setBook(target);
        setCommentList(target.comments || []);
    }, [id, nav]);


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        2) 좋아요 토글 (저장까지 반영)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function toggleLike(){
        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const idx = books.findIndex(b => b.id == id);

        const liked = books[idx].isLiked || false;
        books[idx].likes = liked ? books[idx].likes-1 : books[idx].likes+1;
        books[idx].isLiked = !liked;

        localStorage.setItem("books", JSON.stringify(books));
        setBook({...books[idx]});
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        3) 댓글 추가 저장
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function addComment(){
        if(!loginUser) return alert("로그인이 필요합니다!");
        if(!comment.trim()) return alert("댓글을 입력해주세요!");

        const newComment = {
            id: Date.now(),
            user: loginUser,
            text: comment,
            date: new Date().toISOString().slice(0,16).replace("T"," "),
        };

        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const idx = books.findIndex(b => b.id == id);

        books[idx].comments = [...(books[idx].comments || []), newComment];
        localStorage.setItem("books", JSON.stringify(books));

        setCommentList(books[idx].comments);
        setComment("");
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        4) 댓글 삭제 (본인만)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function deleteComment(cid, user){
        if(user !== loginUser) return alert("본인 댓글만 삭제할 수 있습니다.");

        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const idx = books.findIndex(b => b.id == id);

        books[idx].comments = books[idx].comments.filter(c=>c.id!==cid);
        localStorage.setItem("books", JSON.stringify(books));

        setCommentList(books[idx].comments);
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        5) 🔥 수정 버튼 (본인만 표시)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function goUpdate(){
        if(loginUser !== book.writer) return alert("수정 권한이 없습니다.");
        nav(`/book/update/${id}`);
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        6) 삭제 (본인만)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function deleteBook(){
        if(book.writer !== loginUser) return alert("삭제 권한이 없습니다.");
        if(!window.confirm("정말 삭제하시겠습니까?")) return;

        let books = JSON.parse(localStorage.getItem("books") || "[]");
        books = books.filter(b => b.id != id);
        localStorage.setItem("books", JSON.stringify(books));

        alert("삭제 완료!");
        nav("/books");
    }


    if(!book) return <div>Loading...</div>;


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ UI ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    return(
        <Box sx={{ width:"100%", maxWidth:"1100px", mx:"auto", mt:3 }}>

            <Typography fontSize={22} fontWeight="bold" color="#666" mb={3}>
                📚 도서 상세 페이지
            </Typography>

            <Button variant="outlined" sx={{mb:3}} onClick={()=>nav("/books")}>
                ← 목록으로
            </Button>

            <Box sx={{ display:"flex", gap:5 }}>
                <img src={book.imageUrl || book.img}
                     alt={book.title}
                     style={{width:"300px", height:"420px", borderRadius:"6px"}}
                />

                <Box sx={{flex:1}}>
                    <Typography fontSize={22}><b>카테고리:</b> {book.category}</Typography>
                    <Typography fontSize={22} mt={1}><b>제목:</b> {book.title}</Typography>
                    <Typography fontSize={22} mt={1}><b>저자:</b> {book.author||"정보 없음"}</Typography>
                    <Typography fontSize={22} mt={1}><b>내용:</b> {book.content}</Typography>

                    <Box sx={{mt:4, display:"flex", alignItems:"center", gap:2}}>
                        <ThumbUpAltIcon onClick={toggleLike}
                            style={{cursor:"pointer", color:book.isLiked?"#1E90FF":"gray"}}/>
                        {book.likes||0}
                        <PersonIcon sx={{ml:2}}/> {book.writer}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{mt:4, mb:4}}/>

            {/* ⭐⭐⭐ 수정+삭제 버튼 추가됨 ⭐⭐⭐ */}
            {loginUser===book.writer && (
                <Box sx={{display:"flex", justifyContent:"center", gap:2}}>
                    <Button variant="outlined" onClick={goUpdate}>수정</Button>
                    <Button variant="outlined" color="error" onClick={deleteBook}>삭제</Button>
                </Box>
            )}

            {/* ========= 댓글 영역 ========= */}
            <Box sx={{mt:6}}>
                <Typography variant="h6" mb={2}>💬 댓글 {commentList.length}개</Typography>

                {commentList.map(c => (
                    <Paper key={c.id} sx={{p:2, mb:1, display:"flex", justifyContent:"space-between"}}>
                        <Box>
                            <b>{c.user}</b>: {c.text}
                            <Typography fontSize={12} color="gray">📅 {c.date}</Typography>
                        </Box>

                        {c.user === loginUser && (
                            <IconButton onClick={()=>deleteComment(c.id, c.user)}>
                                <DeleteIcon/>
                            </IconButton>
                        )}
                    </Paper>
                ))}

                <TextField fullWidth placeholder="댓글을 입력하세요…"
                    value={comment}
                    onChange={e=>setComment(e.target.value)}
                    sx={{mt:2}}/>
                <Button fullWidth variant="contained" sx={{mt:1}} onClick={addComment}>
                    댓글 등록
                </Button>
            </Box>

        </Box>
    );
}
