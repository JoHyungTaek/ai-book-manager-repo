import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/login", { email, password });

            const accessToken = res.data?.accessToken;
            const refreshToken = res.data?.refreshToken;

            if (!accessToken) {
                alert("로그인 응답에 accessToken이 없습니다.");
                return;
            }

            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

            // (기존 프로젝트에서 쓰면 유지)
            localStorage.setItem("loginUser", JSON.stringify(res.data));

            alert("로그인 성공!");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("로그인 실패");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        style={{ width: "100%", padding: "10px" }}
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    로그인
                </button>
            </form>
        </div>
    );
}
