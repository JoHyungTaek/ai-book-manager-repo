import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register(){

    const nav = useNavigate();

    const [form, setForm] = useState({
        id:"",
        nickname:"",
        password:"",
        confirm:""
    });

    const [checkId, setCheckId] = useState(false); // 🔥 중복확인 완료 여부 저장

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]: e.target.value});
        if(e.target.name === "id") setCheckId(false); // 아이디 수정 시 중복확인 초기화
    };

    // ======================= 🔥 아이디 중복확인 =======================
    const handleCheckId = () =>{
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const isExist = users.some(u => u.id === form.id);

        if(!form.id) return alert("아이디를 입력해주세요.");

        if(isExist){
            alert("이미 존재하는 아이디입니다.");
            setCheckId(false);
        } else {
            alert("사용 가능한 아이디입니다!");
            setCheckId(true);
        }
    };

    // ======================= 🔥 회원가입 =======================
    const handleRegister = () =>{
        const {id, password, confirm, nickname} = form;

        if(!id || !password || !confirm || !nickname)
            return alert("모든 항목을 입력하세요.");

        if(password !== confirm)
            return alert("비밀번호가 일치하지 않습니다.");

        if(!checkId)
            return alert("아이디 중복확인을 먼저 진행해주세요."); // 🔥 핵심

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push({id, password, nickname});
        localStorage.setItem("users", JSON.stringify(users));

        alert("회원가입이 완료되었습니다! 로그인 해주세요.");
        nav("/login");
    };

    return(
        <Box sx={{
            width:"100%", height:"100vh",
            display:"flex", justifyContent:"center", alignItems:"center",
            bgcolor:"#f8f8f8"
        }}>
            <Paper elevation={6} sx={{p:5, width:400, borderRadius:"14px", textAlign:"center"}}>

                <Typography fontSize={28} fontWeight="bold" mb={1}>📚 회원가입</Typography>
                <Typography fontSize={14} mb={4} color="#666">새 계정을 생성하세요</Typography>

                {/* 아이디 + 중복확인 버튼 */}
                <Box sx={{display:"flex", gap:1, mb:2}}>
                    <TextField fullWidth label="아이디" name="id" value={form.id} onChange={handleChange}/>
                    <Button variant="outlined" onClick={handleCheckId} sx={{whiteSpace:"nowrap"}}>
                        중복확인
                    </Button>
                </Box>

                <TextField fullWidth label="닉네임" name="nickname" value={form.nickname} onChange={handleChange} sx={{mb:2}}/>
                <TextField fullWidth label="비밀번호" name="password" type="password" value={form.password} onChange={handleChange} sx={{mb:2}}/>
                <TextField fullWidth label="비밀번호 확인" name="confirm" type="password" value={form.confirm} onChange={handleChange} sx={{mb:4}}/>

                <Button fullWidth variant="contained" sx={{py:1.5, fontSize:18, bgcolor:"#00b6b8"}} onClick={handleRegister}>
                    가입하기
                </Button>

                <Button fullWidth variant="text" sx={{mt:2, fontSize:16}} onClick={()=>nav("/login")}>
                    로그인 →
                </Button>

            </Paper>
        </Box>
    );
}
