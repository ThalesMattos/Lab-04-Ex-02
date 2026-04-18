package com.example.service;

import com.example.exception.NegocioException;
import com.example.model.ContratoCredito;
import com.example.model.Pedido;
import com.example.model.StatusPedido;
import com.example.model.TipoProprietario;
import com.example.repository.AutomovelRepository;
import com.example.repository.ContratoCreditoRepository;
import com.example.repository.PedidoRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Singleton
public class ContratoCreditoService {

    private final ContratoCreditoRepository repository;
    private final PedidoRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;

    @Inject
    public ContratoCreditoService(ContratoCreditoRepository repository,
                                  PedidoRepository pedidoRepository,
                                  AutomovelRepository automovelRepository) {
        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public List<ContratoCredito> listarTodos() {
        List<ContratoCredito> lista = new ArrayList<>();
        repository.findAll().forEach(lista::add);
        return lista;
    }

    @Transactional
    public ContratoCredito buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NegocioException("Contrato com ID " + id + " nao encontrado."));
    }

    @Transactional
    public ContratoCredito buscarPorPedido(Long pedidoId) {
        return repository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new NegocioException("Nenhum contrato associado ao pedido " + pedidoId + "."));
    }

    @Transactional
    public ContratoCredito associar(Long pedidoId, ContratoCredito contrato) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new NegocioException("Pedido com ID " + pedidoId + " nao encontrado."));

        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new NegocioException("So e possivel associar contrato a pedidos com status 'APROVADO'.");
        }

        if (repository.findByPedidoId(pedidoId).isPresent()) {
            throw new NegocioException("Ja existe um contrato associado a este pedido.");
        }

        validarDados(contrato);

        contrato.setPedido(pedido);
        ContratoCredito salvo = repository.save(contrato);

        // Avança status do pedido
        pedido.setStatus(StatusPedido.CONTRATO_EXECUCAO);
        pedidoRepository.update(pedido);

        // Registra auto como propriedade do banco até quitação
        var automovel = pedido.getAutomovel();
        automovel.setTipoProprietario(TipoProprietario.BANCO);
        automovel.setNomeProprietario(contrato.getBancoAgente());
        automovelRepository.update(automovel);

        return salvo;
    }

    private void validarDados(ContratoCredito c) {
        if (c.getBancoAgente() == null || c.getBancoAgente().isBlank()) {
            throw new NegocioException("O campo 'bancoAgente' e obrigatorio.");
        }
        if (c.getValorFinanciado() == null || c.getValorFinanciado() <= 0) {
            throw new NegocioException("O campo 'valorFinanciado' deve ser positivo.");
        }
        if (c.getNumeroParcelas() == null || c.getNumeroParcelas() <= 0) {
            throw new NegocioException("O campo 'numeroParcelas' deve ser positivo.");
        }
        if (c.getTaxaJuros() == null || c.getTaxaJuros() < 0) {
            throw new NegocioException("O campo 'taxaJuros' nao pode ser negativo.");
        }
    }
}
