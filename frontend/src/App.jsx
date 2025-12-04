import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/hello")
            .then((res) => setMsg(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>프론트엔드 - 백엔드 연동 테스트</h1>
            <p>백엔드 응답: {msg}</p>
        </div>
    );
}

export default App;