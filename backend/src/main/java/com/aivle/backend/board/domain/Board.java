package com.aivle.backend.board.domain;

import com.aivle.backend.book.domain.Book;
import com.aivle.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId; // 게시판 아이디

    @Column(nullable = false)
    private String title; // 제목

    @Column(nullable = false)
    private String content; // 내용

    private int views; // 조회 수

    @Enumerated(EnumType.STRING)
    private Type type;

    @CreationTimestamp
    private LocalDate createAt;

    @UpdateTimestamp
    private LocalDate updateAt;

    // user join
    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private User user;

    // book join
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book books;

    public enum Type {
        CB, REVIEW
    }
}
