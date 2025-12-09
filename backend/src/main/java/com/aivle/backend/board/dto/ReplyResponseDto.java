package com.aivle.backend.board.dto;

import com.aivle.backend.board.domain.Reply;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Getter
@RequiredArgsConstructor
public class ReplyResponseDto {
    private final Long replyId;
    private final String content;
    private final LocalDate createAt;
    private final LocalDate updateAt;
    private final UserResponseDto user;

    public static ReplyResponseDto of(Reply reply) {
        return new ReplyResponseDto(
            reply.getReplyId(),
            reply.getContent(),
            reply.getCreateAt(),
            reply.getUpdateAt(),
            UserResponseDto.of(reply.getUser())
        );
    }
}
