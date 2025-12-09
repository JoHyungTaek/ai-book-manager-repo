package com.aivle.backend.board.dto;

import com.aivle.backend.board.domain.Board;
import lombok.*;

import java.time.LocalDate;

@Getter
@RequiredArgsConstructor
public class BoardResponseDto {
    private final Long boardId;
    private final String title;
    private final String content;
    private final UserResponseDto user;
    private final LocalDate updatedAt;

    public static BoardResponseDto of(Board board) {
        return new BoardResponseDto(
                board.getBoardId(),
                board.getTitle(),
                board.getContent(),
                UserResponseDto.of(board.getUser()),
                board.getUpdatedAt()
        );
    }
}
