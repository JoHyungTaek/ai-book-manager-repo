import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 내 정보 조회 + 수정 페이지
 * - 처음 접속 시 /auth/me 로 내 정보 조회
 * - 닉네임만 변경해도 되고
 * - 현재 비밀번호 + 새 비밀번호로 비밀번호 변경도 가능
 */
export default function MyPage() {
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        currentPassword: "",
        newPassword: "",
    });

    // 입력 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 내 정보 불러오기
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            nav("/login");
            return;
        }

        const fetchMe = async () => {
            try {
                const res = await fetch("http://k8s-default-backends-3f4da00310-50ce291275241507.elb.us-east-2.amazonaws.com/auth/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => null);
                    alert(data?.message || "내 정보를 불러오지 못했습니다.");
                    if (res.status === 401) {
                        nav("/login");
                    }
                    return;
                }

                const data = await res.json();

                setForm((prev) => ({
                    ...prev,
                    email: data.email || "",
                    nickname: data.nickname || "",
                }));
            } catch (err) {
                console.error(err);
                alert("서버와 통신에 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, [nav]);

    // 정보 수정 요청
    const handleUpdate = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            nav("/login");
            return;
        }

        if (!form.nickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("http://k8s-default-backends-3f4da00310-50ce291275241507.elb.us-east-2.amazonaws.com/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nickname: form.nickname,
                    currentPassword: form.currentPassword || null,
                    newPassword: form.newPassword || null,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                alert(data?.message || "회원 정보 수정에 실패했습니다.");
                return;
            }

            alert("회원 정보가 수정되었습니다.");

            // 닉네임 변경 시 로컬스토리지 갱신 → 헤더에 반영
            if (data?.nickname) {
                localStorage.setItem("nickname", data.nickname);
            }

            // 비밀번호 입력칸 초기화
            setForm((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
            }));
        } catch (err) {
            console.error(err);
            alert("서버와 통신에 실패했습니다.");
        }
    };

    if (loading) {
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
                <Typography>내 정보를 불러오는 중입니다...</Typography>
            </Box>
        );
    }

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
                    p: 4,
                    width: "420px",
                    borderRadius: 3,
                    bgcolor: "white",
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                    내 정보 수정
                </Typography>

                {/* 이메일 (readonly) */}
                <TextField
                    label="이메일"
                    name="email"
                    value={form.email}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />

                {/* 닉네임 */}
                <TextField
                    label="닉네임"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <Typography sx={{ mt: 3, mb: 1, fontSize: 14, color: "#666" }}>
                    비밀번호를 변경하지 않으려면 아래 칸은 비워두면 됩니다.
                </Typography>

                {/* 현재 비밀번호 */}
                <TextField
                    label="현재 비밀번호"
                    name="currentPassword"
                    type="password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* 새 비밀번호 */}
                <TextField
                    label="새 비밀번호"
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, py: 1.2, fontSize: 16, bgcolor: "#00a9b5" }}
                    onClick={handleUpdate}
                >
                    저장하기
                </Button>

                <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 1, fontSize: 14 }}
                    onClick={() => nav("/main")}
                >
                    메인으로 돌아가기 →
                </Button>
            </Paper>
        </Box>
    );
}
