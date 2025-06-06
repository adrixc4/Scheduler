package com.example.demo.Repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Modelo.UsuarioVO;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioVO, Integer>{

	Optional<UsuarioVO> findByNombre(String nombre);
}
