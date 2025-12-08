package com.aivle.backend.book.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.aivle.backend.user.entity.User;

import java.time.LocalDateTime;

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

    private String bookImageUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // 좋아요 / 싫어요 카운트 필드 추가
    @Builder.Default
    @Column(nullable = false)
    private int likes = 0;

    @Builder.Default
    @Column(nullable = false)
    private int dislikes = 0;

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
