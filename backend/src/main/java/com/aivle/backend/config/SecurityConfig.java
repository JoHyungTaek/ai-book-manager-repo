package com.aivle.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                // CSRF 끄기
                .csrf(csrf -> csrf.disable())

                // ✅ CORS 적용 (아래 corsConfigurationSource() 사용)
                .cors(Customizer.withDefaults())

                // H2-console frame 허용
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 세션을 사용하지 않는 JWT 방식
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ 핵심: Preflight(OPTIONS)는 무조건 열어야 CORS가 통과함
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(
                                "/auth/signup",
                                "/auth/login",
                                "/auth/reissue",
                                "/h2-console/**"
                        ).permitAll()

                        // 로그인된 사용자만
                        .requestMatchers("/auth/me").authenticated()
                        .requestMatchers("/api/**").authenticated()

                        // 그 외는 모두 차단
                        .anyRequest().denyAll()
                )

                // 폼로그인, httpBasic 비활성화
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())

                // JWT 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ CORS 설정 (프론트 ELB + 로컬 허용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 지금 너희는 쿠키 인증(withCredentials) 안 쓰고 Authorization 헤더 쓰는 구조라 false 권장
        config.setAllowCredentials(false);

        // 프론트 주소 정확히 허용
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://k8s-default-frontend-52350253e4-e25e266af69cea37.elb.us-east-2.amazonaws.com"
        ));

        // 허용 메서드 (OPTIONS 꼭 포함)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용 헤더 (Authorization 꼭 포함)
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // (선택) 프론트가 Authorization 헤더를 응답에서 읽어야 하면 노출
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
