package com.aivle.backend.book.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDto {
    private String bookTitle;
    private String category;
    private String content;
    private String author;
    private String bookImageUrl;
//    private String writer;
}

