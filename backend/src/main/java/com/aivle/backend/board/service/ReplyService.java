package com.aivle.backend.board.service;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.repository.BoardRepository;
import com.aivle.backend.board.domain.Reply;
import com.aivle.backend.board.dto.ReplyRequestDto;
import com.aivle.backend.board.dto.ReplyResponseDto;
import com.aivle.backend.board.repository.ReplyRepository;
import com.aivle.backend.user.entity.User;
import com.aivle.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReplyService {
    private final ReplyRepository replyRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 생성
    public ReplyResponseDto insertReply(Long userId, ReplyRequestDto replyRequestDto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));

        Board board = boardRepository.findById(replyRequestDto.getBoardId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

        Reply reply = Reply.builder()
                .user(user)
                .board(board)
                .content(replyRequestDto.getContent())
                .build();

        return ReplyResponseDto.of(replyRepository.save(reply));
    }

    // 수정
    public ReplyResponseDto updateReply(Long replyId, ReplyRequestDto replyRequestDto) {
        Reply reply = getReply(replyId);
        reply.setContent(replyRequestDto.getContent());
        return ReplyResponseDto.of(replyRepository.save(reply));
    }

    // 삭제
    public void deleteReply(Long replyId) {
        Reply reply = getReply(replyId);
        replyRepository.delete(reply);
    }

    // 댓글 정보 조회
    private Reply getReply(Long replyId) {
        // orElseThrow(): id에 해당하는 데이터가 없다면 예외 발생 처리
        return replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
    }

    // 댓글 정보 조회 - 사용자 요청
    public ReplyResponseDto findReply(Long replyId) {
        return ReplyResponseDto.of(getReply(replyId));
    }

    // 댓글 목록 조회
    public Page<ReplyResponseDto> findReplyAll(Long boardId, Pageable pageable) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

        Page<Reply> replies = replyRepository.findRepliesByBoard_BoardId(boardId, pageable);
        return replies.map(rep -> ReplyResponseDto.of(rep));
    }
}
