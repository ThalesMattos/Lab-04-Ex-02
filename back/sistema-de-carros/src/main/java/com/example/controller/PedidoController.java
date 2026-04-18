package com.example.controller;

import com.example.model.*;
import com.example.service.PedidoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.util.List;

@Controller("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoController {

    private final PedidoService service;

    @Inject
    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @Get
    public HttpResponse<List<Pedido>> listarTodos() {
        return HttpResponse.ok(service.listarTodos());
    }

    @Get("/cliente/{clienteId}")
    public HttpResponse<List<Pedido>> listarPorCliente(@PathVariable Long clienteId) {
        return HttpResponse.ok(service.listarPorCliente(clienteId));
    }

    @Get("/status/{status}")
    public HttpResponse<List<Pedido>> listarPorStatus(@PathVariable StatusPedido status) {
        return HttpResponse.ok(service.listarPorStatus(status));
    }

    @Get("/{id}")
    public HttpResponse<Pedido> buscarPorId(@PathVariable Long id) {
        return HttpResponse.ok(service.buscarPorId(id));
    }

    @Post
    public HttpResponse<Pedido> criar(@Body PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setDataInicio(LocalDate.parse(request.getDataInicio()));
        pedido.setDataFim(LocalDate.parse(request.getDataFim()));
        Pedido criado = service.criar(request.getClienteId(), request.getAutomovelId(), pedido);
        return HttpResponse.created(criado);
    }

    @Put("/{id}")
    public HttpResponse<Pedido> modificarPeloCliente(@PathVariable Long id, @Body PedidoRequest request) {
        Pedido dados = new Pedido();
        if (request.getDataInicio() != null) dados.setDataInicio(LocalDate.parse(request.getDataInicio()));
        if (request.getDataFim() != null) dados.setDataFim(LocalDate.parse(request.getDataFim()));
        return HttpResponse.ok(service.modificarPeloCliente(id, request.getAutomovelId(), dados));
    }

    @Put("/{id}/avaliar")
    public HttpResponse<Pedido> avaliar(@PathVariable Long id, @Body AvaliacaoRequest request) {
        return HttpResponse.ok(service.avaliar(id, request.isAprovado(), request.getJustificativa()));
    }

    @Put("/{id}/agente")
    public HttpResponse<Pedido> modificarPeloAgente(@PathVariable Long id, @Body PedidoRequest request) {
        Pedido dados = new Pedido();
        if (request.getDataInicio() != null) dados.setDataInicio(LocalDate.parse(request.getDataInicio()));
        if (request.getDataFim() != null) dados.setDataFim(LocalDate.parse(request.getDataFim()));
        return HttpResponse.ok(service.modificarPeloAgente(id, request.getAutomovelId(), dados));
    }

    @Put("/{id}/cancelar")
    public HttpResponse<Pedido> cancelar(@PathVariable Long id) {
        return HttpResponse.ok(service.cancelar(id));
    }
}
