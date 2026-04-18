package com.example.controller;

import com.example.model.ContratoCredito;
import com.example.service.ContratoCreditoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

import java.util.List;

@Controller("/contratos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContratoCreditoController {

    private final ContratoCreditoService service;

    @Inject
    public ContratoCreditoController(ContratoCreditoService service) {
        this.service = service;
    }

    @Get
    public HttpResponse<List<ContratoCredito>> listarTodos() {
        return HttpResponse.ok(service.listarTodos());
    }

    @Get("/{id}")
    public HttpResponse<ContratoCredito> buscarPorId(@PathVariable Long id) {
        return HttpResponse.ok(service.buscarPorId(id));
    }

    @Get("/pedido/{pedidoId}")
    public HttpResponse<ContratoCredito> buscarPorPedido(@PathVariable Long pedidoId) {
        return HttpResponse.ok(service.buscarPorPedido(pedidoId));
    }

    @Post("/pedido/{pedidoId}")
    public HttpResponse<ContratoCredito> associar(@PathVariable Long pedidoId, @Body ContratoCredito contrato) {
        return HttpResponse.created(service.associar(pedidoId, contrato));
    }
}
