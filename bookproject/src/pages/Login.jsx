import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        if(!id || !password) return alert("아이디와 비밀번호를 입력하세요.");

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.id === id && u.password === password);

        if(!user) return alert("아이디 또는 비밀번호가 일치하지 않습니다.");

        localStorage.setItem("loginUser", JSON.stringify(user)); // 전체 user 객체 저장(닉네임도 사용 가능)
        alert("로그인 성공!");
        nav("/main");
    };

    return (
        <Box sx={{width:"100%", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", bgcolor:"#f8f8f8"}}>
            <Paper elevation={6} sx={{p:5, width:400, borderRadius:"14px", textAlign:"center"}}>

                <Typography fontSize={28} fontWeight="bold" mb={1}>📚 BOOK LOGIN</Typography>
                <Typography fontSize={14} mb={4} color="#666">아이디로 로그인하세요</Typography>

                <TextField fullWidth label="아이디" sx={{mb:2}}
                    value={id} onChange={e=>setId(e.target.value)}
                />

                <TextField fullWidth label="비밀번호" type="password" sx={{mb:4}}
                    value={password} onChange={e=>setPassword(e.target.value)}
                />

                <Button fullWidth variant="contained" sx={{py:1.5, fontSize:18, bgcolor:"#00b6b8"}} onClick={login}>
                    로그인
                </Button>

                <Button fullWidth variant="text" sx={{mt:2}} onClick={()=>nav("/register")}>
                    회원가입 →
                </Button>

            </Paper>
        </Box>
    );
}
