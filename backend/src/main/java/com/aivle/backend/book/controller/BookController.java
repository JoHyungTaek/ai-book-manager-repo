package com.aivle.backend.book.controller;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.book.dto.BookRequestDto;
import com.aivle.backend.book.service.BookService;
import com.aivle.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

//    @PostMapping("/{bookId}/like")
//    public ResponseEntity<Book> toggleLike(
//            @PathVariable Long bookId,
//            @RequestParam Long userId,
//            @RequestParam boolean liked) {
//        Long userId = userDetails.getUser().getId();  // JWT 토큰에서 사용자 ID 추출
//        Book updated = bookService.toggleLike(bookId, userId, liked);
//        return ResponseEntity.ok(updated);
//    }
    @PostMapping("/{bookId}/like")
    public ResponseEntity<Book> toggleLike(
            @PathVariable Long bookId,
            @RequestParam boolean liked,
            @AuthenticationPrincipal CustomUserDetails userDetails) { // 로그인된 사용자 정보 주입
        Long userId = userDetails.getUser().getId();  // JWT에서 가져온 사용자 ID
        Book updated = bookService.toggleLike(bookId, userId, liked);
        return ResponseEntity.ok(updated);
    }

}
