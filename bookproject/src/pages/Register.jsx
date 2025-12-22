import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
    });

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/auth/signup", form);
            alert("회원가입 성공! 로그인 해주세요.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("회원가입 실패");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>회원가입</h2>
            <form onSubmit={handleRegister}>
                <input
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={onChange}
                />
                <input
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={onChange}
                />
                <input
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={onChange}
                />
                <input
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    name="phone"
                    placeholder="전화번호"
                    value={form.phone}
                    onChange={onChange}
                />
                <input
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    name="address"
                    placeholder="주소"
                    value={form.address}
                    onChange={onChange}
                />

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
                    회원가입
                </button>
            </form>
        </div>
    );
}
