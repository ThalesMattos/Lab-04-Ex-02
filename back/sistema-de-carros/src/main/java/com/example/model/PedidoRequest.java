package com.example.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class PedidoRequest {
    private Long clienteId;
    private Long automovelId;
    private String dataInicio;
    private String dataFim;

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public Long getAutomovelId() { return automovelId; }
    public void setAutomovelId(Long automovelId) { this.automovelId = automovelId; }

    public String getDataInicio() { return dataInicio; }
    public void setDataInicio(String dataInicio) { this.dataInicio = dataInicio; }

    public String getDataFim() { return dataFim; }
    public void setDataFim(String dataFim) { this.dataFim = dataFim; }
}
