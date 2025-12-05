package com.aivle.backend.repository;

import com.aivle.backend.domain.Book;
import com.aivle.backend.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
//
//    // 페이징 처리용
//    Page<Book> findAll(Pageable pageable);
//
//    // 사용자별 책 목록 조회
//    List<Book> findByUser(User user);
}

