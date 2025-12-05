package com.aivle.backend.book.service;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.user.entity.User;
import com.aivle.backend.book.dto.BookRequestDto;
import com.aivle.backend.book.repository.BookRepository;
import com.aivle.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // 도서 등록
    public Book insertBook(Long userId, BookRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        Book book = Book.builder()
                .user(user)
                .bookTitle(dto.getBookTitle())
                .author(dto.getAuthor())
                .category(dto.getCategory())
                .content(dto.getContent())
                .build();

        return bookRepository.save(book);
    }

    // 도서 전체 목록 조회 (페이징)
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    // 도서 상세 조회
    public Book getBook(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));
    }

    // 도서 수정
    public Book updateBook(Long bookId, BookRequestDto dto) {
        Book book = getBook(bookId);

        book.setBookTitle(dto.getBookTitle());
        book.setCategory(dto.getCategory());
        book.setContent(dto.getContent());

        return bookRepository.save(book);
    }

    // 도서 삭제
    public void deleteBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "도서를 찾을 수 없습니다."));
        bookRepository.delete(book);
    }
}
