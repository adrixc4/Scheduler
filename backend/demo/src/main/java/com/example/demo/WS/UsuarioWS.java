package com.example.demo.WS;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Modelo.UsuarioVO;
import com.example.demo.Servicios.ServicioUsuarioImp;
import com.example.demo.jwt.JwtUtil;

@RestController
@RequestMapping("/usuario")
public class UsuarioWS {

	@Autowired
	private ServicioUsuarioImp su;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/add")
	public ResponseEntity<?> createUser(@RequestBody UsuarioVO usuario) {
		try {
			UsuarioVO usu = su.save(usuario);
			return new ResponseEntity<UsuarioVO>(usu, HttpStatus.OK);
		} catch (Exception ex) {
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Error interno del servidor: " + ex.getMessage());
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UsuarioVO loginRequest) {
		System.out.println("Login: " + loginRequest);
		try {
			Optional<UsuarioVO> optionalUser = su.findByNombre(loginRequest.getNombre());

			if (optionalUser.isPresent()) {
				UsuarioVO user = optionalUser.get();

				if (passwordEncoder.matches(loginRequest.getContraseña(), user.getContraseña())) {
					String token = jwtUtil.generateAccessToken(user.getNombre());
					Map<String, String> response = Map.of("token", token);
					return new ResponseEntity<>(response, HttpStatus.OK);
				} else {
					return new ResponseEntity<>(Map.of("message", "Credenciales inválidas"), HttpStatus.UNAUTHORIZED);
				}
			} else {
				return new ResponseEntity<>(Map.of("message", "Usuario no encontrado"), HttpStatus.UNAUTHORIZED);
			}

		} catch (Exception ex) {
			return new ResponseEntity<>(Map.of("message", "Error interno: " + ex.getMessage()),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/test")
	public ResponseEntity<?> test() {
		return new ResponseEntity<>("Hola", HttpStatus.OK);
	}

	@GetMapping("/validate")
	public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
		try {
			String token = authHeader.replace("Bearer ", "");
			System.out.println("Token: " + token);
			if (jwtUtil.validateToken(token)) {
				return ResponseEntity.ok().build();
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
}
