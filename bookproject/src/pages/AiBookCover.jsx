  // src/pages/AiBookCover.jsx
  import React, { useState } from "react";
  import {
    Container,  TextField,  Button,  Typography,  Box,  Select,  MenuItem,  FormControl,
    InputLabel,  Slider,  Paper,  CircularProgress,  IconButton,  Tooltip,
  } from "@mui/material";
  import { useLocation , useNavigate } from "react-router-dom";
  import ClearIcon from "@mui/icons-material/Clear";
  import CloseIcon from "@mui/icons-material/Close";

  function AiBookCover(props) {
    // 🔹 팝업 모드에서 넘어오는 props (없으면 undefined)
    const {
      bookId: propBookId,
      bookTitle: propBookTitle,
      author: propAuthor,
      content: propContent,
      category: propCategory,
      onSelect,
      onClose,
    } = props || {};

    const location = useLocation();
    const navigate = useNavigate();
    const fromState = location.state || {};

    // 🔹 bookId / 도서 정보: props가 우선, 없으면 location.state 사용
    const bookId = propBookId ?? fromState.bookId;

    // 1. 비활성화된 입력 데이터 (BookUpdate에서 넘어온 값 우선 사용)
    const [bookInfo] = useState({
      bookTitle: propBookTitle ?? fromState.bookTitle,
      content: propContent ?? fromState.content,
      author: propAuthor ?? fromState.author,
      category: propCategory ?? fromState.category
    });

    // API Key (브라우저에서 직접 입력)
    const [apiKey, setApiKey] = useState("");

    // 2. 사용자 설정 데이터
    const [model, setModel] = useState("dall-e-3");
    const [quality, setQuality] = useState(50);
    const [style, setStyle] = useState("fairytale");
    const [numImages, setNumImages] = useState(1); 

    // 3. 결과 상태
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [generatedImages, setGeneratedImages] = useState([]); // 여러 장 (URL 배열)
    const [selectedImage, setSelectedImage] = useState(null);   // 선택된 1장 (URL)

    // --- 핵심 로직: 프론트엔드 단독 처리 ---
    const handleGenerate = async () => {
      if (!apiKey) {
        alert("OpenAI API Key를 입력해주세요!");
        return;
      }

      setLoading(true);
      // 이전 이미지/선택은 유지
      const oldCount = generatedImages.length;
      setStatusMessage("1단계: 프롬프트 생성 중... (gpt-4o-mini)");

      try {
        // Step 1: GPT-4o-mini에게 이미지 프롬프트 생성 요청 (1번만)
        const promptResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert prompt engineer for AI Image Generators. Output ONLY the raw English prompt.",
                },
                {
                  role: "user",
                  content: `Create a detailed image generation prompt for a front cover of a book.
                  Book Title: '${bookInfo.bookTitle}'
                  Author: '${bookInfo.author}'
                  Content Summary: '${bookInfo.content}'
                  Book Category : '${bookInfo.category}'
                  Style: '${style}'
                  Quality Level (1-100): ${quality}
                  Constraint: The image MUST visually represent the content and style. Include the text '${bookInfo.bookTitle}' and '${bookInfo.author}' seamlessly in the design if possible.`,
                },
              ],
            }),
          }
        );

        const promptData = await promptResponse.json();
        if (promptData.error) throw new Error(promptData.error.message);

        const generatedPrompt = promptData.choices[0].message.content;
        console.log("생성된 프롬프트:", generatedPrompt);

        setStatusMessage(
          `2단계: 이미지 ${numImages}장 생성 중... (각각 별도 요청)`
        );

        //  Step 2: 생성된 프롬프트로 이미지 생성 요청을 numImages번 반복 (항상 n:1)
        const newImgs = [];
        for (let i = 0; i < numImages; i++) {
          setStatusMessage(
            `2단계: 이미지 생성 중... (${i + 1}/${numImages})`
          );

          const imagePayload = {
            model: model,
            prompt: generatedPrompt,
            n: 1, // DALL-E 2/3 제약 회피: 한 번에 1장씩만 요청
            size: "1024x1024",
            response_format: "url",   // 🔹 URL로 받기
          };

          if (model === "dall-e-3") {
            imagePayload.quality = "standard";
          }

          const imageResponse = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify(imagePayload),
            }
          );

          const imageData = await imageResponse.json();
          if (imageData.error) throw new Error(imageData.error.message);

          const oneImg = imageData.data[0].url;  // 🔹 URL 문자열
          newImgs.push(oneImg);
        }

        //  기존 이미지 + 새로 생성된 이미지 이어붙이기
        setGeneratedImages((prev) => [...prev, ...newImgs]);
        setStatusMessage(
          `완료! 이번에 ${newImgs.length}장, 총 ${
            oldCount + newImgs.length
          }장의 후보가 있습니다.`
        );
      } catch (error) {
        console.error(error);
        alert("오류 발생: " + error.message);
        setStatusMessage("오류 발생");
      } finally {
        setLoading(false);
      }
    };

    // 썸네일 클릭 시 "선택만"
    const handleSelectImage = (imgUrl) => {
      setSelectedImage(imgUrl);
      // 👉 여기서는 localStorage / onSelect 호출 안 함 (선택만)
    };

    // 썸네일 삭제
    const handleDeleteImage = (index) => {
      setGeneratedImages((prev) => {
        if (index < 0 || index >= prev.length) return prev;

        const removed = prev[index];
        const newArr = prev.filter((_, i) => i !== index);

        // 삭제한 이미지가 선택된 이미지였다면 선택 해제 + localStorage 정리
        if (removed && removed === selectedImage) {
          setSelectedImage(null);
          const key = "aiSelectedCover";
          const stored = localStorage.getItem(key);
          if (stored && stored === removed) {
            localStorage.removeItem(key);
          }
        }

        return newArr;
      });
    };

    // 적용 버튼 클릭 시: 진짜 적용 + 팝업 닫기
    const handleApply = () => {
      if (!selectedImage) {
        alert("먼저 적용할 이미지를 선택해주세요.");
        return;
      }

      // 단일 키로 저장
      localStorage.setItem("aiSelectedCover", selectedImage);

      // 팝업 모드: 부모 콜백 + 닫기
      if (onSelect) {
        onSelect(selectedImage);
      }
      if (onClose) {
        onClose();
      } else {
        // 라우팅 모드: 이전 페이지(도서 수정)로 돌아가기
        navigate(-1);
      }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, position: "relative" }}>
          {/* API Key Input */}
          <Box sx={{ mb: 4, p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              🔑 API Key 설정
            </Typography>
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
            <TextField fullWidth label="도서 제목" value={bookInfo.bookTitle || ""} disabled margin="normal" variant="filled" />
            <TextField fullWidth label="작가 명" value={bookInfo.author || ""} disabled margin="normal" variant="filled" />
            <TextField fullWidth label="카테고리" value={bookInfo.category || ""} disabled margin="normal" variant="filled" />
            <TextField fullWidth label="도서 내용" value={bookInfo.content || ""} disabled multiline rows={2} margin="normal" variant="filled" />
          </Box>

          {/* AI Setting Section, 모델, 품질, 스타일, 개수 설정 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ 디자인 설정
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>AI 모델</InputLabel>
              <Select
                value={model}
                label="AI 모델"
                onChange={(e) => setModel(e.target.value)}
              >
                <MenuItem value="dall-e-2">DALL-E 2</MenuItem>
                <MenuItem value="dall-e-3">DALL-E 3</MenuItem>
              </Select>
            </FormControl>

            {/* 품질 + 한 번에 생성할 이미지 수 (병렬 배치) */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // 모바일: 세로, 데스크탑: 가로
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              {/* 왼쪽: 품질 슬라이더 */}
              <Box sx={{ flex: 2 }}>
                <Typography gutterBottom>
                  품질 (Quality): {quality}
                </Typography>
                <Slider
                  value={quality}
                  onChange={(e, val) => setQuality(val)}
                  valueLabelDisplay="auto"
                  min={1}
                  max={100}
                />
              </Box>

              {/* 오른쪽: 한 번에 생성할 이미지 수 */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>한 번에 생성할 이미지 수</InputLabel>
                  <Select
                    value={numImages}
                    label="한 번에 생성할 이미지 수"
                    onChange={(e) => setNumImages(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}장
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

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
              sx={{ mt: 3, height: 50, fontSize: "1.1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "AI 표지 생성하기"
              )}
            </Button>

            {statusMessage && (
              <Typography
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                {statusMessage}
              </Typography>
            )}
          </Box>

          {/* 여러 장 결과 썸네일 영역 */}
          {generatedImages.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                ✨ 생성된 이미지 후보 ({generatedImages.length}장)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {generatedImages.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      width: 150,
                      height: 150,
                      borderRadius: 2,
                      overflow: "hidden",
                      border:
                        selectedImage === img
                          ? "3px solid #1976d2"
                          : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectImage(img)}
                  >
                    {/* 삭제 버튼 */}
                    <Tooltip title="이 이미지 삭제" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          zIndex: 2,
                          bgcolor: "rgba(255,255,255,0.8)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,1)",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // 썸네일 선택 클릭과 분리
                          handleDeleteImage(idx);
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <img
                      src={img}   // 🔹 URL 바로 사용
                      alt={`Generated ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* 선택된 이미지 크게 보여주기 */}
          {selectedImage && (
            <Box sx={{ mt: 5, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom color="success.main">
                ✅ 선택된 표지 (적용됨)
              </Typography>
              <img
                src={selectedImage}   // 🔹 URL 바로 사용
                alt="Selected Cover"
                style={{
                  maxWidth: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                }}
              />

              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleApply}
              >
                선택한 이미지 적용하고 돌아가기
              </Button>
            </Box>
          )}
        </Paper>
    );
  }

  export default AiBookCover;
