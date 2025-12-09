package com.aivle.backend.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends CustomException {
    public UserNotFoundException(Long userId) {
        super("사용자 ID " + userId + "를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }
}
