import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

// Route Guard 추가
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookUpdate from "./pages/BookUpdate";
import BoardList from "./pages/BoardList";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";
import BoardUpdate from "./pages/BoardUpdate";  // 이서영 추가
import AiBookCover from "./pages/AiBookCover"; // 이유환 추가

function App() {
    return (
        <BrowserRouter>
            <div style={{width:"100%", minHeight:"100vh", display:"flex", flexDirection:"column"}}>

                <Header />

                <div style={{flexGrow:1}}>
                    <Routes>

                        {/* === 로그인 & 회원가입 (보호 X) === */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* === 로그인 해야 들어갈 수 있는 페이지들 🔥 === */}
                        <Route path="/main" element={
                            <ProtectedRoute><Main /></ProtectedRoute>
                        }/>

                        <Route path="/books" element={
                            <ProtectedRoute><BookList /></ProtectedRoute>
                        }/>

                        <Route path="/book/:id" element={
                            <ProtectedRoute><BookDetail /></ProtectedRoute>
                        }/>

                        <Route path="/book/create" element={
                            <ProtectedRoute><BookCreate /></ProtectedRoute>
                        }/>

                        <Route path="/book/update/:id" element={
                            <ProtectedRoute><BookUpdate /></ProtectedRoute>
                        }/>

                        <Route path="/book/update/ai-book-cover" element={
                            <ProtectedRoute><AiBookCover /></ProtectedRoute>
                        } />

                        <Route path="/board" element={
                            <ProtectedRoute><BoardList /></ProtectedRoute>
                        }/>

                        <Route path="/board/:id" element={
                            <ProtectedRoute><BoardDetail /></ProtectedRoute>
                        }/>

                        <Route path="/board/write" element={
                            <ProtectedRoute><BoardWrite /></ProtectedRoute>
                        }/>

                        <Route path="/board/update/:id" element={
                            <ProtectedRoute><BoardUpdate /></ProtectedRoute>
                        }/>
                        

                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
