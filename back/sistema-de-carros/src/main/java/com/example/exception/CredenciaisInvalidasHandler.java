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
@Requires(classes = {CredenciaisInvalidasException.class, ExceptionHandler.class})
public class CredenciaisInvalidasHandler
        implements ExceptionHandler<CredenciaisInvalidasException, HttpResponse<ErroResposta>> {

    @Override
    public HttpResponse<ErroResposta> handle(HttpRequest request, CredenciaisInvalidasException e) {
        return HttpResponse.status(HttpStatus.UNAUTHORIZED)
                .body(new ErroResposta(HttpStatus.UNAUTHORIZED.getCode(), e.getMessage()));
    }
}

