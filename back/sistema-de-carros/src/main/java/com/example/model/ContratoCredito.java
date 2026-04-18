package com.example.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

@Entity
@Table(name = "contratos_credito")
@Serdeable
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @Column(nullable = false)
    private String bancoAgente;

    @Column(nullable = false)
    private Double valorFinanciado;

    @Column(nullable = false)
    private Integer numeroParcelas;

    @Column(nullable = false)
    private Double taxaJuros;

    public ContratoCredito() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public String getBancoAgente() { return bancoAgente; }
    public void setBancoAgente(String bancoAgente) { this.bancoAgente = bancoAgente; }

    public Double getValorFinanciado() { return valorFinanciado; }
    public void setValorFinanciado(Double valorFinanciado) { this.valorFinanciado = valorFinanciado; }

    public Integer getNumeroParcelas() { return numeroParcelas; }
    public void setNumeroParcelas(Integer numeroParcelas) { this.numeroParcelas = numeroParcelas; }

    public Double getTaxaJuros() { return taxaJuros; }
    public void setTaxaJuros(Double taxaJuros) { this.taxaJuros = taxaJuros; }
}
