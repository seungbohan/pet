package org.zerock.portfolio.config;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.zerock.portfolio.security.filter.ApiCheckFilter;
import org.zerock.portfolio.security.filter.ApiLoginFilter;
import org.zerock.portfolio.security.util.JWTUtil;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@Log4j2
@RequiredArgsConstructor
public class SecurityConfig {

    private final Environment env;

    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth) -> {
            auth.dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                    .requestMatchers("/error").permitAll();
            auth.requestMatchers("/api/admin/**").hasRole("ADMIN");
            auth.requestMatchers("/uploadAjax", "/removeFile").hasRole("USER");
            auth.requestMatchers(HttpMethod.POST,"/api/review/**", "/api/board/write").hasRole("USER");
            auth.requestMatchers(HttpMethod.PUT,"/api/review/**").hasRole("USER");
            auth.requestMatchers(HttpMethod.DELETE,"/api/review/**").hasRole("USER");
            auth.requestMatchers("/api/mypage/**").hasRole("USER");
            auth.requestMatchers("/", "/board/list/**", "/join/**", "/api/join/**","/board/**",
                    "/board/mypage/user" ,"/display", "/admin/**", "/api/petplaces", "/map", "/api/map/**", "/main", "/private.jsp").permitAll();
            auth.requestMatchers(HttpMethod.GET, "/api/review/**").permitAll();
            auth.requestMatchers(
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/favicon.ico"
            ).permitAll();
        });

        if (env.acceptsProfiles(Profiles.of("prod"))) {
            http.requiresChannel((channel) -> channel.anyRequest().requiresSecure());
        }

        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);

        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        http.authenticationManager(authenticationManager);

        http.cors((corsCustomizer) -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://withpet.shop", "http://withpet.shop"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowCredentials(true);
                configuration.setAllowedHeaders(Collections.singletonList("*"));
                configuration.setMaxAge(3600L);

                configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                return configuration;
            }
        }));
        http.httpBasic((auth) -> auth.disable());
        http.formLogin((auth) -> auth.disable());
        http
                .csrf(csrf -> csrf.disable());
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        http.addFilterBefore(apiCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        http.addFilterBefore(apiLoginFilter(authenticationManager), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    public ApiLoginFilter apiLoginFilter(AuthenticationManager authenticationManager) {

        ApiLoginFilter apiLoginFilter = new ApiLoginFilter("/api/join/login", jwtUtil());
        apiLoginFilter.setAuthenticationManager(authenticationManager);

        return apiLoginFilter;
    }

    @Bean
    public JWTUtil jwtUtil() {
        return new JWTUtil();
    }

    @Bean
    public ApiCheckFilter apiCheckFilter() {
        return new ApiCheckFilter(List.of("/api/mypage/**","/uploadAjax","/removeFile" ,"/api/review/**", "/api/admin/**", "/api/board/write"), jwtUtil());
    }
}