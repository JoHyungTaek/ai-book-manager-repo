package com.aivle.backend.board.dto;

import com.aivle.backend.board.domain.Board;
import lombok.*;

@Getter
@RequiredArgsConstructor
public class BoardResponseDto {
    private final Long boardId;
    private final String title;
    private final String content;
    private final UserResponseDto user;

    public static BoardResponseDto of(Board board) {
        return new BoardResponseDto(
                board.getBoardId(),
                board.getTitle(),
                board.getContent(),
                UserResponseDto.of(board.getUser())
        );
    }
}
