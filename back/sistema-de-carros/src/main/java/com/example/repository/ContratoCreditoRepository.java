package com.example.repository;

import com.example.model.ContratoCredito;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByPedidoId(Long pedidoId);
}
