package com.aivle.backend.user.controller;

import com.aivle.backend.security.CustomUserDetails;
import com.aivle.backend.user.dto.*;
import com.aivle.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
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
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.getMyInfo(userDetails.getUsername());
    }

    /**
     * 내 정보 수정
     * PUT /auth/me
     * - 닉네임 변경
     * - 비밀번호 변경(선택)
     */
    @PutMapping("/me")
    public UserResponse updateMe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateUserRequest request
    ) {
        return userService.updateMyInfo(userDetails.getUsername(), request);
    }

    /**
     * 로그아웃
     * POST /auth/logout
     */
    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.logout(userDetails.getUsername());
    }
}
