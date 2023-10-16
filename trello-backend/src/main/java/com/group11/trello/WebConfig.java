package com.group11.trello;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Allows data sent through the front-end to be passed to the back-end
 */
@Configuration
public class WebConfig {
    private static final String[] ALLOWED_METHODS = { "GET", "POST", "PUT", "DELETE" };
    private static final String[] ALLOWED_ORIGINS = { "http://localhost:3000" };
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**") // allows all endpoints
                        .allowedMethods(ALLOWED_METHODS) // allows these HTTP methods
                        .allowedOrigins(ALLOWED_ORIGINS) // allows requests only from this origin
                        .allowCredentials(true);
            }
        };
    }
}
