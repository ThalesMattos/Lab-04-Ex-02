package com.example.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Embeddable;

@Embeddable
@Serdeable
public class Empregador {
    private String nome;
    private Double rendimento;
    public Empregador() {}
    public Empregador(String nome, Double rendimento) {
        this.nome = nome;
        this.rendimento = rendimento;
    }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Double getRendimento() { return rendimento; }
    public void setRendimento(Double rendimento) { this.rendimento = rendimento; }
}
