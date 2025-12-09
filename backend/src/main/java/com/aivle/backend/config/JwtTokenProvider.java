package com.aivle.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration-ms}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshTokenValidity;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // AccessToken 생성 (email + role 포함)
    public String createAccessToken(String email, String role) {
        return buildToken(email, role, accessTokenValidity);
    }

    // RefreshToken 생성 (email + role 포함)
    public String createRefreshToken(String email, String role) {
        return buildToken(email, role, refreshTokenValidity);
    }

    private String buildToken(String email, String role, long validityMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityMs);

        return Jwts.builder()
                .setSubject(email)           // email
                .claim("role", role)         // ROLE_USER, ROLE_ADMIN 등
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검사 (만료, 서명 오류 체크)
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            System.out.println("✅ JWT 검증 성공");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("❌ JWT 검증 실패: " + e.getMessage());
            return false;
        }
    }


    // 토큰에서 email(subject) 꺼내기
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
