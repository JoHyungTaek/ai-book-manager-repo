package com.aivle.backend.user.service;

import com.aivle.backend.config.JwtTokenProvider;
import com.aivle.backend.user.dto.LoginRequest;
import com.aivle.backend.user.dto.LoginResponse;
import com.aivle.backend.user.dto.SignupRequest;
import com.aivle.backend.user.dto.UserResponse;
import com.aivle.backend.user.entity.User;
import com.aivle.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Transactional
    public void signup(SignupRequest req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByNickname(req.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .nickname(req.getNickname())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
    }

    // 로그인
    @Transactional
    public LoginResponse login(LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // ⚠ 여기서 email, role 두 개 다 넘겨줘야 함
        String access = jwtTokenProvider.createAccessToken(
                user.getEmail(),
                user.getRole().name()
        );
        String refresh = jwtTokenProvider.createRefreshToken(
                user.getEmail(),
                user.getRole().name()
        );

        // 리프레시 토큰을 DB에 저장
        user.setRefreshToken(refresh);

//        return new LoginResponse(access, refresh);
        // ✅ 닉네임도 함께 응답으로 반환
        return LoginResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .nickname(user.getNickname())  // ✅ 추가
                .build();
    }

    // 리프레시 토큰으로 재발급
    @Transactional
    public LoginResponse reissue(String refreshToken) {

        // 1. 토큰 형식 / 만료 체크
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 2. 토큰에서 email 꺼내기
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // 3. 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 4. DB에 저장된 refreshToken 과 일치하는지 확인
        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new RuntimeException("저장된 리프레시 토큰과 일치하지 않습니다.");
        }

        // 5. 새 토큰 발급
        String newAccess = jwtTokenProvider.createAccessToken(
                user.getEmail(),
                user.getRole().name()
        );
        String newRefresh = jwtTokenProvider.createRefreshToken(
                user.getEmail(),
                user.getRole().name()
        );

        // 6. 새 refresh 토큰 저장
        user.setRefreshToken(newRefresh);

        //return new LoginResponse(newAccess, newRefresh);
        return LoginResponse.builder()
                .accessToken(newAccess)
                .refreshToken(newRefresh)
                .nickname(user.getNickname())  // ✅ 추가
                .build();
    }

    // 로그아웃 : refreshToken 제거
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setRefreshToken(null);
    }

    // 내 정보 조회
    @Transactional(readOnly = true)
    public UserResponse getMyInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new UserResponse(user);
    }
}
