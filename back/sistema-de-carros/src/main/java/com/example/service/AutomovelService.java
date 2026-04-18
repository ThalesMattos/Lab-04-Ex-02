package com.example.service;

import com.example.exception.NegocioException;
import com.example.model.Automovel;
import com.example.model.StatusPedido;
import com.example.repository.AutomovelRepository;
import com.example.repository.PedidoRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Singleton
public class AutomovelService {

    private final AutomovelRepository repository;
    private final PedidoRepository pedidoRepository;

    @Inject
    public AutomovelService(AutomovelRepository repository, PedidoRepository pedidoRepository) {
        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public List<Automovel> listarTodos() {
        List<Automovel> lista = new ArrayList<>();
        repository.findAll().forEach(lista::add);
        return lista;
    }

    @Transactional
    public List<Automovel> listarDisponiveis() {
        return repository.findByDisponivelTrue();
    }

    @Transactional
    public Automovel buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NegocioException("Automovel com ID " + id + " nao encontrado."));
    }

    @Transactional
    public Automovel cadastrar(Automovel automovel) {
        validarDados(automovel);
        if (repository.findByPlaca(automovel.getPlaca()).isPresent()) {
            throw new NegocioException("Ja existe um automovel cadastrado com a placa informada.");
        }
        automovel.setDisponivel(true);
        return repository.save(automovel);
    }

    @Transactional
    public Automovel atualizar(Long id, Automovel dados) {
        Automovel existente = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Automovel com ID " + id + " nao encontrado."));
        validarDados(dados);
        if (repository.existsByPlacaAndIdNot(dados.getPlaca(), id)) {
            throw new NegocioException("Ja existe outro automovel cadastrado com a placa informada.");
        }
        existente.setMatricula(dados.getMatricula());
        existente.setAno(dados.getAno());
        existente.setMarca(dados.getMarca());
        existente.setModelo(dados.getModelo());
        existente.setPlaca(dados.getPlaca());
        existente.setDisponivel(dados.isDisponivel());
        existente.setTipoProprietario(dados.getTipoProprietario());
        existente.setNomeProprietario(dados.getNomeProprietario());
        return repository.update(existente);
    }

    @Transactional
    public void remover(Long id) {
        Automovel automovel = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Automovel com ID " + id + " nao encontrado."));
        boolean temPedidoAtivo = pedidoRepository.findByAutomovelId(id).stream()
                .anyMatch(p -> p.getStatus() != StatusPedido.CANCELADO && p.getStatus() != StatusPedido.REPROVADO);
        if (temPedidoAtivo) {
            throw new NegocioException("Nao e possivel remover um automovel com pedidos em andamento.");
        }
        repository.deleteById(id);
    }

    private void validarDados(Automovel a) {
        if (a.getMatricula() == null || a.getMatricula().isBlank()) {
            throw new NegocioException("O campo 'matricula' e obrigatorio.");
        }
        if (a.getAno() == null) {
            throw new NegocioException("O campo 'ano' e obrigatorio.");
        }
        if (a.getMarca() == null || a.getMarca().isBlank()) {
            throw new NegocioException("O campo 'marca' e obrigatorio.");
        }
        if (a.getModelo() == null || a.getModelo().isBlank()) {
            throw new NegocioException("O campo 'modelo' e obrigatorio.");
        }
        if (a.getPlaca() == null || a.getPlaca().isBlank()) {
            throw new NegocioException("O campo 'placa' e obrigatorio.");
        }
    }
}
