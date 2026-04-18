package com.example.service;

import com.example.exception.ClienteNaoEncontradoException;
import com.example.exception.NegocioException;
import com.example.model.Cliente;
import com.example.repository.ClienteRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Singleton
public class ClienteService {

    private static final int MAX_EMPREGADORES = 3;

    private final ClienteRepository repository;

    @Inject
    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public List<Cliente> listarTodos() {
        List<Cliente> lista = new ArrayList<>();
        repository.findAll().forEach(lista::add);
        return lista;
    }

    @Transactional
    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
    }

    @Transactional
    public Cliente buscarPorUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).orElse(null);
    }

    @Transactional
    public Cliente cadastrar(Cliente cliente) {
        validarDadosObrigatorios(cliente);
        validarEmpregadores(cliente);
        if (repository.findByCpf(cliente.getCpf()).isPresent()) {
            throw new NegocioException("Ja existe um cliente cadastrado com o CPF informado.");
        }
        return repository.save(cliente);
    }

    @Transactional
    public Cliente atualizar(Long id, Cliente dados) {
        Cliente existente = repository.findById(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
        validarDadosObrigatorios(dados);
        validarEmpregadores(dados);
        if (repository.existsByCpfAndIdNot(dados.getCpf(), id)) {
            throw new NegocioException("Ja existe outro cliente cadastrado com o CPF informado.");
        }
        existente.setRg(dados.getRg());
        existente.setCpf(dados.getCpf());
        existente.setNome(dados.getNome());
        existente.setEndereco(dados.getEndereco());
        existente.setProfissao(dados.getProfissao());
        existente.setEmpregadores(dados.getEmpregadores());
        return repository.update(existente);
    }

    @Transactional
    public void remover(Long id) {
        repository.findById(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
        repository.deleteById(id);
    }

    private void validarDadosObrigatorios(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new NegocioException("O campo 'nome' e obrigatorio.");
        }
        if (cliente.getCpf() == null || cliente.getCpf().isBlank()) {
            throw new NegocioException("O campo 'cpf' e obrigatorio.");
        }
        if (cliente.getRg() == null || cliente.getRg().isBlank()) {
            throw new NegocioException("O campo 'rg' e obrigatorio.");
        }
    }

    private void validarEmpregadores(Cliente cliente) {
        if (cliente.getEmpregadores() != null
                && cliente.getEmpregadores().size() > MAX_EMPREGADORES) {
            throw new NegocioException(
                "Um cliente pode ter no maximo " + MAX_EMPREGADORES + " entidades empregadoras."
            );
        }
    }
}
