// 2025-12-05 16:52 소진님 마지막 수정으로 복구

import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        email: "",
        pw: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const login = async () => {
        if (!form.email || !form.pw) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.pw,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                alert(data?.message || "로그인에 실패했습니다.");
                return;               // ❗ 실패면 여기서 끝, 페이지 안 넘어감
            }

            const data = await res.json();

            // 토큰 내려오면 저장
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }
            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            }

            if (data.nickname) {
                localStorage.setItem("nickname", data.nickname); // ✅ 추가
            }

            alert("로그인 성공!");
            nav("/main");           // 메인 페이지로 이동
        } catch (err) {
            console.error(err);
            alert("서버와 통신에 실패했습니다.");
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f8f8f8",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 5,
                    width: "400px",
                    borderRadius: "14px",
                    textAlign: "center",
                }}
            >
                <Typography fontSize={28} fontWeight="bold" mb={1}>
                    📚 BOOK LOGIN
                </Typography>
                <Typography fontSize={14} mb={4} color="#666">
                    도서 관리 시스템에 로그인하세요
                </Typography>

                <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={form.email}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="비밀번호"
                    name="pw"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 4 }}
                    value={form.pw}
                    onChange={handleChange}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 1.5, fontSize: 18, bgcolor: "#00b6b8" }}
                    onClick={login}
                >
                    로그인
                </Button>

                <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 2, fontSize: 16, color: "#333" }}
                    onClick={() => nav("/register")}
                >
                    회원가입 →
                </Button>
            </Paper>
        </Box>
    );
}
