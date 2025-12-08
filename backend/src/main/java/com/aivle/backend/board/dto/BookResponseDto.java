package com.aivle.backend.board.dto;

import com.aivle.backend.book.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDto {
    private Long bookId;
    private String title;
    private String author;

    public static BookResponseDto of(Book book) {
        if(book == null) book = new Book();
        return new BookResponseDto(book.getBookId(), book.getBookTitle(), book.getAuthor());
    }
}