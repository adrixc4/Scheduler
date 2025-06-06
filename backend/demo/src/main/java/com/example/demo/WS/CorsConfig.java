package com.example.demo.WS;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración para permitir el intercambio de recursos entre diferentes
 * orígenes (CORS) en los servicios web.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

	/**
	 * Permite configurar los orígenes de los que se permiten solicitudes CORS, los
	 * métodos HTTP permitidos, el uso de credenciales y el tiempo máximo que se
	 * puede almacenar en caché la respuesta prefligada.
	 *
	 * @param registry el registro CORS
	 */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**") // Mapea todos los endpoints
				.allowedOriginPatterns("**") // Permite todas las IPs
				.allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos permitidos
				.allowCredentials(true) // Permitir credenciales
				.maxAge(3600); // Tiempo máximo que se puede almacenar en caché la respuesta prefligada
	}
}
