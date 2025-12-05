import { Box, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BookList() {

    const nav = useNavigate();

    // 🔥 LocalStorage에서 도서 목록 불러오기
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    const isEmpty = books.length === 0;

    return (
        <Box sx={{ width:"100%", maxWidth:"1000px", mx:"auto", mt:4 }}>

            {/* 🔥 메인으로 돌아가기 버튼 */}
            <Button 
                variant="outlined" 
                onClick={()=>nav("/main")}
                sx={{mb:3}}
            >
                ← 메인으로 돌아가기
            </Button>

            <Typography fontSize={22} fontWeight="bold" mb={4} color="#666">
                메인페이지 &gt; 도서 목록
            </Typography>

            {/* =====================================================================================
                📌 ① 책이 없을 경우
            ===================================================================================== */}
            {isEmpty && (
                <Box sx={{ textAlign:"center", mt:10 }}>
                    <Typography fontSize={24} fontWeight="600" mb={3}>
                        등록된 도서가 없습니다 📚
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ fontSize:18, borderRadius:3, bgcolor:"#00b6b8", px:4, py:1.2 }}
                        onClick={() => nav("/book/create")}
                    >
                        📖 책 등록하러 가기
                    </Button>
                </Box>
            )}

            {/* =====================================================================================
                📌 ② 책 목록 렌더링 — LocalStorage 데이터 기반
            ===================================================================================== */}
            {!isEmpty && books.map(book => (
                <Card
                    key={book.id}
                    sx={{
                        p:2, mb:4, display:"flex", alignItems:"center",
                        borderRadius:4, boxShadow:"0 0 10px rgba(0,0,0,0.08)",
                        cursor:"pointer"
                    }}
                    onClick={() => nav(`/book/${book.id}`)}
                >
                    {/* 이미지 */}
                    <CardMedia
                        component="img"
                        src={book.imageUrl || "https://via.placeholder.com/120x160?text=No+Image"}
                        alt={book.title}
                        sx={{ width:120, height:160, borderRadius:2, mr:3 }}
                    />

                    {/* 본문 */}
                    <CardContent sx={{ flexGrow:1 }}>

                        <Typography fontSize={22} fontWeight="700" mt={1}>
                            제목: {book.title}
                        </Typography>

                        <Typography fontSize={18} fontWeight="600">
                            카테고리: {book.category}
                        </Typography>
               
                        <Typography fontSize={18} fontWeight="500" mt={1} color="#666">
                            작성자 : {book.writer}
                        </Typography>

                        <Box sx={{ display:"flex", alignItems:"center", gap:1, mt:2 }}>
                            👍 좋아요 {book.likes ?? 0}
                        </Box>
                    </CardContent>
                </Card>
            ))}

            {/* 목록이 있을 때만 더보기 버튼 */}
            {!isEmpty && (
                <Box sx={{ display:"flex", justifyContent:"center", mt:3 }}>
                    <Button variant="outlined" sx={{ px:4, py:1.2, fontSize:18 }}>
                        더보기
                    </Button>
                </Box>
            )}
        </Box>
    );
}
