package com.aivle.backend.board.controller;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.dto.BoardResponseDto;
import com.aivle.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards/{type}")
@RequiredArgsConstructor
public class BoardController {
    public final BoardService boardService;

    @PostMapping
    public Board createBoard(@PathVariable("type") String type, @RequestBody Board board) {
        board.setType(Board.Type.valueOf(type.toUpperCase()));
        // type이 book 일 경우 bookId null 체크
        return boardService.insertBoard(board);
    }

    @PutMapping
    public Board updateBoard(@PathVariable("type") String type, @RequestBody Board board) {
        board.setType(Board.Type.valueOf(type.toUpperCase()));
        return boardService.updateBoard(board);
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
    public List<BoardResponseDto> getBoardList(@PathVariable("type") String type) {
        return boardService.findBoardAll(Board.Type.valueOf(type.toUpperCase()));
    }
}
