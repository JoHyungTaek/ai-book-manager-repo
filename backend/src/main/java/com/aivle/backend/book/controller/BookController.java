package com.aivle.backend.book.controller;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.book.dto.BookRequestDto;
import com.aivle.backend.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    // 책 등록 - POST
    @PostMapping
    public Book insertBook(@RequestParam Long userId, @RequestBody BookRequestDto dto) {
        return bookService.insertBook(userId, dto);
    }

    // 책 수정(PUT)
    @PutMapping("/{bookId}")
    public Book updateBook(@PathVariable Long bookId, @RequestBody BookRequestDto dto) {
        return bookService.updateBook(bookId, dto);
    }

    // 책 삭제 - DELETE
    @DeleteMapping("/{bookId}")
    public void deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
    }

    // 책 조회(단건) - GET
    @GetMapping("/{bookId}")
    public Book getBook(@PathVariable("bookId") Long bookId) {
        return bookService.getBook(bookId);
    }

    // 책 조회 (다건) - GET
    @GetMapping
    public Page<Book> getAllBooks(Pageable pageable) {
        try {
            return bookService.getAllBooks(pageable);
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔 확인용
            throw new RuntimeException("책 목록 조회 실패", e);
        }
    }

    @PostMapping("/{bookId}/like")
    public ResponseEntity<Book> likeBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.increaseLikes(bookId));
    }

    @PostMapping("/{bookId}/dislike")
    public ResponseEntity<Book> dislikeBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.increaseDislikes(bookId));
    }
}
