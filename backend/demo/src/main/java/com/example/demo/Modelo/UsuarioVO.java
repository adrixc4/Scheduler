package com.example.demo.Modelo;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
@Entity
@Table(name = "usuarios")
public class UsuarioVO {

	@Id
	@GeneratedValue
	private UUID idusuario;
	private String nombre;
	private String contraseña;
	private String tipo;

	public UsuarioVO() {
		super();
	}

	public UsuarioVO(String nombre, String contraseña) {
		this.nombre = nombre;
		this.contraseña = contraseña;
	}

	public UsuarioVO(String nombre, String contraseña, String tipo) {
		this.nombre = nombre;
		this.contraseña = contraseña;
		this.tipo = tipo;
	}

	public UUID getIdusuario() {
		return idusuario;
	}

	public void setIdusuario(UUID idusuario) {
		this.idusuario = idusuario;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getContraseña() {
		return contraseña;
	}

	public void setContraseña(String contraseña) {
		this.contraseña = contraseña;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	@Override
	public int hashCode() {
		return Objects.hash(contraseña, idusuario, nombre, tipo);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UsuarioVO other = (UsuarioVO) obj;
		return Objects.equals(contraseña, other.contraseña) && Objects.equals(idusuario, other.idusuario)
				&& Objects.equals(nombre, other.nombre) && Objects.equals(tipo, other.tipo);
	}

}
