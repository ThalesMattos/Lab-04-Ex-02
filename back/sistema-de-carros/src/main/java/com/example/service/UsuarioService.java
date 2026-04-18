package com.example.service;

import com.example.exception.CredenciaisInvalidasException;
import com.example.exception.NegocioException;
import com.example.model.LoginRequest;
import com.example.model.LoginResponse;
import com.example.model.Usuario;
import com.example.repository.UsuarioRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

@Singleton
public class UsuarioService {

    private final UsuarioRepository repository;

    @Inject
    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public LoginResponse cadastrar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new NegocioException("O campo 'nome' e obrigatorio.");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new NegocioException("O campo 'email' e obrigatorio.");
        }
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new NegocioException("O campo 'senha' e obrigatorio.");
        }
        if (usuario.getTipo() == null) {
            throw new NegocioException("O campo 'tipo' e obrigatorio (CLIENTE ou AGENTE).");
        }
        if (repository.existsByEmail(usuario.getEmail())) {
            throw new NegocioException("Ja existe um usuario cadastrado com este email.");
        }
        Usuario salvo = repository.save(usuario);
        return new LoginResponse(salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getTipo());
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getSenha() == null || request.getSenha().isBlank()) {
            throw new CredenciaisInvalidasException();
        }
        Usuario usuario = repository.findByEmail(request.getEmail())
                .orElseThrow(CredenciaisInvalidasException::new);
        if (!usuario.getSenha().equals(request.getSenha())) {
            throw new CredenciaisInvalidasException();
        }
        return new LoginResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getTipo());
    }
}

