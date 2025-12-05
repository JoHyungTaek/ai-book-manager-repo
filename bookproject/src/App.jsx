import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";

// Book Pages
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookUpdate from "./pages/BookUpdate";

// Board Pages (추가된 부분)
import BoardList from "./pages/BoardList";
import BoardWrite from "./pages/BoardWrite";
import BoardDetail from "./pages/BoardDetail";
import BoardUpdate from "./pages/BoardUpdate";  // 이서영 추가

function App() {
    return (
        <BrowserRouter>
            <div style={{width:"100%", minHeight:"100vh", display:"flex", flexDirection:"column"}}>

                <Header />

                <div style={{flexGrow:1}}>  {/* ← Header 제외 전체 화면 영역 */}
                    <Routes>
                        {/* 기본 접속 시 로그인 */}
                        <Route path="/" element={<Navigate to="/login" />} />

                        {/* Auth */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Main (대시보드 역할) */}
                        <Route path="/main" element={<Main />} />

                        {/* Book */}
                        <Route path="/books" element={<BookList />} />
                        <Route path="/book/:id" element={<BookDetail />} />
                        <Route path="/book/create" element={<BookCreate />} />
                        <Route path="/book/update/:id" element={<BookUpdate />} />

                        {/* 🔥 Board (자유게시판) */}
                        <Route path="/board" element={<BoardList />} />         {/* 목록 */}
                        <Route path="/board/new" element={<BoardWrite />} />    {/* 글쓰기 */}
                        <Route path="/board/:id" element={<BoardDetail />} />   {/* 상세 + 댓글 */}
                        <Route path="/board/update/:id" element={<BoardUpdate />} />
                    </Routes>
                </div>

            </div>
        </BrowserRouter>
    );
}

export default App;
