// 2025-12-05 16:52 소진님 마지막 수정으로 복구

import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        email: "",
        pw: "",
        pwCheck: "",
        nickname: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 백엔드 /auth/signup 호출
    const register = async () => {
        if (!form.email || !form.pw || !form.pwCheck || !form.nickname) {
            alert("모든 항목을 입력해주세요!");
            return;
        }
        if (form.pw !== form.pwCheck) {
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.pw,      // 🔹 백엔드 DTO 필드명에 맞춤
                    nickname: form.nickname
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                alert(data?.message || "회원가입에 실패했습니다.");
                return;
            }

            alert("회원가입이 완료되었습니다!");
            nav("/login");
        } catch (err) {
            console.error(err);
            alert("서버 연결에 실패했습니다.");
        }
    };

    return (
        <Box
            sx={{
                width:"100%", height:"100vh",
                display:"flex", justifyContent:"center", alignItems:"center",
                backgroundColor:"#f5f5f5"
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width:400, p:4,
                    display:"flex", flexDirection:"column",
                    alignItems:"center"
                }}
            >
                <Typography variant="h5" sx={{mb:3, fontWeight:"bold"}}>
                    회원가입
                </Typography>

                <TextField
                    fullWidth label="이메일" name="email"
                    sx={{ mb: 2 }} value={form.email} onChange={handleChange}
                />

                <TextField
                    fullWidth label="닉네임" name="nickname"
                    sx={{ mb: 2 }} value={form.nickname} onChange={handleChange}
                />

                <TextField
                    fullWidth label="비밀번호" name="pw" type="password"
                    sx={{ mb: 2 }} value={form.pw} onChange={handleChange}
                />

                <TextField
                    fullWidth label="비밀번호 확인" name="pwCheck" type="password"
                    sx={{ mb: 4 }} value={form.pwCheck} onChange={handleChange}
                />

                <Button
                    fullWidth variant="contained"
                    sx={{ py: 1.5, fontSize: 17, bgcolor:"#00b6b8" }}
                    onClick={register}
                >
                    가입완료
                </Button>

                <Button
                    fullWidth variant="text" sx={{ mt: 2, fontSize: 16 }}
                    onClick={() => nav("/login")}
                >
                    로그인으로 돌아가기 →
                </Button>

            </Paper>
        </Box>
    );
}
