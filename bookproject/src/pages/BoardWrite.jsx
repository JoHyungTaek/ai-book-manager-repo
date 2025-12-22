import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BoardWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                // ✅ /api/auth/me 로 변경 (nginx가 /api/만 백엔드로 프록시함)
                const res = await api.get("/api/auth/me");
                setUser(res.data);
            } catch (err) {
                console.error("유저 정보 조회 실패:", err);
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        })();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/boards", { title, content });
            alert("게시글 등록 완료!");
            navigate("/board");
        } catch (err) {
            console.error(err);
            alert("게시글 등록 실패");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>새 글 작성</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
          <textarea
              style={{ width: "100%", height: "240px", padding: "10px" }}
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
                    등록
                </button>
            </form>
        </div>
    );
}
