package com.example.controller;

import com.example.exception.ErroResposta;
import com.example.model.Cliente;
import com.example.service.ClienteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

import java.util.List;

@Controller("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteController {

    private final ClienteService service;

    @Inject
    public ClienteController(ClienteService service) {
        this.service = service;
    }

    /**
     * GET /clientes
     * Lista todos os clientes cadastrados.
     */
    @Get
    public HttpResponse<List<Cliente>> listarTodos() {
        return HttpResponse.ok(service.listarTodos());
    }

    /**
     * GET /clientes/{id}
     * Busca um cliente pelo ID.
     */
    @Get("/{id}")
    public HttpResponse<Cliente> buscarPorId(@PathVariable Long id) {
        Cliente cliente = service.buscarPorId(id);
        return HttpResponse.ok(cliente);
    }

    /**
     * POST /clientes
     * Cadastra um novo cliente.
     */
    @Post
    public HttpResponse<Cliente> cadastrar(@Body Cliente cliente) {
        Cliente criado = service.cadastrar(cliente);
        return HttpResponse.created(criado);
    }

    /**
     * PUT /clientes/{id}
     * Atualiza os dados de um cliente existente.
     */
    @Put("/{id}")
    public HttpResponse<Cliente> atualizar(@PathVariable Long id, @Body Cliente dados) {
        Cliente atualizado = service.atualizar(id, dados);
        return HttpResponse.ok(atualizado);
    }

    /**
     * DELETE /clientes/{id}
     * Remove um cliente pelo ID.
     */
    @Delete("/{id}")
    public HttpResponse<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return HttpResponse.noContent();
    }
}

