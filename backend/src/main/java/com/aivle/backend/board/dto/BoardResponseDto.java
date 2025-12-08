package com.aivle.backend.board.dto;

import com.aivle.backend.board.domain.Board;
import lombok.*;

@Getter
@RequiredArgsConstructor
public class BoardResponseDto {
    private final Long boardId;
    private final String title;
    private final String content;
    private final Board.Type type;
    private final UserResponseDto userResponseDto;
    private final BookResponseDto bookResponseDto;

    public static BoardResponseDto of(Board board) {
        return new BoardResponseDto(
                board.getBoardId(),
                board.getTitle(),
                board.getContent(),
                board.getType(),
                UserResponseDto.of(board.getUser()),
                BookResponseDto.of(board.getBooks())
        );
    }
}
