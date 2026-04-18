package com.example.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class AvaliacaoRequest {
    private boolean aprovado;
    private String justificativa;

    public boolean isAprovado() { return aprovado; }
    public void setAprovado(boolean aprovado) { this.aprovado = aprovado; }

    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
}
