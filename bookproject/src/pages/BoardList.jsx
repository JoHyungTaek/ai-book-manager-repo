import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BoardList() {

  const nav = useNavigate();

  return (
    <Box sx={{ maxWidth:1200, margin:"0 auto", mt:6 }}>
      <Typography variant="h4" sx={{ fontWeight:700, mb:4 }}>
        자유 게시판
      </Typography>

      {/* 🔥 메인으로 돌아가기 버튼 */}
                  <Button 
                      variant="outlined" 
                      onClick={()=>nav("/main")}
                      sx={{mb:3}}
                  >
                      ← 메인으로 돌아가기
                  </Button>

      {/* 게시글 목록 map() 예정 */}
      <Card sx={{ mb:2, cursor:"pointer" }} onClick={()=>nav("/board/1")}>
        <CardContent>
          <Typography variant="h6">첫 번째 게시글입니다.</Typography>
          <Typography variant="body2" color="gray">작성자: user01 | 조회 10 | 좋아요 3</Typography>
        </CardContent>
      </Card>

      <Button 
        variant="contained" 
        sx={{ mt:3, float:"right" }}
        onClick={()=>nav("/board/write")}
      >
        글쓰기
      </Button>
    </Box>
  );
}
