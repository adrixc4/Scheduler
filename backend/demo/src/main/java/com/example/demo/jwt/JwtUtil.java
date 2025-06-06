package com.example.demo.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

	private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 1 hora
	private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 días

	public String generateAccessToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)).signWith(secretKey)
				.compact();
	}

	public String generateRefreshToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION)).signWith(secretKey)
				.compact();
	}

	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}
}
