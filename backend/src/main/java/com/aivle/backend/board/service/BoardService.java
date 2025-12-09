package com.aivle.backend.board.service;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.dto.BoardRequestDto;
import com.aivle.backend.board.repository.BoardRepository;
import com.aivle.backend.user.entity.User;
import com.aivle.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 생성
    public Board insertBoard(String userId, BoardRequestDto boardRequestDto) {
        User user = userRepository.findByEmail(userId)
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));

        Board board = Board.builder()
                .user(user)
                .title(boardRequestDto.getTitle())
                .content(boardRequestDto.getContent())
                .build();
        return boardRepository.save(board);
    }

    // 업데이트 (PUT) - 전체 수정
    public Board updateBoard(Long boardId, BoardRequestDto boardRequestDto) {
        Board board = getBoard(boardId);

        board.setTitle(boardRequestDto.getTitle());
        board.setContent(boardRequestDto.getContent());

        return boardRepository.save(board);
    }

    // 삭제
    public void deleteBoard(Long boardId) {
        Board b = getBoard(boardId);
        boardRepository.delete(b);
    }

    // 게시판 정보 조회
    private Board getBoard(Long boardId) {
        // orElseThrow(): id에 해당하는 데이터가 없다면 예외 발생 처리
        return boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));
    }

    // 게시판 정보 조회 - 사용자 요청
    @Transactional(readOnly = true)
    public Board findBoard(Long boardId){
        // 조회 수 증가
        boardRepository.updateViews(boardId);
        return getBoard(boardId);
    }

    // 게시판 목록 조회
    public Page<Board> findBoardAll(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }
}
