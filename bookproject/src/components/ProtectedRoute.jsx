import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
//     const loginUser = localStorage.getItem("loginUser"); // 로그인 여부 확인
//
//     if (!loginUser) {
//         alert("로그인이 필요합니다.");
//         return <Navigate to="/login" replace />;
//     }

    return children; // 로그인 상태이면 원래 페이지 입장 허용
}
