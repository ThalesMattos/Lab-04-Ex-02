package com.example.controller;

import com.example.model.Automovel;
import com.example.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

import java.util.List;

@Controller("/automoveis")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AutomovelController {

    private final AutomovelService service;

    @Inject
    public AutomovelController(AutomovelService service) {
        this.service = service;
    }

    @Get
    public HttpResponse<List<Automovel>> listarTodos() {
        return HttpResponse.ok(service.listarTodos());
    }

    @Get("/disponiveis")
    public HttpResponse<List<Automovel>> listarDisponiveis() {
        return HttpResponse.ok(service.listarDisponiveis());
    }

    @Get("/{id}")
    public HttpResponse<Automovel> buscarPorId(@PathVariable Long id) {
        return HttpResponse.ok(service.buscarPorId(id));
    }

    @Post
    public HttpResponse<Automovel> cadastrar(@Body Automovel automovel) {
        return HttpResponse.created(service.cadastrar(automovel));
    }

    @Put("/{id}")
    public HttpResponse<Automovel> atualizar(@PathVariable Long id, @Body Automovel dados) {
        return HttpResponse.ok(service.atualizar(id, dados));
    }

    @Delete("/{id}")
    public HttpResponse<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return HttpResponse.noContent();
    }
}
