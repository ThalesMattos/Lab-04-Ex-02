package com.example.repository;

import com.example.model.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    Optional<Automovel> findByPlaca(String placa);

    boolean existsByPlacaAndIdNot(String placa, Long id);

    List<Automovel> findByDisponivelTrue();
}
