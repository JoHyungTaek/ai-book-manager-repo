package com.aivle.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ✅ CORS 반드시 활성화 (corsConfigurationSource()를 사용)
                .cors(Customizer.withDefaults())

                // CSRF 끄기 (JWT 기반이면 보통 disable)
                .csrf(csrf -> csrf.disable())

                // H2-console frame 허용
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 세션 사용 안함 (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // ✅ CORS Preflight(OPTIONS)는 무조건 열어야 함 (이거 없으면 지금처럼 막힘)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 공개 엔드포인트
                        .requestMatchers(
                                "/auth/signup",
                                "/auth/login",
                                "/auth/reissue",
                                "/h2-console/**"
                        ).permitAll()

                        // 인증 필요
                        .requestMatchers("/auth/me").authenticated()
                        .requestMatchers("/api/**").authenticated()

                        // 그 외 전부 차단
                        .anyRequest().denyAll()
                )

                // 기본 인증/폼 로그인 비활성화
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())

                // ✅ JWT 필터 등록
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * ✅ CORS 설정
     * - 프론트 ELB에서 오는 요청 허용
     * - Authorization 헤더 허용
     * - OPTIONS 허용
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 지금 구조는 Authorization Bearer 방식이라 보통 false 권장
        // (쿠키/세션 기반이면 true + allowedOrigins에 '*' 못 씀)
        config.setAllowCredentials(false);

        // ✅ 프론트 origin 정확히 넣기 (http/https, 포트, 끝 슬래시 유무 주의)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://k8s-default-frontend-52350253e4-e25e266af69cea37.elb.us-east-2.amazonaws.com"
        ));

        // ✅ 허용 메서드 (OPTIONS 포함)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ 허용 헤더 (Authorization 꼭 포함)
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // (선택) 프론트에서 응답 헤더 읽어야 하면 노출
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
