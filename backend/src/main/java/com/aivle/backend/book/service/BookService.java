package com.aivle.backend.book.service;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.book.domain.BookLike;
import com.aivle.backend.book.repository.BookLikeRepository;
import com.aivle.backend.exception.BookNotFoundException;
import com.aivle.backend.exception.UserNotFoundException;
import com.aivle.backend.user.entity.User;
import com.aivle.backend.book.dto.BookRequestDto;
import com.aivle.backend.book.repository.BookRepository;
import com.aivle.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookLikeRepository bookLikeRepository;

    // 도서 등록
    @Transactional
    public Book insertBook(Long userId, BookRequestDto dto) {
        User user = userRepository.findById(userId)
                //.orElseThrow(() -> new RuntimeException("사용자 없음"));
                .orElseThrow(() -> new UserNotFoundException(userId));

        Book book = Book.builder()
                .user(user)
                .bookTitle(dto.getBookTitle())
                .author(dto.getAuthor())
                .category(dto.getCategory())
                .content(dto.getContent())
                .bookImageUrl(dto.getBookImageUrl())
                .writer(user.getNickname()) // 작성자 닉네임 저장
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
                //.orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));
                .orElseThrow(() -> new BookNotFoundException(bookId));
    }

    // 도서 수정
//    @Transactional
//    public Book updateBook(Long bookId, BookRequestDto dto) {
//        //Book book = getBook(bookId);
//        Book book = bookRepository.findById(bookId)
//                .orElseThrow(() -> new BookNotFoundException(bookId));
//
//        book.setBookTitle(dto.getBookTitle());
//        book.setCategory(dto.getCategory());
//        book.setContent(dto.getContent());
//
//        return bookRepository.save(book);
//    }
//
//    // 도서 삭제
//    @Transactional
//    public void deleteBook(Long bookId) {
//        Book book = bookRepository.findById(bookId)
//                //.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "도서를 찾을 수 없습니다."));
//                .orElseThrow(() -> new BookNotFoundException(bookId));
//        bookRepository.delete(book);
//    }

    @Transactional
    public Book updateBook(Long bookId, BookRequestDto dto, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        // ✅ 작성자 본인인지 확인
        if (!book.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 작성한 글만 수정할 수 있습니다.");
        }

        book.setBookTitle(dto.getBookTitle());
        book.setCategory(dto.getCategory());
        book.setContent(dto.getContent());
        book.setAuthor(dto.getAuthor());

        if (dto.getBookImageUrl() != null && !dto.getBookImageUrl().isEmpty()) {
            book.setBookImageUrl(dto.getBookImageUrl()); // ✅ 이미지 URL도 수정 가능하게
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        // ✅ 작성자 본인인지 확인
        if (!book.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 작성한 글만 삭제할 수 있습니다.");
        }
        bookRepository.delete(book);
    }


    @Transactional
    public Book toggleLike(Long bookId, Long userId, boolean liked) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 기존에 누른 기록이 있는지 확인
        Optional<BookLike> existing = bookLikeRepository.findByBookAndUser(book, user);

        if (existing.isPresent()) {
            BookLike bookLike = existing.get();

            // 이미 같은 반응을 눌렀다면 취소 (삭제)
            if (bookLike.isLiked() == liked) {
                bookLikeRepository.delete(bookLike);
                if (liked) book.setLikes(book.getLikes() - 1);
                else book.setDislikes(book.getDislikes() - 1);
            } else {
                // 반대 반응으로 변경
                bookLike.setLiked(liked);
                if (liked) {
                    book.setLikes(book.getLikes() + 1);
                    book.setDislikes(book.getDislikes() - 1);
                } else {
                    book.setDislikes(book.getDislikes() + 1);
                    book.setLikes(book.getLikes() - 1);
                }
            }
        } else {
            // 처음 누른 경우
            BookLike newLike = BookLike.builder()
                    .book(book)
                    .user(user)
                    .liked(liked)
                    .build();
            bookLikeRepository.save(newLike);

            if (liked) book.setLikes(book.getLikes() + 1);
            else book.setDislikes(book.getDislikes() + 1);
        }

        return bookRepository.save(book);
    }

}
