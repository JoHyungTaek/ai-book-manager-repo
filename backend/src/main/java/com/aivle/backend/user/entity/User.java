package com.aivle.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users") // user 는 예약어라서 s 붙임
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 이메일 (로그인 ID) - 중복 불가
    @Column(nullable = false, unique = true)
    private String email;

    // 비밀번호 (암호화해서 저장)
    @Column(nullable = false)
    private String password;

    // 닉네임 - 중복 불가
    @Column(nullable = false, unique = true)
    private String nickname;

    // 권한
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // 현재 발급된 refresh token (로그아웃 시 null)
    @Column
    private String refreshToken;

    public enum Role {
        USER, ADMIN
    }
}
