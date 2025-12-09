package com.aivle.backend.book.repository;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.book.domain.BookLike;
import com.aivle.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookLikeRepository extends JpaRepository<BookLike, Long> {
    Optional<BookLike> findByBookAndUser(Book book, User user);
}

