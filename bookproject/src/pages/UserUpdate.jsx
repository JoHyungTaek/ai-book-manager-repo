import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMyInfo } from "../api/userApi";

export default function UserUpdate() {
    const nav = useNavigate();

    // 화면에 바인딩할 폼 상태
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        currentPassword: "",
        newPassword: "",
        newPasswordCheck: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 공통 change 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 최초 진입 시 내 정보 조회해서 email / nickname 채우기
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const data = await getMyInfo(); // { id, email, nickname }

                setForm((prev) => ({
                    ...prev,
                    email: data.email || "",
                    nickname: data.nickname || "",
                }));
            } catch (err) {
                console.error(err);
                alert("내 정보를 불러오지 못했습니다. 다시 로그인 해주세요.");
                nav("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchMyInfo();
    }, [nav]);

    // 폼 검증 + 서버 전송
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        // 기본 검증
        if (!form.currentPassword.trim()) {
            alert("현재 비밀번호를 입력해주세요.");
            return;
        }

        // 새 비밀번호를 입력한 경우 두 칸 일치 여부 체크
        if (form.newPassword || form.newPasswordCheck) {
            if (form.newPassword.length < 8) {
                alert("새 비밀번호는 8자리 이상으로 입력해주세요.");
                return;
            }
            if (form.newPassword !== form.newPasswordCheck) {
                alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return;
            }
        }

        // 서버에 보낼 payload
        const payload = {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword ? form.newPassword : null,
            nickname: form.nickname,
        };

        try {
            setSubmitting(true);
            const updatedUser = await updateMyInfo(payload);
            // 예상 형태: { id, email, nickname }

            // 헤더에서 쓰는 loginUser 갱신
            if (updatedUser) {
                localStorage.setItem("loginUser", JSON.stringify(updatedUser));
            }

            alert("회원 정보가 수정되었습니다.");
            nav("/"); // 메인으로 이동
        } catch (err) {
            console.error(err);

            alert("정보 수정에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Typography variant="h6">내 정보를 불러오는 중입니다...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                py: 4,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
                >
                    회원 정보 수정
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}
                >
                    이메일은 변경할 수 없고, 닉네임과 비밀번호를 수정할 수 있습니다.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* 이메일 (읽기 전용) */}
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

                <Divider sx={{ my: 3 }} />

                {/* 현재 비밀번호 */}
                <TextField
                    label="현재 비밀번호"
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    helperText="정보 수정을 위해 현재 비밀번호를 다시 입력해주세요."
                />

                {/* 새 비밀번호 */}
                <TextField
                    label="새 비밀번호 (선택)"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* 새 비밀번호 확인 */}
                <TextField
                    label="새 비밀번호 확인"
                    type="password"
                    name="newPasswordCheck"
                    value={form.newPasswordCheck}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* 버튼 영역 */}
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => nav(-1)}
                        disabled={submitting}
                    >
                        돌아가기
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{ bgcolor: "#00b6b8", fontWeight: 600 }}
                    >
                        {submitting ? "저장 중..." : "정보 저장"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
