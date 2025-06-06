package com.example.demo.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;

	public JwtFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String header = request.getHeader("Authorization");
		String token = null;
		String username = null;

		if (header != null && header.startsWith("Bearer ")) {
			token = header.substring(7);
			if (jwtUtil.validateToken(token)) {
				username = jwtUtil.extractUsername(token);
			}
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, null);
			auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(auth);
		}

		try {
			filterChain.doFilter(request, response);
		} catch (java.io.IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
