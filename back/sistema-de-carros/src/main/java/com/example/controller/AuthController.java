package com.example.controller;

import com.example.model.LoginRequest;
import com.example.model.LoginResponse;
import com.example.model.Usuario;
import com.example.service.UsuarioService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

@Controller("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    private final UsuarioService service;

    @Inject
    public AuthController(UsuarioService service) {
        this.service = service;
    }

    /**
     * POST /auth/cadastro
     * Registra um novo usuario no sistema.
     * Body: { "nome": "...", "email": "...", "senha": "..." }
     * Retorna os dados do usuario criado (sem a senha), status 201.
     */
    @Post("/cadastro")
    public HttpResponse<LoginResponse> cadastrar(@Body Usuario usuario) {
        LoginResponse resposta = service.cadastrar(usuario);
        return HttpResponse.created(resposta);
    }

    /**
     * POST /auth/login
     * Autentica um usuario pelo email e senha.
     * Body: { "email": "...", "senha": "..." }
     * Retorna os dados do usuario (sem a senha), status 200.
     * Retorna 401 se as credenciais forem invalidas.
     */
    @Post("/login")
    public HttpResponse<LoginResponse> login(@Body LoginRequest request) {
        LoginResponse resposta = service.login(request);
        return HttpResponse.ok(resposta);
    }
}

