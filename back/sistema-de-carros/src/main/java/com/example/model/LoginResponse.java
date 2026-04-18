package com.example.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class LoginResponse {

    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipo;

    public LoginResponse() {}

    public LoginResponse(Long id, String nome, String email, TipoUsuario tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }
}

