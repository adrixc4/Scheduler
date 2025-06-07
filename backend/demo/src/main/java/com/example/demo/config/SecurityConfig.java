package com.example.demo.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.jwt.JwtFilter;

import jakarta.servlet.Filter;

@Configuration
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()) // Desactiva CSRF
				.cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activa CORS
				.authorizeHttpRequests(auth -> auth.requestMatchers("/usuario/add", "/usuario/login", "/usuario/test")
						.permitAll().anyRequest().authenticated());

		// Agregar filtro antes de UsernamePasswordAuthenticationFilter
		http.addFilterBefore((Filter) jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8081", "file://", "*")); // ajusta
																												// según
																												// tu
																												// frontend
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true); // o false, según lo necesites

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
