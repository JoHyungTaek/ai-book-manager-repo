package com.aivle.backend.board.controller;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.dto.BoardRequestDto;
import com.aivle.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    public final BoardService boardService;

    @PostMapping
    public Board createBoard(@RequestParam String userId, @RequestBody BoardRequestDto boardRequestDto) {
        return boardService.insertBoard(userId, boardRequestDto);
    }

    @PutMapping("/{boardId}")
    public Board updateBoard(@PathVariable Long boardId, @RequestBody BoardRequestDto boardRequestDto) {
        return boardService.updateBoard(boardId, boardRequestDto);
    }

    @DeleteMapping("/{boardId}")
    public String removeBoard(@PathVariable("boardId") Long boardId) {
        boardService.deleteBoard(boardId);
        return "삭제 완료";
    }

    @GetMapping("/{boardId}")
    public Board getBoard(@PathVariable("boardId") Long boardId) {
        return boardService.findBoard(boardId);
    }

    @GetMapping
    public Page<Board> getBoardList(Pageable pageable) {
        return boardService.findBoardAll(pageable);
    }
}
