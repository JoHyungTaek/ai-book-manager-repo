package com.aivle.backend.book.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import com.aivle.backend.user.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user; // 작성자

    @Column(nullable = false)
    private String bookTitle;

    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String author;

    @Column(length = 1024)
    private String bookImageUrl;

    private String writer; // 작성자 닉네임

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // 좋아요 / 싫어요 카운트 필드 추가
    @Builder.Default
    @Column(nullable = false)
    private int likes = 0;

    @Builder.Default
    @Column(nullable = false)
    private int dislikes = 0;

    // BookLike와의 연관관계 설정
    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<BookLike> likesList = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
