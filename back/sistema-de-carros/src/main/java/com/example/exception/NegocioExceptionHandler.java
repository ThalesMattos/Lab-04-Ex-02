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
@Requires(classes = {NegocioException.class, ExceptionHandler.class})
public class NegocioExceptionHandler
        implements ExceptionHandler<NegocioException, HttpResponse<ErroResposta>> {

    @Override
    public HttpResponse<ErroResposta> handle(HttpRequest request, NegocioException e) {
        return HttpResponse.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(new ErroResposta(HttpStatus.UNPROCESSABLE_ENTITY.getCode(), e.getMessage()));
    }
}

