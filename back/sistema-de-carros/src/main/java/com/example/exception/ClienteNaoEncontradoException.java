package com.example.exception;
public class ClienteNaoEncontradoException extends RuntimeException {
    public ClienteNaoEncontradoException(Long id) {
        super("Cliente com id " + id + " nao encontrado.");
    }
}
