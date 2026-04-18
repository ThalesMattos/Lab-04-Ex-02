package com.example.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Serdeable
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Embedded
    private Endereco endereco;

    private String profissao;

    @Column(unique = true)
    private Long usuarioId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cliente_empregadores",
                     joinColumns = @JoinColumn(name = "cliente_id"))
    private List<Empregador> empregadores = new ArrayList<>();

    public Cliente() {}

    public Cliente(Long id, String rg, String cpf, String nome,
                   Endereco endereco, String profissao, List<Empregador> empregadores) {
        this.id = id;
        this.rg = rg;
        this.cpf = cpf;
        this.nome = nome;
        this.endereco = endereco;
        this.profissao = profissao;
        this.empregadores = empregadores != null ? empregadores : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }

    public List<Empregador> getEmpregadores() { return empregadores; }
    public void setEmpregadores(List<Empregador> empregadores) { this.empregadores = empregadores; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
