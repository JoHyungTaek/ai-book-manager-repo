package com.aivle.backend.exception;

import org.springframework.http.HttpStatus;

public class BookNotFoundException extends CustomException {
    public BookNotFoundException(Long bookId) {
        super("도서 ID " + bookId + "를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }
}
