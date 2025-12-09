import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBoard } from "../api/boardApi";
 
export default function BoardList() {
 
  const nav = useNavigate();
  const [boards, setBoards] = useState([]);
 
  // 📌 게시글 목록 가져오기
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const list = await fetchBoard();   // content 배열만 반환됨
        console.log("📌 불러온 게시글:", list);
        setBoards(list);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };
 
    loadBoards();
  }, []);
 
  const isEmpty = boards.length === 0;
 
  return (
    <Box sx={{ maxWidth:1200, margin:"0 auto", mt:6 }}>
 
      <Typography variant="h4" sx={{ fontWeight:700, mb:4 }}>
        자유 게시판
      </Typography>
 
      <Button
        variant="outlined"
        onClick={() => nav("/main")}
        sx={{ mb:3 }}
      >
        ← 메인으로 돌아가기
      </Button>
 
      {/* 📌 게시글 없을 때 */}
      {isEmpty && (
        <Typography sx={{ mt:4, textAlign:"center" }} color="gray">
          게시글이 없습니다.
        </Typography>
      )}
 
      {/* 📌 게시글 있을 때 */}
      {!isEmpty &&
        boards.map((board) => (
          <Card
            key={board.boardId}
            sx={{ mb:2, cursor:"pointer", p:2, boxShadow:"0 0 6px rgba(0,0,0,0.1)" }}
            onClick={() => nav(`/board/${board.boardId}`)}
          >
            <CardContent>
              {/* 제목 */}
              <Typography variant="h6" sx={{ fontWeight:600 }}>
                {board.title}
              </Typography>
 
              {/* 작성자 + 조회수 */}
              <Typography variant="body2" color="gray" sx={{ mt:1 }}>
                작성자: {board.user?.nickname || board.user?.email || "알 수 없음"}
                {"  |  "}
                조회수: {board.views ?? 0}
              </Typography>
 
              {/* 날짜 표시 */}
              {board.createdDate && (
                <Typography variant="caption" color="gray">
                  {board.createdDate.split("T")[0]}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      }
 
      {/* 글쓰기 버튼 */}
      <Button
        variant="contained"
        sx={{ mt:3, float:"right" }}
        onClick={() => nav("/board/write")}
      >
        글쓰기
      </Button>
 
    </Box>
  );
}
