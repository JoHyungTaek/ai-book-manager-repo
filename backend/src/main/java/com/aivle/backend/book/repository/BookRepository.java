package com.aivle.backend.book.repository;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
//
//    // 페이징 처리용
//    Page<Book> findAll(Pageable pageable);
//
//    // 사용자별 책 목록 조회
//    List<Book> findByUser(User user);
}

