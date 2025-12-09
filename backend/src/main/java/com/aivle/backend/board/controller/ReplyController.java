package com.aivle.backend.board.controller;

import com.aivle.backend.board.dto.ReplyRequestDto;
import com.aivle.backend.board.dto.ReplyResponseDto;
import com.aivle.backend.board.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;

    // 댓글 생성
    @PostMapping
    public ReplyResponseDto createReply(
            @RequestParam Long userId,
            @RequestBody ReplyRequestDto replyRequestDto
    ) {
        return replyService.insertReply(userId, replyRequestDto);
    }

    // 댓글 수정
    @PutMapping("/{replyId}")
    public ReplyResponseDto updateReply(
            @PathVariable Long replyId,
            @RequestBody ReplyRequestDto replyRequestDto
    ) {
        return replyService.updateReply(replyId, replyRequestDto);
    }

    // 댓글 삭제
    @DeleteMapping("/{replyId}")
    public String deleteReply(@PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return "댓글이 삭제되었습니다.";
    }

    // 댓글 목록 조회
    @GetMapping("/{boardId}")
    public Page<ReplyResponseDto> getReplyList(
            @PathVariable Long boardId,
            Pageable pageable
    ) {
        return replyService.findReplyAll(boardId, pageable);
    }
}
