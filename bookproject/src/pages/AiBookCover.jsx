// src/pages/AiBookCover.jsx
import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, 
  Select, MenuItem, FormControl, InputLabel, Slider, Paper, CircularProgress
} from '@mui/material';
import { useLocation } from 'react-router-dom';

function AiBookCover() {
  const location = useLocation();
  const fromState = location.state || {};

  // 1. 비활성화된 입력 데이터 (외부에서 왔다고 가정, 연결시 DB에서 뽑아내기)
  const [bookInfo] = useState({
    title: fromState.title ,
    content: fromState.content ,
    author: fromState.author,
    category : fromState.category
  });

  // API Key 상태 (보안을 위해 화면에서 입력받음, 추후 연결 시 헤더로 받아오기) 
  const [apiKey, setApiKey] = useState('');

  // 2. 사용자 설정 데이터(초기값)
  const [model, setModel] = useState('dall-e-3');  
  const [quality, setQuality] = useState(50);
  const [style, setStyle] = useState('Cyberpunk, Neon, Highly detailed');
  
  // 3. 결과 상태
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // 진행 상황 표시
  const [generatedImage, setGeneratedImage] = useState(null);

  // --- 핵심 로직: 프론트엔드 단독 처리 ---
  const handleGenerate = async () => {
    if (!apiKey) {
      alert("OpenAI API Key를 입력해주세요!");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setStatusMessage('1단계: 프롬프트 생성 중... '); // (GPT-4o-mini)

    try {
      // Step 1: GPT-4o-mini에게 이미지 프롬프트 생성 요청
      const promptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert prompt engineer for AI Image Generators. Output ONLY the raw English prompt."
            },
            {
              role: "user",
              content: `Create a detailed image generation prompt for a book front cover.
              Book Title: '${bookInfo.title}'
              Author: '${bookInfo.author}'
              Content Summary: '${bookInfo.content}'
              Book Category : '${bookInfo.category}'
              Style: '${style}'
              Quality Level (1-100): ${quality}
              Constraint: The image MUST visually represent the content and style. Include the text '${bookInfo.title}' and '${bookInfo.author}' seamlessly in the design if possible.`
            }
          ]
        })
      });

      const promptData = await promptResponse.json();
      if (promptData.error) throw new Error(promptData.error.message);
      
      const generatedPrompt = promptData.choices[0].message.content;
      console.log("생성된 프롬프트:", generatedPrompt);
      setStatusMessage('2단계: 이미지 생성 중... (' + model + ')');

      // Step 2: 생성된 프롬프트로 이미지 생성 요청 (DALL-E)
      const imagePayload = {
        model: model,
        prompt: generatedPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      };

      if (model === 'dall-e-3') {
        imagePayload.quality = "standard";
      }

      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(imagePayload)
      });

      const imageData = await imageResponse.json();
      if (imageData.error) throw new Error(imageData.error.message);

      setGeneratedImage(imageData.data[0].b64_json);
      setStatusMessage('완료!');

    } catch (error) {
      console.error(error);
      alert("오류 발생: " + error.message);
      setStatusMessage('오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          AI Book Cover 생성기
        </Typography>

        {/* API Key Input */}
        <Box sx={{ mb: 4, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>🔑 API Key 설정</Typography>
          <TextField 
            fullWidth 
            size="small" 
            type="password"
            label="OpenAI API Key (sk-...)" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="여기에 API 키를 붙여넣으세요"
            variant="outlined"
            helperText="이 키는 브라우저 내에서만 사용되며 서버로 전송되지 않습니다."
          />
        </Box>

        {/* ReadOnly Section, 도서 정보 */}
        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" color="textSecondary">📖 도서 정보 (Read Only)</Typography>
          <TextField fullWidth label="도서 제목" value={bookInfo.title} disabled margin="normal" variant="filled" />
          <TextField fullWidth label="작가 명" value={bookInfo.author} disabled margin="normal" variant="filled" />
          <TextField fullWidth label="도서 내용" value={bookInfo.content} disabled multiline rows={2} margin="normal" variant="filled" />
        </Box>

        {/* AI Setting Section, 모델, 품질, 스타일 설정 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>⚙️ 디자인 설정</Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>AI 모델</InputLabel> 
            <Select value={model} label="AI 모델" onChange={(e) => setModel(e.target.value)}>
              <MenuItem value="dall-e-2">DALL-E 2</MenuItem>
              <MenuItem value="dall-e-3">DALL-E 3</MenuItem>
            </Select>
          </FormControl>

          <Typography gutterBottom sx={{ mt: 2 }}>품질 (Quality): {quality}</Typography>
          <Slider 
            value={quality} 
            onChange={(e, val) => setQuality(val)} 
            valueLabelDisplay="auto" 
            min={1} max={100} 
          />

          <TextField 
            fullWidth 
            label="스타일 (예: 실사체, 지브리 그림체)" 
            value={style} 
            onChange={(e) => setStyle(e.target.value)} 
            margin="normal" 
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large" 
            onClick={handleGenerate} 
            disabled={loading}
            sx={{ mt: 3, height: 50, fontSize: '1.1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "AI 표지 생성하기"}
          </Button>
          
          {loading && (
            <Typography align="center" sx={{ mt: 2, color: 'text.secondary' }}>
              {statusMessage}
            </Typography>
          )}
        </Box>

        {/* Result Section */}
        {generatedImage && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="success.main">✨ 생성된 표지</Typography>
            <img 
              src={`data:image/png;base64,${generatedImage}`} 
              alt="Generated Cover" 
              style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} 
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AiBookCover;
