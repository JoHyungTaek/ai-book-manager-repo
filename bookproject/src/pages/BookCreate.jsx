import { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BookCreate() {

    const nav = useNavigate();

    // 🔹 로그인 확인 (없으면 로그인 페이지로 이동)
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if(!loginUser) nav("/login");

    // 🔹 입력 state (author 추가)
    const [form, setForm] = useState({
        title:"",
        author:"",       // ⭐ 새로 추가됨
        content:"",
        category:"",
        imageUrl:""
    });

    const categories = ["소설","시/에세이","과학/기술","철학","자기계발","역사","사회","기타"];

    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }

    // 🔥 LocalStorage 등록
    function handleSubmit(){
        if(!form.title || !form.author || !form.content || !form.category){
            return alert("필수 항목(제목 / 저자 / 내용 / 카테고리)을 입력해주세요.");
        }

        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const time = new Date().toISOString().slice(0,16).replace("T"," ");

        const newBook = {
            id: Date.now(),
            title: form.title,
            author: form.author,     // ⭐ 저장됨
            content: form.content,
            category: form.category,
            imageUrl: form.imageUrl || "",
            writer: loginUser.nickname,       // 작성자
            created: time,
            likes: 0,
            comments:[]
        };

        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));

        alert("📚 도서 등록 완료!");
        nav("/books");
    }

    return(
        <Box sx={{display:"flex", justifyContent:"center", mt:4}}>
            <Paper sx={{width:"700px", p:5, borderRadius:"12px"}} elevation={4}>

                {/* 뒤로가기 */}
                <Button variant="outlined" onClick={()=>nav("/main")} sx={{mb:3}}>
                    ← 메인으로 돌아가기
                </Button>

                <Typography fontSize={28} fontWeight="bold" color="#444" mb={3}>
                    📚 도서 등록
                </Typography>

                {/* 제목 */}
                <Typography fontWeight={700} mt={2}>1) 제목 *</Typography>
                <TextField fullWidth name="title" value={form.title} onChange={handleChange}/>

                {/* ⭐ 저자 입력 추가 */}
                <Typography fontWeight={700} mt={3}>2) 저자 *</Typography>
                <TextField fullWidth name="author" value={form.author} onChange={handleChange}/>

                {/* 내용 */}
                <Typography fontWeight={700} mt={3}>3) 내용 *</Typography>
                <TextField fullWidth name="content" value={form.content} onChange={handleChange}/>

                {/* 카테고리 */}
                <Typography fontWeight={700} mt={3}>4) 카테고리 *</Typography>
                <TextField 
                    select fullWidth
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    SelectProps={{ displayEmpty:true }}
                >
                    <MenuItem value="" disabled>카테고리를 선택하세요</MenuItem>
                    {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                {/* 이미지 */}
                <Typography fontWeight={700} mt={3}>5) 책 표지 URL (선택)</Typography>
                <TextField fullWidth name="imageUrl" value={form.imageUrl} onChange={handleChange}/>

                {/* 제출 */}
                <Button 
                    fullWidth variant="contained"
                    sx={{mt:4, py:1.5, fontSize:18, bgcolor:"#00b6b8"}}
                    onClick={handleSubmit}
                >
                    등록하기
                </Button>

            </Paper>
        </Box>
    );
}
