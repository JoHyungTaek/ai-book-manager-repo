package com.aivle.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // ✅ CORS preflight 막히면 프론트가 바로 죽음 (403/405 유발)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ 인증 관련
                        .requestMatchers(
                                "/auth/signup",
                                "/auth/login",
                                "/auth/reissue",
                                "/h2-console/**"
                        ).permitAll()

                        // ✅ 공개로 볼 API (필요한 것만 최소로 permitAll)
                        .requestMatchers(HttpMethod.GET,
                                "/api/boards",
                                "/api/boards/**"
                        ).permitAll()

                        // ✅ 내 정보는 인증 필요
                        .requestMatchers("/auth/me").authenticated()

                        // ✅ 그 외 /api는 로그인 필요
                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().denyAll()
                )

                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
