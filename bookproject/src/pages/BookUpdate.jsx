import { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PersonIcon from "@mui/icons-material/Person";

export default function BookUpdate() {

    const { id } = useParams();
    const nav = useNavigate();

    // 수정 전 기존 데이터 (백엔드 연동 시 GET)
    const original = {
        title: "책 먹는 여우",
        author: "프란치스카 비어만",
        category: "유아도서",
        content: "너무 책을 좋아해서 먹어버린다는 이야기...",
        img: "https://image.aladin.co.kr/product/8/47/cover/s9788937864472.jpg",
        likes: 4,
        writer: "에이블스쿨08",
        updated: "2025-12-04 16:11"
    };

    const [form, setForm] = useState(original);
    const [apiKey, setApiKey] = useState(""); // ← openAI 키 입력값

    const categories = ["유아도서","소설","과학","인문","철학","자기계발","기타"];

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 저장
    const save = () => {
        alert("수정 완료! (백엔드 연동시 PUT 예정)");
        nav(`/book/${id}`);
    };

    return(
        <Box sx={{ width:"100%", maxWidth:"1100px", mx:"auto", mt:4 }}>

            <Typography fontSize={22} fontWeight="bold" color="#666" mb={4}>
                메인페이지 &gt; 도서 수정
            </Typography>

            <Box sx={{ display:"flex", gap:5 }}>

                {/* 좌측 — 이미지 */}
                <Box>
                    <img
                        src={form.img}
                        style={{ width:"300px", height:"420px", borderRadius:"6px" }}
                        alt="book"
                    />
                </Box>

                {/* 우측 — 수정 가능한 필드 */}
                <Box sx={{ flex:1 }}>

                    <Typography fontSize={20} fontWeight={700} mt={0}>카테고리</Typography>
                    <TextField select fullWidth name="category" value={form.category} onChange={handleChange} sx={{mb:2}}>
                        {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>

                    <Typography fontSize={20} fontWeight={700}>제목</Typography>
                    <TextField fullWidth name="title" value={form.title} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700}>저자</Typography>
                    <TextField fullWidth name="author" value={form.author} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700}>내용</Typography>
                    <TextField fullWidth name="content" value={form.content} onChange={handleChange} sx={{mb:2}}/>

                    <Typography fontSize={20} fontWeight={700} mt={1}>책 표지 URL</Typography>
                    <TextField fullWidth name="img" value={form.img} onChange={handleChange} sx={{mb:4}}/>

                    {/* 🔥 OpenAI 키 입력 + 이미지 생성 버튼 */}
                    <Typography fontSize={20} fontWeight={700}>API KEY (이미지 생성 옵션)</Typography>
                    <TextField
                        fullWidth
                        placeholder="OpenAI API 키 입력"
                        value={apiKey}
                        onChange={(e)=>setApiKey(e.target.value)}
                        sx={{mt:1, mb:2}}
                    />

                    <Button variant="outlined" fullWidth sx={{py:1.4, mb:3}}>
                        🔥 이미지 생성하기 (기능은 미구현)
                    </Button>

                    {/* 좋아요/작성자 표시(수정불가 영역) */}
                    <Box sx={{ opacity:.6, display:"flex", alignItems:"center", gap:1 }}>
                        <ThumbUpAltIcon/> {form.likes}
                        <ThumbDownAltIcon sx={{ml:2}}/>
                        <PersonIcon sx={{ml:2}}/> {form.writer}
                    </Box>

                    <Typography fontSize={13} color="#666" mt={1} mb={3}>
                        마지막 수정: {original.updated}
                    </Typography>
                </Box>
            </Box>

            {/* 하단 버튼 */}
            <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:5 }}>
                <Button variant="contained" sx={{px:6, py:1.4, fontSize:18, bgcolor:"#00b6b8"}} onClick={save}>
                    저장하기
                </Button>
                <Button variant="outlined" sx={{px:6, py:1.4, fontSize:18, borderColor:"#ff4b4b", color:"#ff4b4b"}} onClick={()=>nav(`/book/${id}`)}>
                    취소
                </Button>
            </Box>

        </Box>
    );
}
