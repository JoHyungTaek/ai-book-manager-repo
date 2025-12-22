package com.aivle.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // ✅ 프로젝트에 이미 있는 필터: backend/src/main/java/com/aivle/backend/config/JwtAuthenticationFilter.java
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // JWT 사용 -> CSRF 불필요
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())

                // ✅ 세션 사용 안함(Stateless) : JWT 서버 기본
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ✅ 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // CORS Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // H2 Console
                        .requestMatchers("/h2-console/**").permitAll()

                        // Auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )

                // ✅ JWT 필터를 SecurityChain에 “반드시” 등록해야 Authorization: Bearer 토큰이 인식됨
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // h2 console iframe 허용 필요 시
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // ✅ 배포/로컬 프론트 Origin 허용 (ELB DNS는 매번 바뀔 수 있어 패턴으로 허용)
        // - allowCredentials(true) 쓰면 addAllowedOrigin("*") 불가 → 패턴/명시 Origin 써야 함
        corsConfiguration.addAllowedOriginPattern("http://k8s-default-frontend-*.elb.us-east-2.amazonaws.com");
        corsConfiguration.addAllowedOriginPattern("https://k8s-default-frontend-*.elb.us-east-2.amazonaws.com");
        corsConfiguration.addAllowedOriginPattern("http://localhost:5173");
        corsConfiguration.addAllowedOriginPattern("http://localhost:3000");

        corsConfiguration.setAllowCredentials(true);

        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");

        // 프론트에서 Authorization 헤더 읽어야 하면 노출
        corsConfiguration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}
