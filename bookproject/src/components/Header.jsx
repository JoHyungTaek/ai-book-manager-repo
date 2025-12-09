import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const nav = useNavigate();
    const location = useLocation();

    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");
    const storedNickname = localStorage.getItem("nickname");

    // 로그인/회원가입 페이지에서는 메뉴 + 로고 이동 비활성
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    const logout = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem("loginUser");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("nickname");
            nav("/login");
        }
    };

    return (
        <AppBar position="static" sx={{ background: "#00a9b5" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* 🔥 로그인/회원가입 페이지에서는 로고 클릭 비활성화 */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        cursor: isAuthPage ? "default" : "pointer",
                        opacity: isAuthPage ? 0.6 : 1,
                    }}
                    onClick={() => !isAuthPage && nav("/main")}
                >
                    📚 걷기가 서재
                </Typography>

                {/* 🔥 로그인 및 회원가입 페이지에서는 메뉴 숨김 */}
                {!isAuthPage && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={() => nav("/book/create")}
                        >
                            책 등록
                        </Button>
                        <Button color="inherit" onClick={() => nav("/books")}>
                            책 목록
                        </Button>
                        <Button color="inherit" onClick={() => nav("/board")}>
                            게시판
                        </Button>

                        {/* ✅ 내 정보 페이지 이동 */}
                        <Button color="inherit" onClick={() => nav("/me")}>
                            내 정보
                        </Button>

                        {/* ✅ 닉네임 표시는 loginUser 또는 nickname 중 있는 값 사용 */}
                        {(storedNickname || loginUser) && (
                            <Typography
                                sx={{ fontSize: "15px", fontWeight: "500" }}
                            >
                                안녕하세요{" "}
                                {storedNickname ||
                                    loginUser?.nickname ||
                                    loginUser?.id}
                                님!
                            </Typography>
                        )}

                        <Button color="inherit" onClick={logout}>
                            로그아웃
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
