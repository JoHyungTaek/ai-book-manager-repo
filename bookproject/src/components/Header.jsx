import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const nav = useNavigate();

    return (
        <AppBar position="static" sx={{ background: "#00a9b5" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                {/* 왼쪽 로고 or 타이틀 */}
                <Typography
                    variant="h6"
                    sx={{ cursor: "pointer", fontWeight:"bold" }}
                    onClick={() => nav("/main")}
                >
                    📚 걷기가 서재
                </Typography>

                {/* 오른쪽 메뉴 버튼 영역 */}
                <Box>
                    <Button color="inherit" onClick={() => nav("/book/create")}>책 등록</Button>
                    <Button color="inherit" onClick={() => nav("/books")}>책 목록</Button>
                    <Button color="inherit" onClick={() => nav("/board")}>게시판</Button>
                    <Button color="inherit" onClick={() => nav("/login")}>로그아웃</Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
}
