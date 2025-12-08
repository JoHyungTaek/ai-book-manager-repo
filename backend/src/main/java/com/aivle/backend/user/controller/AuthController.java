package com.aivle.backend.user.controller;

import com.aivle.backend.security.CustomUserDetails;
import com.aivle.backend.user.dto.*;
import com.aivle.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    /**
     * 회원가입
     * POST /auth/signup
     */
    @PostMapping("/signup")
    public void signup(@RequestBody SignupRequest request) {
        userService.signup(request);
    }

    /**
     * 로그인
     * POST /auth/login
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    /**
     * 토큰 재발급
     * POST /auth/reissue
     * 헤더: Refresh-Token: {refreshToken}
     */
    @PostMapping("/reissue")
    public LoginResponse reissue(@RequestHeader("Refresh-Token") String refreshToken) {
        return userService.reissue(refreshToken);
    }

    /**
     * 내 정보 조회
     * GET /auth/me
     */
//    @GetMapping("/me")
//    public UserResponse me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
//        return userService.getMyInfo(user.getUsername());
//    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.getMyInfo(userDetails.getUsername());
    }

//    @GetMapping("/me")
//    public ResponseEntity<?> me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("인증 정보가 없습니다.");
//        }
//        return ResponseEntity.ok(userService.getMyInfo(user.getUsername()));
//    }


    /**
     * 로그아웃
     * POST /auth/logout
     */
    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        userService.logout(user.getUsername());
    }
}
