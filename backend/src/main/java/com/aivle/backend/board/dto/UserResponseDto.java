package com.aivle.backend.board.dto;

import com.aivle.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String nickname;

    public static UserResponseDto of(User user) {
        return new UserResponseDto(user.getId(), user.getNickname());
    }
}
