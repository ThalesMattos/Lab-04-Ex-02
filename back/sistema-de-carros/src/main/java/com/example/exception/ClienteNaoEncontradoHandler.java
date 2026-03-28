package com.example.exception;

import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

@Produces
@Singleton
@Requires(classes = {ClienteNaoEncontradoException.class, ExceptionHandler.class})
public class ClienteNaoEncontradoHandler
        implements ExceptionHandler<ClienteNaoEncontradoException, HttpResponse<ErroResposta>> {

    @Override
    public HttpResponse<ErroResposta> handle(HttpRequest request, ClienteNaoEncontradoException e) {
        return HttpResponse.status(HttpStatus.NOT_FOUND)
                .body(new ErroResposta(HttpStatus.NOT_FOUND.getCode(), e.getMessage()));
    }
}

