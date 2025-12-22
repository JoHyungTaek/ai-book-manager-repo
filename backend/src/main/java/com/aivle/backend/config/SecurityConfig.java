package com.aivle.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        // ✅ CORS Preflight(OPTIONS) 는 인증 없이 무조건 통과시켜야 함
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

                        // 나머지는 인증 필요 (프로젝트 정책에 맞게 유지)
                        .anyRequest().authenticated()
                );

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
