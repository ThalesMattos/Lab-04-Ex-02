package com.example.service;

import com.example.exception.NegocioException;
import com.example.model.*;
import com.example.repository.AutomovelRepository;
import com.example.repository.ClienteRepository;
import com.example.repository.PedidoRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Singleton
public class PedidoService {

    private final PedidoRepository repository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    @Inject
    public PedidoService(PedidoRepository repository,
                         ClienteRepository clienteRepository,
                         AutomovelRepository automovelRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public List<Pedido> listarTodos() {
        List<Pedido> lista = new ArrayList<>();
        repository.findAll().forEach(lista::add);
        return lista;
    }

    @Transactional
    public List<Pedido> listarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    @Transactional
    public List<Pedido> listarPorStatus(StatusPedido status) {
        return repository.findByStatus(status);
    }

    @Transactional
    public Pedido buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + id + " nao encontrado."));
    }

    @Transactional
    public Pedido criar(Long clienteId, Long automovelId, Pedido pedido) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NegocioException("Cliente com ID " + clienteId + " nao encontrado."));
        Automovel automovel = automovelRepository.findById(automovelId)
                .orElseThrow(() -> new NegocioException("Automovel com ID " + automovelId + " nao encontrado."));

        if (!automovel.isDisponivel()) {
            throw new NegocioException("O automovel selecionado nao esta disponivel.");
        }
        if (pedido.getDataInicio() == null || pedido.getDataFim() == null) {
            throw new NegocioException("As datas de inicio e fim sao obrigatorias.");
        }
        if (pedido.getDataFim().isBefore(pedido.getDataInicio())) {
            throw new NegocioException("A data de fim nao pode ser anterior a data de inicio.");
        }

        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setStatus(StatusPedido.AGUARDANDO_ANALISE);
        return repository.save(pedido);
    }

    @Transactional
    public Pedido modificarPeloCliente(Long id, Long automovelId, Pedido dados) {
        Pedido existente = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + id + " nao encontrado."));

        if (existente.getStatus() != StatusPedido.AGUARDANDO_ANALISE) {
            throw new NegocioException("Somente pedidos com status 'AGUARDANDO_ANALISE' podem ser modificados pelo cliente.");
        }

        if (automovelId != null && !automovelId.equals(existente.getAutomovel().getId())) {
            Automovel novoAutomovel = automovelRepository.findById(automovelId)
                    .orElseThrow(() -> new NegocioException("Automovel com ID " + automovelId + " nao encontrado."));
            if (!novoAutomovel.isDisponivel()) {
                throw new NegocioException("O automovel selecionado nao esta disponivel.");
            }
            existente.setAutomovel(novoAutomovel);
        }

        if (dados.getDataInicio() != null) existente.setDataInicio(dados.getDataInicio());
        if (dados.getDataFim() != null) existente.setDataFim(dados.getDataFim());

        if (existente.getDataFim().isBefore(existente.getDataInicio())) {
            throw new NegocioException("A data de fim nao pode ser anterior a data de inicio.");
        }

        existente.setStatus(StatusPedido.AGUARDANDO_ANALISE);
        return repository.update(existente);
    }

    @Transactional
    public Pedido cancelar(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + id + " nao encontrado."));

        if (pedido.getStatus() != StatusPedido.AGUARDANDO_ANALISE && pedido.getStatus() != StatusPedido.APROVADO) {
            throw new NegocioException("Somente pedidos com status 'AGUARDANDO_ANALISE' ou 'APROVADO' podem ser cancelados.");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        return repository.update(pedido);
    }

    @Transactional
    public Pedido avaliar(Long id, boolean aprovado, String justificativa) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + id + " nao encontrado."));

        if (pedido.getStatus() != StatusPedido.AGUARDANDO_ANALISE) {
            throw new NegocioException("Somente pedidos com status 'AGUARDANDO_ANALISE' podem ser avaliados.");
        }

        pedido.setStatus(aprovado ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
        pedido.setJustificativa(justificativa);
        return repository.update(pedido);
    }

    @Transactional
    public Pedido modificarPeloAgente(Long id, Long automovelId, Pedido dados) {
        Pedido existente = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + id + " nao encontrado."));

        if (existente.getStatus() != StatusPedido.AGUARDANDO_ANALISE && existente.getStatus() != StatusPedido.APROVADO) {
            throw new NegocioException("O agente so pode modificar pedidos com status 'AGUARDANDO_ANALISE' ou 'APROVADO'.");
        }

        if (automovelId != null && !automovelId.equals(existente.getAutomovel().getId())) {
            Automovel novoAutomovel = automovelRepository.findById(automovelId)
                    .orElseThrow(() -> new NegocioException("Automovel com ID " + automovelId + " nao encontrado."));
            existente.setAutomovel(novoAutomovel);
        }

        if (dados.getDataInicio() != null) existente.setDataInicio(dados.getDataInicio());
        if (dados.getDataFim() != null) existente.setDataFim(dados.getDataFim());

        return repository.update(existente);
    }
}
