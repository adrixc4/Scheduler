package com.example.demo.Servicios;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Modelo.UsuarioVO;
import com.example.demo.Repositorio.UsuarioRepository;

@Service
public class ServicioUsuarioImp implements ServicioUsuario {

	@Autowired
	private UsuarioRepository ur;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public Optional<UsuarioVO> findByNombre(String nombre) {
		return ur.findByNombre(nombre);
	}

	public <S extends UsuarioVO> List<S> saveAll(Iterable<S> entities) {
		return ur.saveAll(entities);
	}

	public <S extends UsuarioVO> Optional<S> findOne(Example<S> example) {
		return ur.findOne(example);
	}

	public List<UsuarioVO> findAll(Sort sort) {
		return ur.findAll(sort);
	}

	public <S extends UsuarioVO> S save(S entity) {
		entity.setContraseña(passwordEncoder.encode(entity.getContraseña()));
		return ur.save(entity);
	}

	public void flush() {
		ur.flush();
	}

	public Page<UsuarioVO> findAll(Pageable pageable) {
		return ur.findAll(pageable);
	}

	public <S extends UsuarioVO> S saveAndFlush(S entity) {
		return ur.saveAndFlush(entity);
	}

	public <S extends UsuarioVO> List<S> saveAllAndFlush(Iterable<S> entities) {
		return ur.saveAllAndFlush(entities);
	}

	public List<UsuarioVO> findAll() {
		return ur.findAll();
	}

	public List<UsuarioVO> findAllById(Iterable<Integer> ids) {
		return ur.findAllById(ids);
	}

	public void deleteInBatch(Iterable<UsuarioVO> entities) {
		ur.deleteInBatch(entities);
	}

	public <S extends UsuarioVO> Page<S> findAll(Example<S> example, Pageable pageable) {
		return ur.findAll(example, pageable);
	}

	public void deleteAllInBatch(Iterable<UsuarioVO> entities) {
		ur.deleteAllInBatch(entities);
	}

	public Optional<UsuarioVO> findById(Integer id) {
		return ur.findById(id);
	}

	public <S extends UsuarioVO> long count(Example<S> example) {
		return ur.count(example);
	}

	public void deleteAllByIdInBatch(Iterable<Integer> ids) {
		ur.deleteAllByIdInBatch(ids);
	}

	public boolean existsById(Integer id) {
		return ur.existsById(id);
	}

	public <S extends UsuarioVO> boolean exists(Example<S> example) {
		return ur.exists(example);
	}

	public void deleteAllInBatch() {
		ur.deleteAllInBatch();
	}

	public UsuarioVO getOne(Integer id) {
		return ur.getOne(id);
	}

	public <S extends UsuarioVO, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) {
		return ur.findBy(example, queryFunction);
	}

	public long count() {
		return ur.count();
	}

	public UsuarioVO getById(Integer id) {
		return ur.getById(id);
	}

	public void deleteById(Integer id) {
		ur.deleteById(id);
	}

	public void delete(UsuarioVO entity) {
		ur.delete(entity);
	}

	public UsuarioVO getReferenceById(Integer id) {
		return ur.getReferenceById(id);
	}

	public void deleteAllById(Iterable<? extends Integer> ids) {
		ur.deleteAllById(ids);
	}

	public <S extends UsuarioVO> List<S> findAll(Example<S> example) {
		return ur.findAll(example);
	}

	public <S extends UsuarioVO> List<S> findAll(Example<S> example, Sort sort) {
		return ur.findAll(example, sort);
	}

	public void deleteAll(Iterable<? extends UsuarioVO> entities) {
		ur.deleteAll(entities);
	}

	public void deleteAll() {
		ur.deleteAll();
	}

}
