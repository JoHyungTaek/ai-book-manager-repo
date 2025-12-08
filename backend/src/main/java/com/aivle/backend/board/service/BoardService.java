package com.aivle.backend.board.service;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.dto.BoardResponseDto;
import com.aivle.backend.board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    // 생성
    public Board insertBoard(Board board) {
        return boardRepository.save(board);
    }

    // 업데이트 (PUT) - 전체 수정
    public Board updateBoard(Board board) {
        return boardRepository.save(board);
    }

    // 삭제
    public void deleteBoard(Long id) {
        Board b = getBoard(id);
        boardRepository.delete(b);
    }

    // 게시판 정보 조회
    private Board getBoard(Long id) {
        // orElseThrow(): id에 해당하는 데이터가 없다면 예외 발생 처리
        return boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));
    }

    // 게시판 정보 조회 - 사용자 요청
    @Transactional(readOnly = true)
    public Board findBoard(Long id){
        // 조회 수 증가
        boardRepository.updateViews(id);
        return getBoard(id);
    }

    // 목록 조회
    public List<BoardResponseDto> findBoardAll(Board.Type type) {
        return boardRepository.findBoardByType(type);
    }
}
