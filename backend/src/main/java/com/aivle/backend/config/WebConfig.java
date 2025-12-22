package com.aivle.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // ✅ CORS는 SecurityConfig(corsConfigurationSource)에서 통합 관리
}
