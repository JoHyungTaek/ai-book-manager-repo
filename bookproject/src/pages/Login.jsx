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
                return; // 실패 시 여기서 종료
            }

            const data = await res.json();


            //    - ProtectedRoute, Header 등에서 로그인 여부 확인용
            const loginUser = {
                id: data.userId ?? data.id ?? null,
                email: data.email ?? form.email,
                nickname: data.nickname ?? data.nickName ?? null,
            };
            localStorage.setItem("loginUser", JSON.stringify(loginUser));


            // 토큰 내려오면 저장
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }
            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            }

            alert("로그인 성공!");
            nav("/main"); // 메인 페이지로 이동
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
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
                    BOOK LOGIN
                </Typography>

                <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="비밀번호"
                    type="password"
                    name="pw"
                    value={form.pw}
                    onChange={handleChange}
                    margin="normal"
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, py: 1.5 }}
                    onClick={login} // ✅ 로그인 함수 연결
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
