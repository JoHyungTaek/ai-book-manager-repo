package com.aivle.backend.board.domain;

import com.aivle.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long replyId; // 댓글 아이디

    @Column(nullable = false)
    private String content; // 내용

    @CreationTimestamp
    private LocalDate createAt;

    @UpdateTimestamp
    private LocalDate updateAt;

    // user join
    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private User user;

    // user join
    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;
}
